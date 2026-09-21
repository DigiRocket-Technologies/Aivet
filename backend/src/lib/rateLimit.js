// Sliding-window rate limiter middleware factory.
//
// Two things this gets right that a naive implementation does not:
//
//   • The IP is resolved from headers a remote client cannot forge. The common
//     `x-forwarded-for.split(",")[0]` takes the LEFTMOST entry, which is simply
//     whatever the caller sent — any limiter keyed on it is bypassed by
//     rotating a header. Taking the rightmost entry is not sufficient either:
//     with no proxy in front, a forged header is the only entry, so rightmost
//     and leftmost are the same attacker-controlled value. Hence the trust
//     gate below.
//
//   • Counters live in Mongo, shared across instances. A per-process Map gives
//     each warm serverless container its own allowance, so the effective cap
//     becomes `limit × N(containers)` and the configured number is never the
//     real one. The in-process counter is kept only as a fallback for when
//     Mongo is unreachable, so a database blip degrades the limiter rather
//     than switching it off.
//
// Usage:
//   const limiter = createRateLimiter({
//     name: "auth_login_ip",          // namespaces the shared bucket
//     windowMs: 15 * 60 * 1000,
//     limit: 10,
//     keyFn: keyByIp,
//     message: "Too many attempts. Try again in {retry}s.",
//   });
//   router.post("/login", limiter, handler);

import mongoose from "mongoose";
import { RateLimitBucket } from "../models/index.js";

// Is there a trusted reverse proxy in front of this process?
//
// Forwarded headers are only meaningful when something we trust sets them. On
// Vercel the platform terminates the connection and populates
// x-vercel-forwarded-for / x-real-ip itself, so they can be believed. Running
// directly there is no such proxy and every forwarded header is just bytes the
// caller typed. TRUST_PROXY=1/0 overrides for deployments behind nginx or a
// load balancer this cannot infer.
function proxyIsTrusted() {
  const explicit = process.env.TRUST_PROXY;
  if (explicit === "1") return true;
  if (explicit === "0") return false;
  return Boolean(process.env.VERCEL);
}

export function clientIpFromRequest(req) {
  if (proxyIsTrusted()) {
    const platform =
      String(req.headers["x-vercel-forwarded-for"] ?? "").trim() ||
      String(req.headers["x-real-ip"] ?? "").trim();
    if (platform) return platform.split(",")[0].trim();

    // Each proxy appends the address it received the connection from, so the
    // last entry was written by the closest trusted proxy. Anything the client
    // injected sits to its left.
    const parts = String(req.headers["x-forwarded-for"] ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }

  return req.socket?.remoteAddress ?? req.ip ?? "unknown";
}

export function keyByIp(req) {
  return `ip:${clientIpFromRequest(req)}`;
}

export function keyByEmail(req) {
  const e = String(req.body?.email ?? "").trim().toLowerCase();
  return e ? `email:${e}` : null;
}

// ALLOW: force the in-process counter (tests, or running without a database).
function sharedStoreEnabled() {
  if (process.env.RATE_LIMIT_STORE === "memory") return false;
  return mongoose.connection?.readyState === 1;
}

export function createRateLimiter({ windowMs, limit, keyFn, message, name }) {
  if (!Number.isFinite(windowMs) || windowMs <= 0) {
    throw new Error("createRateLimiter: windowMs must be a positive number");
  }
  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error("createRateLimiter: limit must be a positive number");
  }
  if (typeof keyFn !== "function") {
    throw new Error("createRateLimiter: keyFn must be a function (req) => string");
  }
  // Namespaces the shared bucket so two limiters using the same key function
  // (both keyByIp, different routes) never contend.
  if (!name || typeof name !== "string") {
    throw new Error("createRateLimiter: name must be a non-empty string");
  }

  const buckets = new Map();
  let inserts = 0;

  function consumeInMemory(scopedKey) {
    const now = Date.now();
    let bucket = buckets.get(scopedKey);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(scopedKey, bucket);
      inserts += 1;
      if (inserts >= 200) {
        inserts = 0;
        for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
      }
    }
    bucket.count += 1;
    return { count: bucket.count, resetAt: new Date(bucket.resetAt) };
  }

  async function consume(scopedKey) {
    if (!sharedStoreEnabled()) return consumeInMemory(scopedKey);
    try {
      const doc = await RateLimitBucket.consume(scopedKey, windowMs);
      if (doc && typeof doc.count === "number") return doc;
      return consumeInMemory(scopedKey);
    } catch (err) {
      console.error(
        `[rate-limit:${name}] shared store unavailable, using in-process counter:`,
        err?.message
      );
      return consumeInMemory(scopedKey);
    }
  }

  return async function rateLimiter(req, res, next) {
    let key;
    try {
      key = keyFn(req);
    } catch {
      key = null;
    }
    // Fail open — a key-extraction error must never break the endpoint.
    if (!key || typeof key !== "string") return next();

    let bucket;
    try {
      bucket = await consume(`${name}:${key}`);
    } catch {
      return next();
    }

    if (bucket.count > limit) {
      const retryInSec = Math.max(
        1,
        Math.ceil((new Date(bucket.resetAt).getTime() - Date.now()) / 1000)
      );
      try {
        res.set("Retry-After", String(retryInSec));
      } catch {
        /* ignore header setter errors */
      }
      return res.status(429).json({
        success: false,
        error: "rate_limited",
        retryAfterSeconds: retryInSec,
        message: (message ?? "Too many requests. Try again in {retry}s.").replace(
          "{retry}",
          String(retryInSec)
        ),
      });
    }
    return next();
  };
}

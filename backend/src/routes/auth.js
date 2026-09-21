import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User, Team, MagicLinkToken } from "../models/index.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { sendMagicLinkEmail } from "../lib/email.js";
import { createRateLimiter, keyByEmail, keyByIp } from "../lib/rateLimit.js";
import { isDisposableEmail, disposableEmailResponse } from "../lib/disposableEmail.js";

const router = Router();

// ── Abuse controls ────────────────────────────────────────────────────────
// /login had no cap at all, which makes password guessing free. /register and
// the magic-link sender had none either, so one script could mint accounts or
// spam a victim's inbox without limit.
//
// Note the two layers do different jobs and neither replaces the other: the
// per-email caps slow down reuse of one address, while the disposable-domain
// check below stops someone cycling through an endless supply of fresh ones.

const loginLimiterByEmail = createRateLimiter({
  name: "auth_login_email",
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyFn: keyByEmail,
  message: "Too many sign-in attempts for this account. Try again in {retry}s.",
});
const loginLimiterByIp = createRateLimiter({
  name: "auth_login_ip",
  windowMs: 15 * 60 * 1000,
  limit: 30,
  keyFn: keyByIp,
  message: "Too many sign-in attempts from this device. Try again in {retry}s.",
});
const registerLimiterByIp = createRateLimiter({
  name: "auth_register_ip",
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyFn: keyByIp,
  message: "Too many accounts created from this device. Try again in {retry}s.",
});
const magicLinkLimiterByEmail = createRateLimiter({
  name: "auth_magiclink_email",
  windowMs: 15 * 60 * 1000,
  limit: 3,
  keyFn: keyByEmail,
  message:
    "A sign-in link was just sent to this email. Check your inbox and spam folder, then wait {retry}s before requesting another.",
});
const magicLinkLimiterByIp = createRateLimiter({
  name: "auth_magiclink_ip",
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyFn: keyByIp,
  message: "Too many sign-in requests from this device. Try again in {retry}s.",
});

// ── Helpers ───────────────────────────────────────────────────────────────
function parseExpiry(s) {
  const m = String(s ?? "15m").match(/^(\d+)([smhd])$/);
  if (!m) return 15 * 60 * 1000;
  const n = Number(m[1]);
  return n * { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[m[2]];
}

async function ensureTeamForUser(user) {
  let team = await Team.findOne({ "members.userId": user._id });
  if (team) return team;
  const slug = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30) + "-" + Date.now();
  return Team.create({
    name:    `${user.fullName}'s Workspace`,
    slug,
    ownerId: user._id,
    members: [{ userId: user._id, role: "owner", joinedAt: new Date() }],
  });
}

// ── Password-based auth ───────────────────────────────────────────────────

// POST /api/auth/register
router.post("/register", registerLimiterByIp, async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName)
      return res.status(400).json({ success: false, message: "All fields required" });

    if (isDisposableEmail(email))
      return res.status(403).json(disposableEmailResponse(email));

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, fullName });
    const team = await ensureTeamForUser(user);
    const token = signToken(user._id.toString());
    res.status(201).json({
      success: true,
      data: { token, userId: user._id, email: user.email, fullName: user.fullName, teamId: team._id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", loginLimiterByEmail, loginLimiterByIp, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    user.lastLoginAt = new Date();
    await user.save();

    const team = await ensureTeamForUser(user);
    const token = signToken(user._id.toString());
    res.json({
      success: true,
      data: { token, userId: user._id, email: user.email, fullName: user.fullName, teamId: team._id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Magic-link auth ───────────────────────────────────────────────────────

// POST /api/auth/magic-link/send  { email, fullName? }
router.post("/magic-link/send", magicLinkLimiterByEmail, magicLinkLimiterByIp, async (req, res) => {
  try {
    const { email, fullName } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    // Refused only when the address has never registered. Someone who signed
    // up with a throwaway address before this check existed should still be
    // able to get back into their account; locking them out is worse than
    // having accepted the address in the first place.
    if (isDisposableEmail(email)) {
      let known = false;
      try {
        known = Boolean(await User.exists({ email: String(email).toLowerCase() }));
      } catch (err) {
        // Fail open: a database blip must not become a sign-in outage.
        console.error("[auth] user lookup failed for disposable check (allowing):", err?.message);
        known = true;
      }
      if (!known) return res.status(403).json(disposableEmailResponse(email));
    }

    // Always respond success to avoid user enumeration
    const raw = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
    const ttl = parseExpiry(process.env.MAGIC_LINK_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + ttl);
    const purpose = (await User.findOne({ email })) ? "login" : "signup";

    await MagicLinkToken.create({ email: email.toLowerCase(), tokenHash, expiresAt, purpose });

    const url = `${process.env.FRONTEND_URL}/auth/verify?token=${raw}&email=${encodeURIComponent(email)}${
      fullName ? `&fullName=${encodeURIComponent(fullName)}` : ""
    }`;
    await sendMagicLinkEmail(email, url);

    res.json({ success: true, message: "Magic link sent if the email is valid" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/magic-link/verify  { token, email, fullName? }
router.post("/magic-link/verify", async (req, res) => {
  try {
    const { token, email, fullName } = req.body;
    if (!token || !email)
      return res.status(400).json({ success: false, message: "Token and email required" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const record = await MagicLinkToken.findOne({
      tokenHash,
      email: email.toLowerCase(),
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });
    if (!record) return res.status(401).json({ success: false, message: "Invalid or expired link" });

    record.usedAt = new Date();
    await record.save();

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        email:      email.toLowerCase(),
        fullName:   fullName ?? email.split("@")[0],
        isVerified: true,
      });
    } else {
      user.isVerified  = true;
      user.lastLoginAt = new Date();
      await user.save();
    }

    const team = await ensureTeamForUser(user);
    const jwt  = signToken(user._id.toString());
    res.json({
      success: true,
      data: { token: jwt, userId: user._id, email: user.email, fullName: user.fullName, teamId: team._id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      id:        req.user._id,
      email:     req.user.email,
      fullName:  req.user.fullName,
      avatarUrl: req.user.avatarUrl,
    },
  });
});

export default router;

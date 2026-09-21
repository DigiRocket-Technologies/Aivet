// Disposable / throwaway email detection.
//
// Rate limiting cannot stop signup abuse on its own: per-email caps only slow
// down reuse of one address, and throwaway providers hand out unlimited fresh
// ones. That matters here because a visibility run fans out to paid AI-engine
// and DataForSEO calls, so an unlimited supply of addresses is an unlimited
// supply of spend.
//
// This blocks known throwaway providers, not "suspicious" addresses. It will
// never catch every one — new domains appear faster than any list is updated —
// so treat it as one layer alongside rate limiting, not a replacement.
//
// Regenerate the domain list with:
//   node scripts/update-disposable-domains.mjs

import { DISPOSABLE_EMAIL_DOMAINS } from "../../data/disposableEmailDomains.js";

let _blocklist = null;

function buildBlocklist() {
  const set = new Set(DISPOSABLE_EMAIL_DOMAINS);

  // Domains spotted before the upstream list catches up. Comma separated.
  for (const d of (process.env.EXTRA_DISPOSABLE_DOMAINS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)) {
    set.add(d);
  }

  // Escape hatch for a legitimate domain the upstream list gets wrong.
  // Takes precedence over both sources above.
  for (const d of (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)) {
    set.delete(d);
  }

  return set;
}

export function getBlocklist() {
  if (!_blocklist) _blocklist = buildBlocklist();
  return _blocklist;
}

export function resetBlocklist() {
  _blocklist = null;
}

export function domainOfEmail(email) {
  const at = String(email ?? "").lastIndexOf("@");
  return at < 0 ? "" : String(email).slice(at + 1).toLowerCase().trim();
}

// True when the address belongs to a known throwaway provider.
//
// ALLOW_DISPOSABLE_EMAIL=1 disables the check entirely — useful for local
// testing, and as a kill switch if the list ever rejects real customers.
export function isDisposableEmail(email) {
  if (process.env.ALLOW_DISPOSABLE_EMAIL === "1") return false;

  const domain = domainOfEmail(email);
  if (!domain) return false;

  const blocklist = getBlocklist();
  if (blocklist.has(domain)) return true;

  // Throwaway providers hand out endless subdomains off one blocked apex
  // (mail.example.com, inbox.example.com), so walk up the labels. Stop before
  // the bare TLD: a two-label check is the apex itself, and matching a single
  // label would blocklist an entire TLD.
  const parts = domain.split(".");
  for (let i = 1; i <= parts.length - 2; i += 1) {
    if (blocklist.has(parts.slice(i).join("."))) return true;
  }

  return false;
}

// Standard refusal body, so the message is identical wherever it is used.
export function disposableEmailResponse(email) {
  return {
    success: false,
    error: "disposable_email",
    message:
      "Please use a permanent work or personal email address. Temporary and disposable addresses are not accepted.",
    domain: domainOfEmail(email),
  };
}

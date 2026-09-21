import nodemailer from "nodemailer";

// Provider resolution, highest priority first:
//
//   1. BREVO_API_KEY   → Brevo's HTTPS API. Preferred on serverless: the
//                        runtime is unreliable at holding outbound SMTP
//                        sockets open, and an HTTPS POST has none of that.
//   2. RESEND_API_KEY  → Resend's HTTPS API, same reasoning.
//   3. SMTP_*          → generic SMTP (SendGrid, Brevo relay, Mailgun, SES).
//   4. nothing         → log the mail instead of sending, as before.
//
// Why this replaced the single hard-coded transport: it sent `secure: false`
// on whatever SMTP_PORT was given, and on port 465 (implicit TLS) that fails
// the handshake outright. The default of Gmail plus an App Password also dies
// silently whenever 2-Step Verification is touched on the account — which is
// exactly how sign-in broke on the predecessor service, with no error until a
// user reported it.
//
// Auth failures normalise to err.code === "EAUTH" across every provider, so
// callers can tell "the credentials are wrong, retrying is futile" from a
// transient network blip.

let cachedTransporter = null;
let cachedProvider = null;

// The existing .env uses the GMAIL_* names rather than SMTP_*. Alias them so
// credentials work without renaming anything.
const SMTP_USER = () => process.env.SMTP_USER ?? process.env.GMAIL_ACCOUNT;
const SMTP_PASS = () => process.env.SMTP_PASS ?? process.env.GMAIL_APP_PASSWORD;
const SMTP_HOST = () =>
  process.env.SMTP_HOST ?? (process.env.GMAIL_ACCOUNT ? "smtp.gmail.com" : undefined);

export function getMailProvider() {
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.RESEND_API_KEY) return "resend";
  if (SMTP_HOST() && SMTP_USER() && SMTP_PASS()) return "smtp";
  return null;
}

// Credentials get pasted through dashboards, which is how a trailing newline
// or a run of display spaces ends up inside one. Keys never legitimately
// contain whitespace.
const cleanSecret = (raw) => String(raw ?? "").replace(/\s+/g, "");

function authError(message) {
  const err = new Error(message);
  err.code = "EAUTH";
  return err;
}

// Callers pass `from` as a bare address or the RFC 5322 display form,
// `AIVet <no-reply@example.com>`. The HTTP APIs want the parts split.
function parseAddress(value) {
  const raw = String(value ?? "").trim();
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m
    ? { name: m[1].replace(/^"|"$/g, "").trim(), email: m[2].trim() }
    : { email: raw };
}

function toRecipients(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : String(value).split(","))
    .map(parseAddress)
    .filter((r) => r.email)
    .map((r) => (r.name ? { email: r.email, name: r.name } : { email: r.email }));
}

function buildBrevoTransport() {
  const apiKey = cleanSecret(process.env.BREVO_API_KEY);
  return {
    provider: "brevo",
    async sendMail({ from, to, cc, subject, html, text, headers }) {
      const sender = parseAddress(from);
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: sender.name
            ? { name: sender.name, email: sender.email }
            : { email: sender.email },
          to: toRecipients(to),
          ...(cc ? { cc: toRecipients(cc) } : {}),
          subject,
          ...(html ? { htmlContent: html } : {}),
          ...(text ? { textContent: text } : {}),
          ...(headers && Object.keys(headers).length ? { headers } : {}),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) return { messageId: body?.messageId ?? "", response: "brevo:ok" };
      if (res.status === 401 || res.status === 403) {
        throw authError(
          `Brevo rejected the API key (HTTP ${res.status}): ${body?.message ?? "unauthorised"}`
        );
      }
      // 400 is usually sender_not_valid — the From address has not been
      // authorised as a sender in the Brevo dashboard.
      const err = new Error(
        `Brevo send failed (HTTP ${res.status}): ${body?.message ?? "unknown error"}`
      );
      err.code = res.status === 400 ? "EMESSAGE" : "ECONNECTION";
      throw err;
    },
    async verify() {
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": apiKey, accept: "application/json" },
      });
      if (res.status === 401 || res.status === 403) {
        throw authError(`Brevo rejected the API key (HTTP ${res.status})`);
      }
      if (!res.ok) {
        const e = new Error(`Brevo unreachable (HTTP ${res.status})`);
        e.code = "ECONNECTION";
        throw e;
      }
      return true;
    },
  };
}

function buildResendTransport() {
  const apiKey = cleanSecret(process.env.RESEND_API_KEY);
  const asArray = (v) =>
    (Array.isArray(v) ? v : String(v ?? "").split(",").map((x) => x.trim())).filter(Boolean);
  return {
    provider: "resend",
    async sendMail({ from, to, cc, subject, html, text, headers }) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: asArray(to),
          ...(cc ? { cc: asArray(cc) } : {}),
          subject,
          ...(html ? { html } : {}),
          ...(text ? { text } : {}),
          ...(headers && Object.keys(headers).length ? { headers } : {}),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) return { messageId: body?.id ?? "", response: "resend:ok" };
      if (res.status === 401 || res.status === 403) {
        throw authError(
          `Resend rejected the API key (HTTP ${res.status}): ${body?.message ?? "unauthorised"}`
        );
      }
      const err = new Error(
        `Resend send failed (HTTP ${res.status}): ${body?.message ?? "unknown error"}`
      );
      err.code = res.status === 422 ? "EMESSAGE" : "ECONNECTION";
      throw err;
    },
    async verify() {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.status === 401 || res.status === 403) {
        throw authError(`Resend rejected the API key (HTTP ${res.status})`);
      }
      if (!res.ok) {
        const e = new Error(`Resend unreachable (HTTP ${res.status})`);
        e.code = "ECONNECTION";
        throw e;
      }
      return true;
    },
  };
}

function buildSmtpTransport() {
  // Port drives the TLS mode: 465 is implicit TLS (secure: true), everything
  // else is STARTTLS (secure: false + requireTLS). Getting this pair wrong is
  // how you get "wrong version number" handshake failures.
  const usingGmail = !process.env.SMTP_HOST && Boolean(process.env.GMAIL_ACCOUNT);
  // Gmail's implicit-TLS port. Default to it when falling back to Gmail, so we
  // never pair `secure: true` with 587 (or `secure: false` with 465).
  const port = Number(process.env.SMTP_PORT ?? (usingGmail ? 465 : 587));
  const secure =
    process.env.SMTP_SECURE != null
      ? String(process.env.SMTP_SECURE).toLowerCase() === "true"
      : port === 465;
  return nodemailer.createTransport({
    host: String(SMTP_HOST() ?? "").trim(),
    port,
    secure,
    ...(secure ? {} : { requireTLS: true }),
    auth: {
      user: String(SMTP_USER() ?? "").trim(),
      pass: cleanSecret(SMTP_PASS()),
    },
  });
}

export function getTransporter() {
  const provider = getMailProvider();
  if (!provider) return null;
  // Rebuild if the provider changed under us — a key rotation can flip the
  // environment between calls inside a warm container.
  if (cachedTransporter && cachedProvider === provider) return cachedTransporter;
  cachedTransporter =
    provider === "brevo"
      ? buildBrevoTransport()
      : provider === "resend"
        ? buildResendTransport()
        : buildSmtpTransport();
  cachedProvider = provider;
  return cachedTransporter;
}

export function resetTransporter() {
  cachedTransporter = null;
  cachedProvider = null;
}

export async function sendEmail({ to, subject, html, text, cc, headers }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] No mail provider configured, logging email instead:");
    console.warn({ to, subject, text: text ?? html?.slice(0, 200) });
    return { skipped: true };
  }
  const from =
    process.env.MAIL_FROM_ADDRESS ??
    process.env.RESEND_FROM ??
    process.env.SMTP_FROM ??
    `AIVet <${SMTP_USER()}>`;
  const info = await transporter.sendMail({ from, to, subject, html, text, cc, headers });
  return { messageId: info.messageId };
}

function buildMagicLinkEmailHtml(link, ttlMin) {
  return `<!doctype html>
<html><body style="font-family:Arial,sans-serif;background:#fafafa;padding:0;margin:0;">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e8;">
    <div style="background:#0d0d0d;padding:24px;color:#fff;">
      <div style="font-size:13px;letter-spacing:1px;color:#C9F31D;text-transform:uppercase;font-weight:700;">AIVET by Digirocket</div>
      <h1 style="margin:6px 0 0;font-size:22px;color:#fff;">Sign in to AIVET</h1>
    </div>
    <div style="padding:28px;">
      <p style="font-size:15px;color:#333;margin-top:0;">Click the button below to sign in to your AIVET dashboard. This link expires in ${ttlMin} minutes and can only be used once.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${link}" style="background:#C9F31D;color:#000;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:700;display:inline-block;">Sign in to AIVET</a>
      </div>
      <p style="font-size:13px;color:#666;margin-bottom:6px;">Or paste this link into your browser:</p>
      <p style="font-size:12px;color:#999;word-break:break-all;background:#f7f7f7;padding:12px;border-radius:8px;">${link}</p>
      <p style="font-size:12px;color:#999;margin-top:24px;">If you didn't request this email, you can safely ignore it — no account changes were made.</p>
    </div>
    <div style="background:#f7f7f7;padding:16px;text-align:center;color:#999;font-size:12px;">AIVET — AI Visibility Enhancement Tool by Digirocket.</div>
  </div>
</body></html>`;
}

export async function sendMagicLinkEmail(email, magicUrl, ttlMin = 15) {
  return sendEmail({
    to: email,
    subject: "Sign in to AIVET",
    html: buildMagicLinkEmailHtml(magicUrl, ttlMin),
    text: `Sign in to AIVET: ${magicUrl}\n\nThis link expires in ${ttlMin} minutes and can only be used once.\n\nIf you didn't request this email, you can safely ignore it.`,
  });
}

export async function sendAlertEmail(email, { projectName, scoreChange, currentScore }) {
  const direction = scoreChange >= 0 ? "up" : "down";
  const arrow = scoreChange >= 0 ? "↑" : "↓";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
      <h2>Visibility alert: ${projectName}</h2>
      <p>Your AI visibility score has moved <strong>${direction}</strong>.</p>
      <p style="font-size:24px;"><strong>${currentScore}</strong> ${arrow} ${Math.abs(scoreChange).toFixed(1)}</p>
    </div>
  `;
  return sendEmail({ to: email, subject: `AIVet alert: ${projectName} score ${direction}`, html });
}

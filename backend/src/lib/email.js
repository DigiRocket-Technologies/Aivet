import nodemailer from "nodemailer";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return cachedTransporter;
}

export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER) {
    console.warn("[email] SMTP not configured, logging email instead:");
    console.warn({ to, subject, text: text ?? html?.slice(0, 200) });
    return { skipped: true };
  }
  const from = process.env.SMTP_FROM ?? `AIVet <${process.env.SMTP_USER}>`;
  const info = await getTransporter().sendMail({ from, to, subject, html, text });
  return { messageId: info.messageId };
}

export async function sendMagicLinkEmail(email, magicUrl) {
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
      <h2 style="color:#111;">Sign in to AIVet</h2>
      <p style="color:#444;font-size:15px;line-height:1.5;">
        Click the button below to sign in. This link expires in 15 minutes.
      </p>
      <p style="margin:24px 0;">
        <a href="${magicUrl}" style="background:#111;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">
          Sign in
        </a>
      </p>
      <p style="color:#888;font-size:13px;">
        Or copy and paste this link:<br/>
        <a href="${magicUrl}" style="color:#666;word-break:break-all;">${magicUrl}</a>
      </p>
      <p style="color:#aaa;font-size:12px;margin-top:32px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
  return sendEmail({
    to: email,
    subject: "Your AIVet sign-in link",
    html,
    text: `Sign in to AIVet: ${magicUrl}\n\nThis link expires in 15 minutes.`,
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

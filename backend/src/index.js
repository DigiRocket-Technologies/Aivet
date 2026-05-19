import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./lib/db.js";
import authRoutes       from "./routes/auth.js";
import projectRoutes    from "./routes/projects.js";
import campaignRoutes   from "./routes/campaigns.js";
import visibilityRoutes from "./routes/visibility.js";
import billingRoutes    from "./routes/billing.js";
import reportRoutes     from "./routes/reports.js";
import webhookRoutes    from "./routes/webhooks.js";

const app  = express();
const PORT = process.env.PORT ?? 8000;

// ── Security & logging ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.FRONTEND_URL ?? "http://localhost:3000").split(","),
  credentials: true,
}));
app.use(cookieParser());
app.use(morgan("dev"));

// ── Webhooks MUST come before express.json() so the Stripe route can
//    receive a raw Buffer for signature verification. The route itself
//    applies express.raw() / express.json() per handler.
app.use("/api/webhooks", webhookRoutes);

// JSON body parser for the rest of the API
app.use(express.json({ limit: "1mb" }));

// ── App routes ────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/projects",  projectRoutes);
app.use("/api/projects",  visibilityRoutes);   // /api/projects/:id/dashboard
app.use("/api/campaigns", campaignRoutes);
app.use("/api/billing",   billingRoutes);
app.use("/api/reports",   reportRoutes);

// ── Health ────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", version: "1.0.0" }));
app.get("/",       (_, res) => res.json({ name: "AIVet API", version: "1.0.0" }));

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message ?? "Internal server error" });
});

// ── Bootstrap: connect DB then listen. On Vercel we export the handler. ──
const isVercel = !!process.env.VERCEL;

if (!isVercel) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`🚀 AIVet API on http://localhost:${PORT}`)))
    .catch((err) => { console.error("❌ DB connection failed:", err.message); process.exit(1); });
} else {
  // On Vercel, ensure DB is connected once per cold start.
  connectDB().catch((err) => console.error("❌ DB connection failed:", err.message));
}

export default app;

import { Router } from "express";
import { getStripe, priceIdForPlan, PLAN_LIMITS } from "../lib/stripe.js";
import { Team, Subscription } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// POST /api/billing/checkout — create Stripe checkout session
router.post("/checkout", async (req, res) => {
  try {
    const { plan } = req.body;
    const priceId = priceIdForPlan(plan);
    if (!priceId) return res.status(400).json({ success: false, message: "Unknown plan" });

    const team = await Team.findOne({ "members.userId": req.user._id });
    if (!team) return res.status(404).json({ success: false, message: "No team found" });

    const stripe = getStripe();
    let sub = await Subscription.findOne({ teamId: team._id });

    // Ensure Stripe customer exists
    let customerId = sub?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name:  req.user.fullName,
        metadata: { teamId: team._id.toString(), userId: req.user._id.toString() },
      });
      customerId = customer.id;
      sub = await Subscription.findOneAndUpdate(
        { teamId: team._id },
        { teamId: team._id, stripeCustomerId: customerId },
        { upsert: true, new: true }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/billing?status=success`,
      cancel_url:  `${process.env.FRONTEND_URL}/billing?status=canceled`,
      metadata: { teamId: team._id.toString(), plan },
    });

    res.json({ success: true, data: { url: session.url } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/billing/portal — Stripe customer portal session
router.post("/portal", async (req, res) => {
  try {
    const team = await Team.findOne({ "members.userId": req.user._id });
    const sub  = await Subscription.findOne({ teamId: team?._id });
    if (!sub?.stripeCustomerId) {
      return res.status(400).json({ success: false, message: "No Stripe customer yet" });
    }
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });
    res.json({ success: true, data: { url: session.url } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/billing/subscription — current sub + limits
router.get("/subscription", async (req, res) => {
  try {
    const team = await Team.findOne({ "members.userId": req.user._id });
    const sub  = await Subscription.findOne({ teamId: team?._id });
    const plan = sub?.plan ?? team?.plan ?? "free";
    res.json({
      success: true,
      data: {
        plan,
        status:            sub?.status            ?? "active",
        currentPeriodEnd:  sub?.currentPeriodEnd  ?? null,
        cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
        limits:            PLAN_LIMITS[plan],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

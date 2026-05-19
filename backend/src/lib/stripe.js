import Stripe from "stripe";

let cached = null;

export function getStripe() {
  if (cached) return cached;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  cached = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  return cached;
}

export const PLAN_LIMITS = {
  free:       { promptLimit: 100,    projectLimit: 1 },
  starter:    { promptLimit: 1000,   projectLimit: 3 },
  pro:        { promptLimit: 10000,  projectLimit: 10 },
  enterprise: { promptLimit: 100000, projectLimit: 50 },
};

export function planFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_STARTER)    return "starter";
  if (priceId === process.env.STRIPE_PRICE_PRO)        return "pro";
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return "enterprise";
  return "free";
}

export function priceIdForPlan(plan) {
  return {
    starter:    process.env.STRIPE_PRICE_STARTER,
    pro:        process.env.STRIPE_PRICE_PRO,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  }[plan];
}

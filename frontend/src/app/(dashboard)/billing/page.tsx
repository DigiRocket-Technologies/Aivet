"use client";

import Topbar from "@/components/shared/Topbar";
import {
  CheckCircle2, Zap, Crown, Building2,
  CreditCard, Calendar, Download, TrendingUp, Users, Activity,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Starter", price: 49, icon: Zap, color: "#22B8CF",
    features: [
      "1 project",
      "100 prompts/month",
      "4 AI models",
      "Basic GEO recommendations",
      "CSV export",
    ],
    current: false,
  },
  {
    name: "Pro", price: 149, icon: Crown, color: "#C9F31D",
    features: [
      "5 projects",
      "1,000 prompts/month",
      "4 AI models + Google AI",
      "Advanced GEO engine",
      "PDF + CSV reports",
      "Competitor tracking (5)",
      "Scheduled reports",
      "API access",
    ],
    current: true,
  },
  {
    name: "Enterprise", price: 499, icon: Building2, color: "#C084FC",
    features: [
      "Unlimited projects",
      "10,000 prompts/month",
      "All AI models",
      "White-label reports",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Team workspaces",
    ],
    current: false,
  },
];

const USAGE = [
  { label: "Prompts Used",  used: 742,  total: 1000, color: "#C9F31D"  },
  { label: "Projects",      used: 3,    total: 5,    color: "#22B8CF"  },
  { label: "API Calls",     used: 1240, total: 5000, color: "#C084FC"  },
];

const INVOICES = [
  { date: "Jul 1, 2025",  amount: "$149.00", status: "paid",    id: "INV-2025-007" },
  { date: "Jun 1, 2025",  amount: "$149.00", status: "paid",    id: "INV-2025-006" },
  { date: "May 1, 2025",  amount: "$149.00", status: "paid",    id: "INV-2025-005" },
  { date: "Apr 1, 2025",  amount: "$149.00", status: "paid",    id: "INV-2025-004" },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function BillingPage() {
  const stats = [
    { label: "Current Plan",    value: "Pro",    color: "#C9F31D", icon: Crown      },
    { label: "Monthly Cost",    value: "$149",   color: "#22C55E", icon: CreditCard  },
    { label: "Next Billing",    value: "Aug 1",  color: "#22B8CF", icon: Calendar    },
    { label: "Team Members",    value: "3",      color: "#C084FC", icon: Users       },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Billing" subtitle="Manage your subscription and usage" />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {stats.map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{ ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: `${color}15`, border: `1px solid ${color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>
                  {value}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 3 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Current Plan Banner ── */}
        <div style={{
          borderRadius: 12, padding: "18px 22px",
          background: "rgba(201,243,29,0.05)",
          border: "1px solid rgba(201,243,29,0.22)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 11, flexShrink: 0,
            background: "rgba(201,243,29,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Crown size={19} style={{ color: "#C9F31D" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 3px 0" }}>
              Pro Plan — Active
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.50)", margin: 0 }}>
              Next billing date:{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>August 1, 2025</span>
              {" "}· $149/month
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{
              padding: "7px 16px", borderRadius: 8, cursor: "pointer",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600,
            }}>
              Manage Subscription
            </button>
            <button style={{
              padding: "7px 16px", borderRadius: 8, cursor: "pointer",
              background: "#C9F31D", border: "none",
              color: "#000", fontSize: 12, fontWeight: 700,
            }}>
              Upgrade to Enterprise
            </button>
          </div>
        </div>

        {/* ── Usage ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {USAGE.map(({ label, used, total, color }) => {
            const pct = Math.round((used / total) * 100);
            const isHigh = pct >= 80;
            const barColor = isHigh ? "#EF4444" : color;
            return (
              <div key={label} style={{ ...card, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: `${barColor}15`, border: `1px solid ${barColor}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Activity size={13} style={{ color: barColor }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.60)" }}>{label}</span>
                  </div>
                  {isHigh && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20,
                      background: "rgba(239,68,68,0.12)", color: "#EF4444", letterSpacing: "0.04em",
                    }}>
                      HIGH USAGE
                    </span>
                  )}
                </div>

                {/* Numbers */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.5px" }}>
                    {used.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.30)", fontVariantNumeric: "tabular-nums" }}>
                    / {total.toLocaleString()}
                  </span>
                </div>

                {/* Bar */}
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 8 }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${pct}%`,
                    background: isHigh
                      ? "linear-gradient(90deg,#EF444499,#EF4444)"
                      : `linear-gradient(90deg,${color}88,${color})`,
                    transition: "width 0.8s ease",
                  }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                    {pct}% used
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                    {(total - used).toLocaleString()} remaining
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Plan Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PLANS.map((plan) => {
            const PlanIcon = plan.icon;
            return (
              <div
                key={plan.name}
                style={{
                  ...card,
                  padding: "24px 22px",
                  display: "flex", flexDirection: "column", gap: 20,
                  position: "relative",
                  border: plan.current
                    ? `1px solid ${plan.color}45`
                    : "1px solid rgba(255,255,255,0.08)",
                  background: plan.current
                    ? `${plan.color}06`
                    : "rgba(255,255,255,0.03)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!plan.current)
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
                }}
                onMouseLeave={(e) => {
                  if (!plan.current)
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {/* Current badge */}
                {plan.current && (
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 20,
                    background: plan.color, color: "#000", letterSpacing: "0.06em",
                  }}>
                    CURRENT
                  </div>
                )}

                {/* Icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${plan.color}15`, border: `1px solid ${plan.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <PlanIcon size={18} style={{ color: plan.color }} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{plan.name}</span>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
                    ${plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>/month</span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <CheckCircle2 size={13} style={{ color: plan.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button style={{
                  width: "100%", padding: "11px 0", borderRadius: 9, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, border: "none",
                  background: plan.current
                    ? `${plan.color}20`
                    : plan.color,
                  color: plan.current ? plan.color : "#000",
                  outline: plan.current ? `1px solid ${plan.color}40` : "none",
                  transition: "opacity 0.15s",
                }}
                  onMouseEnter={(e) => { if (!plan.current) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Invoice History ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.20)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <CreditCard size={12} style={{ color: "#22C55E" }} />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Invoice History</h3>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Last 12 months</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Invoice ID", "Date", "Amount", "Status", ""].map((h) => (
                    <th key={h} style={{
                      padding: "9px 16px", textAlign: "left",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.28)", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, i) => (
                  <tr
                    key={inv.id}
                    style={{
                      borderBottom: i < INVOICES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {/* Invoice ID */}
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", fontVariantNumeric: "tabular-nums" }}>
                        {inv.id}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{inv.date}</span>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                        {inv.amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 9px", borderRadius: 20,
                        background: "rgba(34,197,94,0.12)", fontSize: 10, fontWeight: 700, color: "#22C55E",
                      }}>
                        <CheckCircle2 size={10} />
                        Paid
                      </div>
                    </td>

                    {/* Download */}
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <button
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "5px 12px", borderRadius: 7, cursor: "pointer",
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
                          color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "rgba(201,243,29,0.10)";
                          el.style.borderColor = "rgba(201,243,29,0.25)";
                          el.style.color = "#C9F31D";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "rgba(255,255,255,0.06)";
                          el.style.borderColor = "rgba(255,255,255,0.09)";
                          el.style.color = "rgba(255,255,255,0.55)";
                        }}
                      >
                        <Download size={11} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

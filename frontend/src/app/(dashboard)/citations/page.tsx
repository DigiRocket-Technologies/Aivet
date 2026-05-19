"use client";

import Topbar from "@/components/shared/Topbar";
import { Link2, ExternalLink, TrendingUp, TrendingDown, Shield, AlertCircle, Minus, ArrowUpRight } from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────

const CITATIONS = [
  { domain: "techcrunch.com",  count: 18, isBrand: false, authority: 92, trend: +3, type: "News"      },
  { domain: "acmecorp.com",    count: 14, isBrand: true,  authority: 78, trend: +5, type: "Brand"     },
  { domain: "g2.com",          count: 11, isBrand: false, authority: 85, trend: +1, type: "Review"    },
  { domain: "forbes.com",      count: 9,  isBrand: false, authority: 95, trend: 0,  type: "News"      },
  { domain: "capterra.com",    count: 7,  isBrand: false, authority: 82, trend: +2, type: "Review"    },
  { domain: "producthunt.com", count: 6,  isBrand: false, authority: 76, trend: -1, type: "Community" },
  { domain: "reddit.com",      count: 5,  isBrand: false, authority: 88, trend: +4, type: "Community" },
  { domain: "wikipedia.org",   count: 3,  isBrand: false, authority: 99, trend: 0,  type: "Reference" },
];

const MISSING = [
  { domain: "gartner.com",     reason: "High authority — no brand mention found",  authority: 97 },
  { domain: "trustradius.com", reason: "Competitor cited 8× — you have 0",         authority: 74 },
  { domain: "getapp.com",      reason: "Category leader source — missing",          authority: 71 },
];

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  News:      { color: "#22B8CF", bg: "rgba(34,184,207,0.12)"  },
  Brand:     { color: "#C9F31D", bg: "rgba(201,243,29,0.12)"  },
  Review:    { color: "#22C55E", bg: "rgba(34,197,94,0.12)"   },
  Community: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  Reference: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
};

const MAX_COUNT = Math.max(...CITATIONS.map((c) => c.count));

function authorityColor(a: number) {
  if (a >= 90) return "#22C55E";
  if (a >= 75) return "#C9F31D";
  return "#F59E0B";
}

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

const th: React.CSSProperties = {
  padding: "9px 16px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "rgba(255,255,255,0.28)",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function CitationsPage() {
  const totalCitations = CITATIONS.reduce((s, c) => s + c.count, 0);
  const brandHits = CITATIONS.find((c) => c.isBrand)?.count ?? 0;

  const stats = [
    { label: "Total Citations",   value: String(totalCitations), color: "#C9F31D", icon: Link2        },
    { label: "Unique Domains",    value: String(CITATIONS.length), color: "#22B8CF", icon: Shield     },
    { label: "Brand Domain Hits", value: String(brandHits),      color: "#22C55E", icon: TrendingUp   },
    { label: "Missing Opportunities", value: String(MISSING.length), color: "#EF4444", icon: AlertCircle },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Citation Tracking" subtitle="Sources AI models use to cite your brand" />

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

        {/* ── Citation Sources Table ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Citation Sources</h3>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Sorted by frequency</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Domain", "Type", "Citations", "Authority", "Trend"].map((h) => (
                    <th key={h} style={th as React.ThHTMLAttributes<HTMLTableCellElement>["style"]}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CITATIONS.map((c, i) => {
                  const typeStyle = TYPE_COLORS[c.type] ?? { color: "#fff", bg: "rgba(255,255,255,0.08)" };
                  const aColor = authorityColor(c.authority);
                  const isUp = c.trend > 0;
                  const isDown = c.trend < 0;

                  return (
                    <tr
                      key={c.domain}
                      style={{
                        borderBottom: i < CITATIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        background: c.isBrand ? "rgba(201,243,29,0.025)" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!c.isBrand) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = c.isBrand ? "rgba(201,243,29,0.025)" : "transparent";
                      }}
                    >
                      {/* Domain */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {/* Favicon placeholder */}
                          <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: c.isBrand ? "rgba(201,243,29,0.12)" : "rgba(255,255,255,0.06)",
                            border: c.isBrand ? "1px solid rgba(201,243,29,0.25)" : "1px solid rgba(255,255,255,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 800,
                            color: c.isBrand ? "#C9F31D" : "rgba(255,255,255,0.45)",
                          }}>
                            {c.domain.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: c.isBrand ? "#C9F31D" : "#fff" }}>
                                {c.domain}
                              </span>
                              {c.isBrand && (
                                <span style={{
                                  fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 20,
                                  background: "rgba(201,243,29,0.15)", color: "#C9F31D", letterSpacing: "0.06em",
                                }}>
                                  YOUR DOMAIN
                                </span>
                              )}
                              <ExternalLink size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                          background: typeStyle.bg, color: typeStyle.color, letterSpacing: "0.04em",
                        }}>
                          {c.type}
                        </span>
                      </td>

                      {/* Citations bar + count */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 100, height: 5, borderRadius: 3,
                            background: "rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0,
                          }}>
                            <div style={{
                              height: "100%", borderRadius: 3,
                              width: `${(c.count / MAX_COUNT) * 100}%`,
                              background: c.isBrand
                                ? "linear-gradient(90deg,#C9F31D,#A8D017)"
                                : "linear-gradient(90deg,#22B8CF99,#22B8CF)",
                            }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums", minWidth: 20 }}>
                            {c.count}
                          </span>
                        </div>
                      </td>

                      {/* Authority */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 44, height: 4, borderRadius: 2,
                            background: "rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0,
                          }}>
                            <div style={{
                              height: "100%", borderRadius: 2,
                              width: `${c.authority}%`, background: aColor,
                            }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: aColor, fontVariantNumeric: "tabular-nums" }}>
                            {c.authority}
                          </span>
                        </div>
                      </td>

                      {/* Trend */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: isUp ? "rgba(34,197,94,0.12)" : isDown ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.06)",
                          color: isUp ? "#22C55E" : isDown ? "#EF4444" : "rgba(255,255,255,0.28)",
                        }}>
                          {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : <Minus size={10} />}
                          {isUp ? `+${c.trend}` : c.trend === 0 ? "—" : c.trend}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Missing Citation Opportunities ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.20)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AlertCircle size={12} style={{ color: "#EF4444" }} />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Missing Citation Opportunities</h3>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
              background: "rgba(239,68,68,0.12)", color: "#EF4444",
            }}>
              {MISSING.length} gaps found
            </span>
          </div>

          <div>
            {MISSING.map((m, i) => {
              const aColor = authorityColor(m.authority);
              return (
                <div
                  key={m.domain}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 20px",
                    borderBottom: i < MISSING.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Alert icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <AlertCircle size={15} style={{ color: "#EF4444" }} />
                  </div>

                  {/* Domain + reason */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{m.domain}</span>
                      <ExternalLink size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", margin: 0 }}>{m.reason}</p>
                  </div>

                  {/* Authority */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 44, height: 4, borderRadius: 2,
                        background: "rgba(255,255,255,0.08)", overflow: "hidden",
                      }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${m.authority}%`, background: aColor }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: aColor, fontVariantNumeric: "tabular-nums" }}>
                        {m.authority}
                      </span>
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 3, textAlign: "right" }}>authority</div>
                  </div>

                  {/* CTA */}
                  <button style={{
                    display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                    padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                    background: "rgba(201,243,29,0.08)", border: "1px solid rgba(201,243,29,0.22)",
                    color: "#C9F31D", fontSize: 12, fontWeight: 700,
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,243,29,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,243,29,0.08)"; }}
                  >
                    Get Listed
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

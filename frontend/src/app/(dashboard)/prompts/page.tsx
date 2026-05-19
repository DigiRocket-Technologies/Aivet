"use client";

import { useState } from "react";
import Topbar from "@/components/shared/Topbar";
import { Plus, Play, Pause, Trash2, ChevronRight, Clock, CheckCircle2, XCircle, MoreHorizontal, Zap, BarChart2, Activity } from "lucide-react";
import { engineColors } from "@/lib/colors";

// ── Model Logos ────────────────────────────────────────────────────────────

function ChatGPTLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none">
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.212-2.71 10.079 10.079 0 0 0-9.49 6.963 9.967 9.967 0 0 0-6.188 4.83 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.212 2.71 10.079 10.079 0 0 0 9.49-6.963 9.967 9.967 0 0 0 6.188-4.832 10.079 10.079 0 0 0-1.24-11.816zm-17.223 24.09a7.474 7.474 0 0 1-4.801-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.487 7.57zm-16.124-6.908a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zm-2.09-17.496a7.47 7.47 0 0 1 3.908-3.285c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L8.048 25.444a7.504 7.504 0 0 1-5.953-8.884zm27.651 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V21z" fill="#10A37F" />
    </svg>
  );
}

function GeminiLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" fill="#1A73E8" />
    </svg>
  );
}

function ClaudeLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.827 3.52h3.603l-7.376 16.96H6.45l7.377-16.96z" fill="#D97757" />
      <path d="M6.288 3.52h3.604L2.515 20.48H.001L6.288 3.52zM17.047 13.952h3.476l-1.738-4.656-1.738 4.656zM14.123 20.48l1.06-2.832h5.534l1.06 2.832H24L18.785 7.04h-2.952L10.618 20.48h3.505z" fill="#D97757" />
    </svg>
  );
}

function PerplexityLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 .5L7.5 5H4v4.5L.5 12 4 15.5V20h3.5l4.5 4.5 4.5-4.5H20v-4.5l3.5-3.5L20 9.5V5h-3.5L12 .5z" stroke="#22B8CF" strokeWidth="1.2" />
      <path d="M8.5 8.5h7v7h-7z" stroke="#22B8CF" strokeWidth="1.2" />
      <path d="M12 5v14M5 12h14" stroke="#22B8CF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const MODEL_LOGO_MAP: Record<string, React.FC<{ size?: number }>> = {
  chatgpt: ChatGPTLogo,
  gemini: GeminiLogo,
  claude: ClaudeLogo,
  perplexity: PerplexityLogo,
};

const MODEL_LABEL: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  claude: "Claude",
  perplexity: "Perplexity",
};

// ── Status Config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  completed: { color: "#22C55E", bg: "rgba(34,197,94,0.12)",   icon: CheckCircle2, label: "Completed" },
  running:   { color: "#C9F31D", bg: "rgba(201,243,29,0.12)",  icon: Activity,     label: "Running"   },
  pending:   { color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  icon: Clock,        label: "Pending"   },
  failed:    { color: "#EF4444", bg: "rgba(239,68,68,0.12)",   icon: XCircle,      label: "Failed"    },
};

// ── Data ───────────────────────────────────────────────────────────────────

const CAMPAIGNS = [
  {
    id: "1", name: "Brand Awareness Tracking", prompts: 12, frequency: "Daily",
    lastRun: "2h ago", nextRun: "in 22h", status: "completed",
    models: ["chatgpt", "gemini", "claude", "perplexity"],
    avgScore: 72, totalRuns: 84, successRate: 96,
  },
  {
    id: "2", name: "Competitor Comparison", prompts: 8, frequency: "Daily",
    lastRun: "Running...", nextRun: "—", status: "running",
    models: ["chatgpt", "claude"],
    avgScore: 65, totalRuns: 42, successRate: 88,
  },
  {
    id: "3", name: "Product Feature Mentions", prompts: 15, frequency: "Weekly",
    lastRun: "3d ago", nextRun: "in 4d", status: "pending",
    models: ["chatgpt", "gemini", "claude", "perplexity"],
    avgScore: 58, totalRuns: 28, successRate: 100,
  },
  {
    id: "4", name: "Industry Keywords", prompts: 20, frequency: "Daily",
    lastRun: "1h ago", nextRun: "in 23h", status: "failed",
    models: ["perplexity"],
    avgScore: 0, totalRuns: 61, successRate: 74,
  },
];

const RECENT_RUNS = [
  { prompt: "What is the best CRM for small businesses?",  model: "chatgpt",    status: "completed", rank: 2,  time: "2m ago"  },
  { prompt: "Top project management tools 2024",           model: "claude",     status: "completed", rank: 1,  time: "5m ago"  },
  { prompt: "Compare Acme Corp vs competitors",            model: "gemini",     status: "completed", rank: 1,  time: "8m ago"  },
  { prompt: "Best enterprise software solutions",          model: "perplexity", status: "running",   rank: 0,  time: "now"     },
  { prompt: "SaaS tools for remote teams",                 model: "chatgpt",    status: "failed",    rank: 0,  time: "12m ago" },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function PromptsPage() {
  const [activeFilter, setActiveFilter] = useState(0);

  const filters = [
    { label: "All Campaigns", count: 4 },
    { label: "Active",        count: 2 },
    { label: "Paused",        count: 1 },
  ];

  const stats = [
    { label: "Total Campaigns", value: "4",   icon: BarChart2, color: "#C9F31D" },
    { label: "Total Runs",      value: "215",  icon: Zap,       color: "#22B8CF" },
    { label: "Success Rate",    value: "89%",  icon: CheckCircle2, color: "#22C55E" },
    { label: "Running Now",     value: "1",    icon: Activity,  color: "#C9F31D" },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Prompt Campaigns" subtitle="Monitor your brand across AI models" />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${color}15`, border: `1px solid ${color}25`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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

        {/* ── Filter + New Campaign ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {filters.map(({ label, count }, i) => (
              <button
                key={label}
                onClick={() => setActiveFilter(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  background: activeFilter === i ? "#C9F31D" : "rgba(255,255,255,0.06)",
                  color: activeFilter === i ? "#000" : "rgba(255,255,255,0.60)",
                  outline: activeFilter !== i ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                {label}
                <span style={{
                  padding: "1px 6px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                  background: activeFilter === i ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.10)",
                  color: activeFilter === i ? "#000" : "rgba(255,255,255,0.45)",
                }}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700,
          }}>
            <Plus size={14} />
            New Campaign
          </button>
        </div>

        {/* ── Campaign Cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CAMPAIGNS.map((c) => {
            const st = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = st.icon;
            const isRunning = c.status === "running";

            return (
              <div
                key={c.id}
                style={{
                  ...card,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                {/* Status icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: st.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <StatusIcon size={17} style={{ color: st.color }} />
                  {isRunning && (
                    <span style={{
                      position: "absolute", inset: -2, borderRadius: 12,
                      border: `2px solid ${st.color}`,
                      animation: "pulse-ring 1.6s ease-out infinite",
                      opacity: 0.5,
                    }} />
                  )}
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: st.bg, color: st.color, textTransform: "capitalize",
                    }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
                    <span>{c.prompts} prompts</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{c.frequency}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>Last: {c.lastRun}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>Next: {c.nextRun}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ color: c.successRate >= 90 ? "#22C55E" : c.successRate >= 75 ? "#F59E0B" : "#EF4444" }}>
                      {c.successRate}% success
                    </span>
                  </div>
                </div>

                {/* Model logos */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {c.models.map((m) => {
                    const Logo = MODEL_LOGO_MAP[m];
                    const color = engineColors[m];
                    return (
                      <div
                        key={m}
                        title={MODEL_LABEL[m]}
                        style={{
                          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                          background: `${color}15`, border: `1px solid ${color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Logo size={14} />
                      </div>
                    );
                  })}
                </div>

                {/* Avg score */}
                <div style={{ textAlign: "right", minWidth: 52 }}>
                  <div style={{
                    fontSize: 24, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.5px",
                    fontVariantNumeric: "tabular-nums",
                    color: c.avgScore > 0 ? "#C9F31D" : "rgba(255,255,255,0.22)",
                  }}>
                    {c.avgScore > 0 ? c.avgScore : "—"}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>avg score</div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                      background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title={isRunning ? "Pause" : "Run"}
                  >
                    {isRunning
                      ? <Pause size={12} style={{ color: "rgba(255,255,255,0.55)" }} />
                      : <Play size={12} style={{ color: "rgba(255,255,255,0.55)" }} />
                    }
                  </button>
                  <button style={{
                    width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                    background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <MoreHorizontal size={12} style={{ color: "rgba(255,255,255,0.55)" }} />
                  </button>
                </div>

                <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>

        {/* ── Recent Runs ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Recent Prompt Runs</h3>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Last 30 minutes</span>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Status", "Model", "Prompt", "Rank", "Time"].map((h) => (
                    <th key={h} style={{
                      padding: "9px 16px", textAlign: "left",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.30)", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_RUNS.map((r, i) => {
                  const st = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
                  const StatusIcon = st.icon;
                  const Logo = MODEL_LOGO_MAP[r.model];
                  const color = engineColors[r.model];
                  const isRunning = r.status === "running";

                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < RECENT_RUNS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      {/* Status */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "3px 9px", borderRadius: 20,
                          background: st.bg, fontSize: 10, fontWeight: 700, color: st.color,
                        }}>
                          <StatusIcon size={10} />
                          {st.label}
                        </div>
                      </td>

                      {/* Model */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                            background: `${color}15`, border: `1px solid ${color}30`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Logo size={13} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
                            {MODEL_LABEL[r.model]}
                          </span>
                        </div>
                      </td>

                      {/* Prompt */}
                      <td style={{ padding: "12px 16px", maxWidth: 340 }}>
                        <span style={{
                          fontSize: 12, color: "rgba(255,255,255,0.65)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          display: "block",
                        }}>
                          {r.prompt}
                        </span>
                      </td>

                      {/* Rank */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        {r.rank > 0 ? (
                          <span style={{
                            fontSize: 12, fontWeight: 700,
                            padding: "3px 9px", borderRadius: 6,
                            background: r.rank === 1 ? "rgba(201,243,29,0.12)" : "rgba(255,255,255,0.06)",
                            color: r.rank === 1 ? "#C9F31D" : "rgba(255,255,255,0.55)",
                          }}>
                            #{r.rank}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.20)" }}>—</span>
                        )}
                      </td>

                      {/* Time */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontSize: 11, color: isRunning ? "#C9F31D" : "rgba(255,255,255,0.30)",
                          fontWeight: isRunning ? 600 : 400,
                        }}>
                          {r.time}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Pulse animation for running indicator */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

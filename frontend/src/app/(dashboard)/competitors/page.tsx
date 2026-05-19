"use client";

import Topbar from "@/components/shared/Topbar";
import CompetitorChart from "@/components/charts/CompetitorChart";
import { Plus, TrendingUp, TrendingDown, Minus, ExternalLink, Trophy, Eye, Link2, Users } from "lucide-react";
import { engineColors, getScoreBand } from "@/lib/colors";

// ── Model Logos ────────────────────────────────────────────────────────────

function ChatGPTLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none">
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.212-2.71 10.079 10.079 0 0 0-9.49 6.963 9.967 9.967 0 0 0-6.188 4.83 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.212 2.71 10.079 10.079 0 0 0 9.49-6.963 9.967 9.967 0 0 0 6.188-4.832 10.079 10.079 0 0 0-1.24-11.816zm-17.223 24.09a7.474 7.474 0 0 1-4.801-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.487 7.57zm-16.124-6.908a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zm-2.09-17.496a7.47 7.47 0 0 1 3.908-3.285c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L8.048 25.444a7.504 7.504 0 0 1-5.953-8.884zm27.651 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V21z" fill="#10A37F" />
    </svg>
  );
}

function GeminiLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" fill="#1A73E8" />
    </svg>
  );
}

function ClaudeLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.827 3.52h3.603l-7.376 16.96H6.45l7.377-16.96z" fill="#D97757" />
      <path d="M6.288 3.52h3.604L2.515 20.48H.001L6.288 3.52zM17.047 13.952h3.476l-1.738-4.656-1.738 4.656zM14.123 20.48l1.06-2.832h5.534l1.06 2.832H24L18.785 7.04h-2.952L10.618 20.48h3.505z" fill="#D97757" />
    </svg>
  );
}

function PerplexityLogo({ size = 14 }: { size?: number }) {
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

// ── Data ───────────────────────────────────────────────────────────────────

const COMPETITORS = [
  {
    brand: "RivalCo", domain: "rivalco.com", score: 85, change: +5,
    mentions: 312, citations: 28,
    models: ["chatgpt", "gemini", "claude", "perplexity"],
    modelScores: { chatgpt: 88, gemini: 82, claude: 86, perplexity: 84 },
    topPrompt: "Best CRM for enterprise",
  },
  {
    brand: "Acme Corp", domain: "acmecorp.com", score: 72, change: +8,
    mentions: 487, citations: 93,
    models: ["chatgpt", "gemini", "claude", "perplexity"],
    modelScores: { chatgpt: 75, gemini: 68, claude: 74, perplexity: 71 },
    topPrompt: "Project management tools",
    isOwn: true,
  },
  {
    brand: "TechBrand", domain: "techbrand.io", score: 61, change: -3,
    mentions: 198, citations: 15,
    models: ["chatgpt", "claude"],
    modelScores: { chatgpt: 63, gemini: 0, claude: 59, perplexity: 0 },
    topPrompt: "SaaS tools for startups",
  },
  {
    brand: "StartupXYZ", domain: "startupxyz.com", score: 44, change: +2,
    mentions: 134, citations: 8,
    models: ["chatgpt", "gemini"],
    modelScores: { chatgpt: 46, gemini: 42, claude: 0, perplexity: 0 },
    topPrompt: "Affordable business software",
  },
  {
    brand: "MegaCorp", domain: "megacorp.com", score: 38, change: -7,
    mentions: 89, citations: 5,
    models: ["chatgpt"],
    modelScores: { chatgpt: 38, gemini: 0, claude: 0, perplexity: 0 },
    topPrompt: "Enterprise solutions",
  },
];

const ALL_MODELS = ["chatgpt", "gemini", "claude", "perplexity"];

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function CompetitorsPage() {
  const ownBrand = COMPETITORS.find((c) => c.isOwn);
  const topCompetitor = COMPETITORS.filter((c) => !c.isOwn).sort((a, b) => b.score - a.score)[0];
  const scoreDiff = ownBrand && topCompetitor ? topCompetitor.score - ownBrand.score : 0;

  const stats = [
    { label: "Competitors Tracked", value: "4",   icon: Users,   color: "#C9F31D" },
    { label: "Your Score",          value: String(ownBrand?.score ?? "—"), icon: Trophy, color: "#22C55E" },
    { label: "Gap to Leader",       value: scoreDiff > 0 ? `-${scoreDiff}` : "Leading", icon: TrendingUp, color: scoreDiff > 0 ? "#EF4444" : "#22C55E" },
    { label: "Total Mentions",      value: String(COMPETITORS.reduce((s, c) => s + c.mentions, 0)), icon: Eye, color: "#22B8CF" },
  ];

  const shareData = COMPETITORS.map((c) => ({ brand: c.brand, score: c.score, color: "" }));

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Competitor Analysis" subtitle="Track visibility share across AI models" />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
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

        {/* ── Header Action ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.50)", margin: 0 }}>
            Tracking{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>4 competitors</span>
            {" "}across{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>4 AI models</span>
          </p>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700,
          }}>
            <Plus size={14} />
            Add Competitor
          </button>
        </div>

        {/* ── Chart + Table ── */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }}>

          {/* Chart */}
          <CompetitorChart data={shareData} brandName="Acme Corp" />

          {/* Competitor Table */}
          <div style={{ ...card, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Competitor Breakdown</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {ALL_MODELS.map((m) => {
                  const Logo = MODEL_LOGO_MAP[m];
                  const color = engineColors[m];
                  return (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.40)" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        background: `${color}15`, border: `1px solid ${color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Logo size={11} />
                      </div>
                      {MODEL_LABEL[m]}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["#", "Brand", "Score", "Change", "Mentions", "Citations", "ChatGPT", "Gemini", "Claude", "Perplexity"].map((h) => (
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
                  {[...COMPETITORS]
                    .sort((a, b) => b.score - a.score)
                    .map((c, i) => {
                      const band = getScoreBand(c.score);
                      const isUp = c.change > 0;
                      const isDown = c.change < 0;

                      return (
                        <tr
                          key={c.brand}
                          style={{
                            borderBottom: i < COMPETITORS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            background: c.isOwn ? "rgba(201,243,29,0.03)" : "transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (!c.isOwn) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = c.isOwn ? "rgba(201,243,29,0.03)" : "transparent";
                          }}
                        >
                          {/* Rank */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              color: i === 0 ? "#C9F31D" : "rgba(255,255,255,0.28)",
                              fontVariantNumeric: "tabular-nums",
                            }}>
                              {i === 0 ? "🥇" : `#${i + 1}`}
                            </span>
                          </td>

                          {/* Brand */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: c.isOwn ? "#C9F31D" : "#fff" }}>
                                {c.brand}
                              </span>
                              {c.isOwn && (
                                <span style={{
                                  fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 20,
                                  background: "rgba(201,243,29,0.15)", color: "#C9F31D", letterSpacing: "0.06em",
                                }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                              {c.domain}
                              <ExternalLink size={9} />
                            </div>
                          </td>

                          {/* Score */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{
                                width: 52, height: 5, borderRadius: 3,
                                background: "rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0,
                              }}>
                                <div style={{
                                  height: "100%", borderRadius: 3,
                                  width: `${c.score}%`,
                                  background: c.isOwn ? "linear-gradient(90deg,#C9F31D,#A8D017)" : band.color,
                                }} />
                              </div>
                              <span style={{ fontSize: 15, fontWeight: 800, color: band.color, fontVariantNumeric: "tabular-nums" }}>
                                {c.score}
                              </span>
                              <span style={{
                                fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20,
                                background: band.bg, color: band.color, letterSpacing: "0.04em",
                              }}>
                                {getScoreBand(c.score).label}
                              </span>
                            </div>
                          </td>

                          {/* Change */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <div style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                              background: isUp ? "rgba(34,197,94,0.12)" : isDown ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.06)",
                              color: isUp ? "#22C55E" : isDown ? "#EF4444" : "rgba(255,255,255,0.30)",
                            }}>
                              {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : <Minus size={10} />}
                              {isUp ? "+" : ""}{c.change}
                            </div>
                          </td>

                          {/* Mentions */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                              {c.mentions.toLocaleString()}
                            </span>
                          </td>

                          {/* Citations */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <Link2 size={11} style={{ color: "rgba(255,255,255,0.30)" }} />
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                                {c.citations}
                              </span>
                            </div>
                          </td>

                          {/* Per-model scores */}
                          {ALL_MODELS.map((m) => {
                            const ms = c.modelScores[m as keyof typeof c.modelScores] ?? 0;
                            const active = c.models.includes(m);
                            const mb = getScoreBand(ms);
                            const mColor = engineColors[m];
                            return (
                              <td key={m} style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                {active ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{
                                      width: 36, height: 4, borderRadius: 2,
                                      background: "rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0,
                                    }}>
                                      <div style={{
                                        height: "100%", borderRadius: 2,
                                        width: `${ms}%`, background: mColor, opacity: 0.8,
                                      }} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: mb.color, fontVariantNumeric: "tabular-nums" }}>
                                      {ms}
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

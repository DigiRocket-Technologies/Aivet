"use client";

import Topbar from "@/components/shared/Topbar";
import KPICard from "@/components/dashboard/KPICard";
import ScoreGauge from "@/components/charts/ScoreGauge";
import TrendChart from "@/components/charts/TrendChart";
import ModelDistributionChart from "@/components/charts/ModelDistributionChart";
import CompetitorChart from "@/components/charts/CompetitorChart";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  Eye, Zap, MessageSquare, Link2, Users2, Bot,
  TrendingUp, ArrowRight, CheckCircle2, AlertCircle, RefreshCw,
} from "lucide-react";
import { engineColors, getScoreBand } from "@/lib/colors";
import type { ModelDistribution, CompetitorShare, TrendPoint } from "@/types";

// ── Fallback mock data (shown when no project connected) ───────────────────

const MOCK_TREND: TrendPoint[] = [
  { date: "Jun 1",  score: 42, mentions: 18 },
  { date: "Jun 5",  score: 48, mentions: 22 },
  { date: "Jun 10", score: 51, mentions: 27 },
  { date: "Jun 15", score: 58, mentions: 31 },
  { date: "Jun 20", score: 63, mentions: 38 },
  { date: "Jun 25", score: 67, mentions: 42 },
  { date: "Jun 30", score: 72, mentions: 49 },
];

const MOCK_MODELS: ModelDistribution[] = [
  { model: "chatgpt",    score: 78, mentions: 42, color: engineColors.chatgpt    },
  { model: "gemini",     score: 65, mentions: 31, color: engineColors.gemini     },
  { model: "claude",     score: 82, mentions: 48, color: engineColors.claude     },
  { model: "perplexity", score: 71, mentions: 36, color: engineColors.perplexity },
];

const MOCK_COMPETITORS: CompetitorShare[] = [
  { brand: "Acme Corp",  score: 72, color: "#C9F31D" },
  { brand: "RivalCo",    score: 85, color: "#22C55E" },
  { brand: "TechBrand",  score: 61, color: "#22B8CF" },
  { brand: "StartupXYZ", score: 44, color: "#D97757" },
  { brand: "MegaCorp",   score: 38, color: "#F59E0B" },
];

const MOCK_MENTIONS = [
  { model: "chatgpt",    prompt: "Best CRM tools for startups",     sentiment: "positive", rank: 1, time: "2m ago"  },
  { model: "claude",     prompt: "Top project management software", sentiment: "positive", rank: 2, time: "8m ago"  },
  { model: "gemini",     prompt: "Acme Corp vs competitors",        sentiment: "neutral",  rank: 1, time: "15m ago" },
  { model: "perplexity", prompt: "Enterprise software solutions",   sentiment: "positive", rank: 3, time: "22m ago" },
  { model: "chatgpt",    prompt: "SaaS tools for remote teams",     sentiment: "negative", rank: 4, time: "31m ago" },
];

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "#22C55E",
  neutral:  "#F59E0B",
  negative: "#EF4444",
};

const ENGINE_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT", gemini: "Gemini", claude: "Claude", perplexity: "Perplexity",
};

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

const row: React.CSSProperties = { display: "flex", gap: 16 };

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ w, h, radius = 6 }: { w: number | string; h: number; radius?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: "rgba(255,255,255,0.06)",
      animation: "shimmer 1.5s infinite",
      backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)",
      backgroundSize: "200% 100%",
    }} />
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { data, loading, error, refetch } = useDashboard(30);
  const user      = useAuthStore((s) => s.user);
  const projectId = useAuthStore((s) => s.projectId);

  // Derive values — real data if available, else mock
  const score         = data?.current_score        ?? 72;
  const scoreChange   = data?.score_change         ?? 8.4;
  const totalPrompts  = data?.total_prompts        ?? 1284;
  const totalMentions = data?.total_mentions       ?? 487;
  const band          = getScoreBand(score);

  // Build trend points from API data
  const trendData: TrendPoint[] = data?.trend.length
    ? data.trend.map((t) => ({
        date:     t.score_date,
        score:    t.overall_score,
        mentions: t.total_mentions ?? 0,
      }))
    : MOCK_TREND;

  // Build model distribution from latest breakdown
  const latestBreakdown = data?.trend.at(-1)?.models_breakdown;
  const modelData: ModelDistribution[] = latestBreakdown
    ? Object.entries(latestBreakdown).map(([model, s]) => ({
        model: model as ModelDistribution["model"],
        score: s,
        mentions: 0,
        color: engineColors[model] ?? "#fff",
      }))
    : MOCK_MODELS;

  // Score factors from latest score
  const latestScore = data?.trend.at(-1);
  const scoreFactors = [
    { label: "Mention Freq.",   score: latestScore?.mention_score   ?? 76, icon: MessageSquare },
    { label: "Ranking Pos.",    score: latestScore?.ranking_score   ?? 68, icon: TrendingUp    },
    { label: "Sentiment",       score: latestScore?.sentiment_score ?? 82, icon: CheckCircle2  },
    { label: "Citations",       score: latestScore?.citation_score  ?? 55, icon: Link2         },
    { label: "Model Diversity", score: latestScore?.diversity_score ?? 100, icon: Bot          },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Overview" subtitle="Acme Corp · acmecorp.com" />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Error Banner ── */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={14} style={{ color: "#EF4444" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                Could not load live data — showing demo values.{" "}
                <span style={{ color: "#EF4444", fontSize: 11 }}>{error}</span>
              </span>
            </div>
            <button
              onClick={refetch}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer",
                background: "rgba(239,68,68,0.12)", color: "#EF4444", fontSize: 11, fontWeight: 600,
              }}
            >
              <RefreshCw size={11} />
              Retry
            </button>
          </div>
        )}

        {/* ── No project warning ── */}
        {!projectId && !loading && (
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <AlertCircle size={14} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
              No project connected — showing demo data. Go to{" "}
              <span style={{ color: "#C9F31D", fontWeight: 600 }}>Settings → Project</span> to connect.
            </span>
          </div>
        )}

        {/* ── ROW 1: Score Gauge + 6 KPI Cards ── */}
        <div style={{ ...row, alignItems: "stretch" }}>

          {/* Score Gauge */}
          <div style={{
            ...card,
            width: 240, flexShrink: 0, padding: 24,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: 0 }}>
              AI Visibility Score
            </p>
            {loading
              ? <Skeleton w={160} h={160} radius={80} />
              : <ScoreGauge score={score} size={180} />
            }
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.50)" }}>
              <TrendingUp size={12} style={{ color: scoreChange >= 0 ? "#22C55E" : "#EF4444" }} />
              <span style={{ color: scoreChange >= 0 ? "#22C55E" : "#EF4444", fontWeight: 600 }}>
                {scoreChange >= 0 ? "+" : ""}{scoreChange.toFixed(1)}%
              </span>
              <span>vs last 30 days</span>
            </div>
          </div>

          {/* 6 KPI Cards */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <KPICard loading={loading} title="Total Prompts Tracked" value={totalPrompts}  delta={12} icon={Zap}          iconColor="#C9F31D" />
            <KPICard loading={loading} title="Brand Mentions"        value={totalMentions} delta={18} icon={MessageSquare} iconColor="#22B8CF" />
            <KPICard loading={loading} title="Mention Frequency"     value="37.9" suffix="%" delta={5} icon={Eye}          iconColor="#C084FC" />
            <KPICard loading={loading} title="Citations Found"       value={93}   delta={-3} icon={Link2}        iconColor="#D97757" />
            <KPICard loading={loading} title="Competitors Tracked"   value={4}              icon={Users2}        iconColor="#F59E0B" />
            <KPICard loading={loading} title="AI Models Active"      value={4}              icon={Bot}           iconColor="#10A37F" />
          </div>
        </div>

        {/* ── ROW 2: Trend Chart + Model Distribution ── */}
        <div style={row}>
          <div style={{ flex: "0 0 calc(65% - 8px)" }}>
            {loading
              ? <div style={{ ...card, height: 240 }}><Skeleton w="100%" h={240} radius={12} /></div>
              : <TrendChart data={trendData} />
            }
          </div>
          <div style={{ flex: "0 0 calc(35% - 8px)" }}>
            {loading
              ? <div style={{ ...card, height: 240 }}><Skeleton w="100%" h={240} radius={12} /></div>
              : <ModelDistributionChart data={modelData} />
            }
          </div>
        </div>

        {/* ── ROW 3: Competitor Chart + Recent Mentions ── */}
        <div style={row}>
          <div style={{ flex: "0 0 calc(38% - 8px)" }}>
            <CompetitorChart data={MOCK_COMPETITORS} brandName="Acme Corp" />
          </div>

          {/* Recent Mentions */}
          <div style={{ ...card, flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexShrink: 0 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>Recent Mentions</h3>
              <button style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, fontWeight: 500, color: "#C9F31D",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}>
                View all <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
                      <Skeleton w={26} h={26} radius={6} />
                      <Skeleton w="60%" h={12} />
                      <Skeleton w={28} h={20} radius={4} />
                    </div>
                  ))
                : MOCK_MENTIONS.map((m, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 12px", borderRadius: 8,
                      background: "rgba(255,255,255,0.03)",
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                        background: `${engineColors[m.model]}20`,
                        border: `1px solid ${engineColors[m.model]}35`,
                        color: engineColors[m.model],
                        fontSize: 9, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {ENGINE_LABELS[m.model]?.slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.prompt}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                        background: "rgba(255,255,255,0.06)",
                        color: m.rank === 1 ? "#C9F31D" : "rgba(255,255,255,0.45)",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        #{m.rank}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, flexShrink: 0,
                        background: `${SENTIMENT_COLORS[m.sentiment]}18`,
                        color: SENTIMENT_COLORS[m.sentiment],
                        textTransform: "capitalize",
                      }}>
                        {m.sentiment}
                      </span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", flexShrink: 0 }}>
                        {m.time}
                      </span>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        {/* ── ROW 4: Score Breakdown ── */}
        <div style={{ ...card, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 16px 0" }}>
            Score Breakdown
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {scoreFactors.map(({ label, score: s, icon: Icon }) => {
              const b = getScoreBand(s ?? 0);
              return (
                <div key={label} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  padding: "16px 12px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {loading
                    ? <>
                        <Skeleton w={34} h={34} radius={8} />
                        <Skeleton w={40} h={28} />
                        <Skeleton w={60} h={12} />
                      </>
                    : <>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${b.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={16} style={{ color: b.color }} />
                        </div>
                        <span style={{ fontSize: 26, fontWeight: 700, color: b.color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                          {s ?? "—"}
                        </span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", textAlign: "center", lineHeight: 1.3 }}>
                          {label}
                        </span>
                        <div style={{ width: "100%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                          <div style={{ height: "100%", borderRadius: 2, width: `${s ?? 0}%`, background: b.color }} />
                        </div>
                      </>
                  }
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

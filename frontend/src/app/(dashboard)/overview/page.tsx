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
import EmptyState from "@/components/dashboard/EmptyState";
import Link from "next/link";
import { engineColors, getScoreBand } from "@/lib/colors";
import type { ModelDistribution, CompetitorShare, TrendPoint } from "@/types";

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

const DASH = "—";

export default function OverviewPage() {
  const { data, loading, error, refetch } = useDashboard(30);
  const projects  = useAuthStore((s) => s.projects);
  const projectId = useAuthStore((s) => s.projectId);

  const project = projects.find((p) => p._id === projectId) ?? null;

  // Every figure below comes from the API or is shown as absent. Nothing on
  // this page is invented — a sample number next to a real one is unreadable.
  const hasData       = Boolean(data?.trend?.length);
  const score         = data?.currentScore  ?? 0;
  const scoreChange   = data?.scoreChange   ?? 0;
  const totalPrompts  = data?.totalPrompts  ?? 0;
  const totalMentions = data?.totalMentions ?? 0;

  const trendData: TrendPoint[] = (data?.trend ?? []).map((t) => ({
    date:     t.scoreDate,
    score:    t.overallScore,
    mentions: t.totalMentions ?? 0,
  }));

  const latestBreakdown = data?.trend?.at(-1)?.modelsBreakdown;
  const modelData: ModelDistribution[] = latestBreakdown
    ? Object.entries(latestBreakdown).map(([model, s]) => ({
        model: model as ModelDistribution["model"],
        score: s,
        mentions: 0,
        color: engineColors[model] ?? "#fff",
      }))
    : [];

  // Share-of-voice needs a visibility score per competitor, which no endpoint
  // returns yet — so list only what the project actually holds.
  const competitors = project?.competitors ?? [];
  const competitorData: CompetitorShare[] = [];

  // Mention frequency is derivable; citations are not exposed by any endpoint.
  const mentionFrequency = totalPrompts > 0
    ? ((totalMentions / totalPrompts) * 100).toFixed(1)
    : DASH;
  const modelsActive = latestBreakdown ? Object.keys(latestBreakdown).length : DASH;

  const latestScore = data?.trend?.at(-1);
  const scoreFactors = [
    { label: "Mention Freq.",   score: latestScore?.mentionScore   ?? null, icon: MessageSquare },
    { label: "Ranking Pos.",    score: latestScore?.rankingScore   ?? null, icon: TrendingUp    },
    { label: "Sentiment",       score: latestScore?.sentimentScore ?? null, icon: CheckCircle2  },
    { label: "Citations",       score: latestScore?.citationScore  ?? null, icon: Link2         },
    { label: "Model Diversity", score: latestScore?.diversityScore ?? null, icon: Bot          },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar
        title="Overview"
        subtitle={project ? `${project.name} · ${project.domain}` : "No project selected"}
      />

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
                Could not load your data.{" "}
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

        {/* ── Setup notices ── */}
        {!projectId && !loading && (
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <AlertCircle size={14} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
              No project yet. Create one in{" "}
              <Link href="/settings" style={{ color: "#C9F31D", fontWeight: 600 }}>Settings → Project</Link>
              {" "}to start tracking.
            </span>
          </div>
        )}

        {projectId && !loading && !error && !hasData && (
          <div style={{
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <AlertCircle size={14} style={{ color: "rgba(255,255,255,0.45)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
              No visibility data for <strong style={{ color: "#fff", fontWeight: 600 }}>{project?.name}</strong> yet.
              Run a campaign from{" "}
              <Link href="/prompts" style={{ color: "#C9F31D", fontWeight: 600 }}>Prompt Campaigns</Link>
              {" "}and results will appear here.
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
              : <ScoreGauge score={score} size={180} hasData={hasData} />
            }
            {hasData ? (
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.50)" }}>
                <TrendingUp size={12} style={{ color: scoreChange >= 0 ? "#22C55E" : "#EF4444" }} />
                <span style={{ color: scoreChange >= 0 ? "#22C55E" : "#EF4444", fontWeight: 600 }}>
                  {scoreChange >= 0 ? "+" : ""}{scoreChange.toFixed(1)}
                </span>
                <span>vs last 30 days</span>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.30)" }}>No score yet</span>
            )}
          </div>

          {/* 6 KPI Cards */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <KPICard loading={loading} title="Total Prompts Tracked" value={totalPrompts}  icon={Zap}           iconColor="#C9F31D" />
            <KPICard loading={loading} title="Brand Mentions"        value={totalMentions} icon={MessageSquare} iconColor="#22B8CF" />
            <KPICard loading={loading} title="Mention Frequency"     value={mentionFrequency} suffix={mentionFrequency === DASH ? undefined : "%"} icon={Eye} iconColor="#C084FC" />
            <KPICard loading={loading} title="Citations Found"       value={DASH}          icon={Link2}         iconColor="#D97757" />
            <KPICard loading={loading} title="Competitors Tracked"   value={competitors.length} icon={Users2}   iconColor="#F59E0B" />
            <KPICard loading={loading} title="AI Models Active"      value={modelsActive}  icon={Bot}           iconColor="#10A37F" />
          </div>
        </div>

        {/* ── ROW 2: Trend Chart + Model Distribution ── */}
        <div style={row}>
          <div style={{ flex: "0 0 calc(65% - 8px)" }}>
            {loading
              ? <div style={{ ...card, height: 240 }}><Skeleton w="100%" h={240} radius={12} /></div>
              : trendData.length
                ? <TrendChart data={trendData} />
                : <div style={{ ...card, height: 240 }}>
                    <EmptyState icon={TrendingUp} height={240}
                      title="No visibility trend yet"
                      hint="Scores are plotted here once campaigns have run for a few days." />
                  </div>
            }
          </div>
          <div style={{ flex: "0 0 calc(35% - 8px)" }}>
            {loading
              ? <div style={{ ...card, height: 240 }}><Skeleton w="100%" h={240} radius={12} /></div>
              : modelData.length
                ? <ModelDistributionChart data={modelData} />
                : <div style={{ ...card, height: 240 }}>
                    <EmptyState icon={Bot} height={240}
                      title="No model breakdown yet"
                      hint="Shows how each AI engine ranks your brand." />
                  </div>
            }
          </div>
        </div>

        {/* ── ROW 3: Competitor Chart + Recent Mentions ── */}
        <div style={row}>
          <div style={{ flex: "0 0 calc(38% - 8px)" }}>
            {competitorData.length && project
              ? <CompetitorChart data={competitorData} brandName={project.brandName} />
              : <div style={{ ...card, height: "100%", minHeight: 240 }}>
                  <EmptyState icon={Users2}
                    title={competitors.length ? "No competitor scores yet" : "No competitors added"}
                    hint={competitors.length
                      ? `Tracking ${competitors.length} competitor${competitors.length === 1 ? "" : "s"}. Share of voice appears once campaigns have run.`
                      : "Add competitors to compare your share of voice against theirs."} />
                </div>
            }
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
                : <EmptyState icon={MessageSquare}
                    title="No mentions yet"
                    hint="Prompt results naming your brand will be listed here." />
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
              // A factor with no data reads grey — scoring it 0 would paint it
              // the same alarming red as a genuinely bad score.
              const b = s === null
                ? { color: "rgba(255,255,255,0.30)" }
                : getScoreBand(s);
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

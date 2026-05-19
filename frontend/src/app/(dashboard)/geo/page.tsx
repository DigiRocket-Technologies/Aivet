"use client";

import Topbar from "@/components/shared/Topbar";
import {
  Sparkles, ChevronRight, TrendingUp, FileText, Code2,
  HelpCircle, Layers, Cpu, Zap, Target, Clock,
} from "lucide-react";
import type { GEORecommendation } from "@/types";

// ── Config ─────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  content_gap: { icon: FileText,   label: "Content Gap",       color: "#22B8CF" },
  entity:      { icon: Layers,     label: "Entity Opt.",       color: "#C9F31D" },
  schema:      { icon: Code2,      label: "Schema",            color: "#C084FC" },
  faq:         { icon: HelpCircle, label: "FAQ",               color: "#D97757" },
  topical:     { icon: TrendingUp, label: "Topical Authority", color: "#22C55E" },
  ai_friendly: { icon: Cpu,        label: "AI-Friendly",       color: "#10A37F" },
};

const PRIORITY_CONFIG = {
  high:   { color: "#EF4444", bg: "rgba(239,68,68,0.12)",  label: "High"   },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", label: "Medium" },
  low:    { color: "#22C55E", bg: "rgba(34,197,94,0.12)",  label: "Low"    },
};

// ── Data ───────────────────────────────────────────────────────────────────

const RECS: GEORecommendation[] = [
  {
    id: "1", type: "content_gap", priority: "high",
    title: "Add Comparison Pages for Top Competitor Queries",
    description: "AI models frequently cite comparison content when answering 'X vs Y' queries. You're missing 8 high-traffic comparison pages that competitors rank for.",
    impact: 85, effort: 40,
    actionItems: [
      "Create 'Acme Corp vs RivalCo' landing page",
      "Add structured comparison table with schema markup",
      "Include FAQ section targeting comparison queries",
    ],
  },
  {
    id: "2", type: "entity", priority: "high",
    title: "Strengthen Brand Entity in Knowledge Graph",
    description: "Your brand entity is weakly defined across AI training sources. Strengthen Wikipedia presence, Wikidata entries, and authoritative mentions.",
    impact: 78, effort: 55,
    actionItems: [
      "Create/update Wikipedia page with citations",
      "Add structured data (Organization schema) to homepage",
      "Get mentions from .edu and .gov domains",
    ],
  },
  {
    id: "3", type: "faq", priority: "high",
    title: "Add FAQ Schema to Product Pages",
    description: "Perplexity and Google AI Overviews heavily pull from FAQ-structured content. Your product pages lack FAQ markup.",
    impact: 72, effort: 20,
    actionItems: [
      "Add FAQPage schema to top 10 product pages",
      "Write 5–8 Q&A pairs per page targeting informational queries",
      "Use natural language matching AI prompt patterns",
    ],
  },
  {
    id: "4", type: "topical", priority: "medium",
    title: "Build Topical Authority in Core Category",
    description: "AI models prefer citing sources with deep topical coverage. Create a content hub covering all subtopics in your category.",
    impact: 68, effort: 75,
    actionItems: [
      "Map all subtopics in your category",
      "Create pillar page + 15 cluster articles",
      "Interlink all content with semantic anchors",
    ],
  },
  {
    id: "5", type: "schema", priority: "medium",
    title: "Implement HowTo Schema for Tutorial Content",
    description: "ChatGPT and Claude frequently cite step-by-step content. Your tutorials lack HowTo structured data.",
    impact: 55, effort: 25,
    actionItems: [
      "Add HowTo schema to all tutorial pages",
      "Break content into clear numbered steps",
      "Add estimated time and required tools",
    ],
  },
  {
    id: "6", type: "ai_friendly", priority: "low",
    title: "Optimize Content for AI Readability",
    description: "AI models prefer content with clear definitions, short paragraphs, and explicit entity mentions. Reformat key pages.",
    impact: 45, effort: 30,
    actionItems: [
      "Add TL;DR summaries to long-form content",
      "Use explicit brand name in first 100 words",
      "Add definition boxes for key terms",
    ],
  },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function GEOPage() {
  const highCount   = RECS.filter((r) => r.priority === "high").length;
  const medCount    = RECS.filter((r) => r.priority === "medium").length;
  const lowCount    = RECS.filter((r) => r.priority === "low").length;
  const totalImpact = Math.round(RECS.filter((r) => r.priority === "high").reduce((s, r) => s + r.impact, 0) / 10);

  const stats = [
    { label: "Total Opportunities", value: String(RECS.length), color: "#C9F31D",  icon: Sparkles  },
    { label: "High Priority",       value: String(highCount),   color: "#EF4444",  icon: Zap       },
    { label: "Est. Score Boost",    value: `+${totalImpact}`,   color: "#22C55E",  icon: Target    },
    { label: "Quick Wins",          value: String(RECS.filter((r) => r.effort <= 30).length), color: "#22B8CF", icon: Clock },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="GEO Recommendations" subtitle="AI-generated optimization opportunities" />

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

        {/* ── Summary Banner ── */}
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
            <Sparkles size={19} style={{ color: "#C9F31D" }} />
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 3px 0" }}>
              {RECS.length} optimization opportunities found
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", margin: 0 }}>
              Implementing all high-priority items could increase your AI visibility score by an estimated{" "}
              <span style={{ color: "#C9F31D", fontWeight: 700 }}>+{totalImpact} points</span>
            </p>
          </div>

          {/* Priority breakdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[
              { count: highCount,  color: "#EF4444", bg: "rgba(239,68,68,0.12)",  label: "High"   },
              { count: medCount,   color: "#F59E0B", bg: "rgba(245,158,11,0.12)", label: "Medium" },
              { count: lowCount,   color: "#22C55E", bg: "rgba(34,197,94,0.12)",  label: "Low"    },
            ].map(({ count, color, bg, label }) => (
              <div key={label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "8px 16px", borderRadius: 10, background: bg, minWidth: 56,
              }}>
                <span style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {count}
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recommendation Cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECS.map((rec) => {
            const typeConf = TYPE_CONFIG[rec.type];
            const prioConf = PRIORITY_CONFIG[rec.priority];
            const TypeIcon = typeConf.icon;
            const isQuickWin = rec.effort <= 30;

            return (
              <div
                key={rec.id}
                style={{ ...card, padding: "20px 22px", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>

                  {/* Type icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0, marginTop: 1,
                    background: `${typeConf.color}15`, border: `1px solid ${typeConf.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <TypeIcon size={17} style={{ color: typeConf.color }} />
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Title + badges */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{rec.title}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                        background: prioConf.bg, color: prioConf.color,
                      }}>
                        {prioConf.label} Priority
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                        background: `${typeConf.color}15`, color: typeConf.color,
                      }}>
                        {typeConf.label}
                      </span>
                      {isQuickWin && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: "rgba(34,184,207,0.12)", color: "#22B8CF",
                          display: "flex", alignItems: "center", gap: 4,
                        }}>
                          <Zap size={9} />
                          Quick Win
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 14px 0", lineHeight: 1.6 }}>
                      {rec.description}
                    </p>

                    {/* Action items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {rec.actionItems.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                            background: `${typeConf.color}15`, border: `1px solid ${typeConf.color}25`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 800, color: typeConf.color,
                          }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact / Effort + chevron */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, flexShrink: 0 }}>

                    {/* Impact */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 5 }}>Impact</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 72, height: 5, borderRadius: 3,
                          background: "rgba(255,255,255,0.08)", overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%", borderRadius: 3,
                            width: `${rec.impact}%`,
                            background: "linear-gradient(90deg,#22C55E99,#22C55E)",
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", fontVariantNumeric: "tabular-nums", minWidth: 22 }}>
                          {rec.impact}
                        </span>
                      </div>
                    </div>

                    {/* Effort */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 5 }}>Effort</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 72, height: 5, borderRadius: 3,
                          background: "rgba(255,255,255,0.08)", overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%", borderRadius: 3,
                            width: `${rec.effort}%`,
                            background: rec.effort <= 30
                              ? "linear-gradient(90deg,#22B8CF99,#22B8CF)"
                              : rec.effort <= 60
                              ? "linear-gradient(90deg,#F59E0B99,#F59E0B)"
                              : "linear-gradient(90deg,#EF444499,#EF4444)",
                          }} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 22,
                          color: rec.effort <= 30 ? "#22B8CF" : rec.effort <= 60 ? "#F59E0B" : "#EF4444",
                        }}>
                          {rec.effort}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.20)" }} />
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

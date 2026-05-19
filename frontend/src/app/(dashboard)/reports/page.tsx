"use client";

import Topbar from "@/components/shared/Topbar";
import {
  FileText, Download, Mail, Plus, Calendar,
  CheckCircle2, Clock, Users, HardDrive, ArrowUpRight,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────

const REPORTS = [
  {
    name: "Monthly AI Visibility Report — June 2025",
    type: "PDF", size: "2.4 MB", date: "Jul 1, 2025",
    status: "ready", pages: 12, category: "Visibility",
  },
  {
    name: "Competitor Analysis — Q2 2025",
    type: "PDF", size: "1.8 MB", date: "Jun 30, 2025",
    status: "ready", pages: 8, category: "Competitors",
  },
  {
    name: "Citation Audit — June 2025",
    type: "CSV", size: "48 KB", date: "Jun 28, 2025",
    status: "ready", pages: null, category: "Citations",
  },
  {
    name: "GEO Recommendations Report",
    type: "PDF", size: "3.1 MB", date: "Jun 25, 2025",
    status: "ready", pages: 16, category: "GEO",
  },
];

const SCHEDULED = [
  {
    name: "Weekly Visibility Summary",
    frequency: "Every Monday",
    nextRun: "Jul 7, 2025",
    recipients: 2,
    type: "PDF",
  },
  {
    name: "Monthly Full Report",
    frequency: "1st of month",
    nextRun: "Aug 1, 2025",
    recipients: 4,
    type: "PDF",
  },
];

const TYPE_STYLE: Record<string, { color: string; bg: string }> = {
  PDF: { color: "#C9F31D", bg: "rgba(201,243,29,0.12)" },
  CSV: { color: "#22C55E", bg: "rgba(34,197,94,0.12)"  },
};

const CATEGORY_STYLE: Record<string, { color: string; bg: string }> = {
  Visibility:  { color: "#22B8CF", bg: "rgba(34,184,207,0.12)" },
  Competitors: { color: "#C084FC", bg: "rgba(192,132,252,0.12)" },
  Citations:   { color: "#D97757", bg: "rgba(217,119,87,0.12)"  },
  GEO:         { color: "#22C55E", bg: "rgba(34,197,94,0.12)"   },
};

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const totalSize = "7.3 MB";

  const stats = [
    { label: "Total Reports",      value: String(REPORTS.length),    color: "#C9F31D",  icon: FileText      },
    { label: "Scheduled Reports",  value: String(SCHEDULED.length),  color: "#22B8CF",  icon: Calendar      },
    { label: "Total Recipients",   value: String(SCHEDULED.reduce((s, r) => s + r.recipients, 0)), color: "#22C55E", icon: Users },
    { label: "Storage Used",       value: totalSize,                  color: "#C084FC",  icon: HardDrive     },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Reports" subtitle="Generate and schedule AI visibility reports" />

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

        {/* ── Action Buttons ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700,
            }}>
              <Plus size={14} />
              Generate Report
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.70)", fontSize: 13, fontWeight: 600,
            }}>
              <Mail size={14} />
              Schedule Email
            </button>
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            {REPORTS.length} reports · sorted by date
          </span>
        </div>

        {/* ── Generated Reports ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Generated Reports</h3>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>All time</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Report", "Category", "Format", "Size", "Date", "Status", ""].map((h) => (
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
                {REPORTS.map((r, i) => {
                  const typeStyle = TYPE_STYLE[r.type];
                  const catStyle  = CATEGORY_STYLE[r.category] ?? { color: "#fff", bg: "rgba(255,255,255,0.08)" };

                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < REPORTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      {/* Report name */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                            background: typeStyle.bg, border: `1px solid ${typeStyle.color}28`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <FileText size={15} style={{ color: typeStyle.color }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
                            {r.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                          background: catStyle.bg, color: catStyle.color, letterSpacing: "0.04em",
                        }}>
                          {r.category}
                        </span>
                      </td>

                      {/* Format */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6,
                          background: typeStyle.bg, color: typeStyle.color, letterSpacing: "0.06em",
                        }}>
                          {r.type}
                        </span>
                      </td>

                      {/* Size */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.50)", fontVariantNumeric: "tabular-nums" }}>
                          {r.size}
                          {r.pages && (
                            <span style={{ color: "rgba(255,255,255,0.28)", marginLeft: 6 }}>
                              · {r.pages}p
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{r.date}</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "3px 9px", borderRadius: 20,
                          background: "rgba(34,197,94,0.12)", fontSize: 10, fontWeight: 700, color: "#22C55E",
                        }}>
                          <CheckCircle2 size={10} />
                          Ready
                        </div>
                      </td>

                      {/* Download */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <button
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "6px 12px", borderRadius: 7, cursor: "pointer",
                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
                            color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600,
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
                            el.style.color = "rgba(255,255,255,0.65)";
                          }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Scheduled Reports ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: "rgba(34,184,207,0.12)", border: "1px solid rgba(34,184,207,0.20)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Calendar size={12} style={{ color: "#22B8CF" }} />
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Scheduled Reports</h3>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 7, cursor: "pointer",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.60)", fontSize: 12, fontWeight: 600,
            }}>
              <Plus size={12} />
              Add Schedule
            </button>
          </div>

          <div>
            {SCHEDULED.map((s, i) => {
              const typeStyle = TYPE_STYLE[s.type];
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 20px",
                    borderBottom: i < SCHEDULED.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "rgba(34,184,207,0.10)", border: "1px solid rgba(34,184,207,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Calendar size={16} style={{ color: "#22B8CF" }} />
                  </div>

                  {/* Name + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6,
                        background: typeStyle.bg, color: typeStyle.color, letterSpacing: "0.06em",
                      }}>
                        {s.type}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={10} />
                        {s.frequency}
                      </div>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={10} />
                        {s.recipients} recipients
                      </div>
                    </div>
                  </div>

                  {/* Next run */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.30)", marginBottom: 3 }}>Next run</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.nextRun}</div>
                  </div>

                  {/* Edit */}
                  <button style={{
                    display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                    padding: "6px 12px", borderRadius: 7, cursor: "pointer",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.10)";
                      el.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(255,255,255,0.06)";
                      el.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    Edit
                    <ArrowUpRight size={11} />
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

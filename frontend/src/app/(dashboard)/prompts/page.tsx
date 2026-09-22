"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/shared/Topbar";
import EmptyState from "@/components/dashboard/EmptyState";
import Link from "next/link";
import {
  Plus, Play, Trash2, Clock, CheckCircle2, XCircle, Zap, BarChart2, Activity,
  AlertCircle, Loader2, ChevronDown, Bot, RefreshCw,
} from "lucide-react";
import { useCampaigns } from "@/lib/hooks/useCampaigns";
import { campaignsApi, type Campaign, type PromptRun } from "@/lib/api/campaigns";
import { useAuthStore } from "@/lib/stores/authStore";

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
function GenericEngineLogo({ size = 16 }: { size?: number }) {
  return <Bot size={size} style={{ color: "#9CA3AF" }} />;
}

// Engine ids come from the API (see backend/src/lib/aiClients.js), which
// returns google_ai_overview for the DataForSEO caller.
const MODEL_LOGO_MAP: Record<string, React.FC<{ size?: number }>> = {
  chatgpt:            ChatGPTLogo,
  gemini:             GeminiLogo,
  claude:             ClaudeLogo,
  perplexity:         PerplexityLogo,
  google_ai_overview: GeminiLogo,
};

const MODEL_LABEL: Record<string, string> = {
  chatgpt:            "ChatGPT",
  gemini:             "Gemini",
  claude:             "Claude",
  perplexity:         "Perplexity",
  google_ai_overview: "Google AI Overview",
};

function engineLabel(id?: string) {
  if (!id) return "Unknown";
  return MODEL_LABEL[id] ?? id.replace(/_/g, " ");
}

// ── Status Config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  completed: { color: "#22C55E", bg: "rgba(34,197,94,0.12)",   icon: CheckCircle2, label: "Completed" },
  running:   { color: "#C9F31D", bg: "rgba(201,243,29,0.12)",  icon: Activity,     label: "Running"   },
  pending:   { color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  icon: Clock,        label: "Pending"   },
  failed:    { color: "#EF4444", bg: "rgba(239,68,68,0.12)",   icon: XCircle,      label: "Failed"    },
};

type RunStatus = keyof typeof STATUS_CONFIG;

// ── Helpers ────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

function relativeTime(iso?: string): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "—";
  const mins = Math.round(diff / 60000);
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24)    return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function untilTime(iso?: string): string {
  if (!iso) return "—";
  const diff = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(diff)) return "—";
  if (diff <= 0) return "due";
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24)  return `in ${hrs}h`;
  return `in ${Math.round(hrs / 24)}d`;
}

/** Best rank the brand reached across every engine in a run. */
function bestRank(run: PromptRun): number | null {
  const ranks = (run.responses ?? [])
    .flatMap((r) => r.mentions ?? [])
    .map((m) => m.rankPosition)
    .filter((n): n is number => typeof n === "number");
  return ranks.length ? Math.min(...ranks) : null;
}

// ── New campaign form ──────────────────────────────────────────────────────

function NewCampaignForm({
  projectId, onCreated, onCancel,
}: {
  projectId: string;
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [name, setName]           = useState("");
  const [frequency, setFrequency] = useState<Campaign["frequency"]>("daily");
  const [promptText, setPromptText] = useState("");
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prompts = promptText.split("\n").map((l) => l.trim()).filter(Boolean);

  async function submit() {
    if (busy) return;
    setError(null);
    if (!name.trim())   { setError("Give the campaign a name."); return; }
    if (!prompts.length) { setError("Add at least one prompt, one per line."); return; }

    setBusy(true);
    try {
      await campaignsApi.create({
        projectId,
        name: name.trim(),
        frequency,
        prompts: prompts.map((text) => ({ text, isActive: true })),
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create campaign.");
      setBusy(false);
    }
  }

  const input: React.CSSProperties = {
    width: "100%", padding: "9px 13px", borderRadius: 8, fontSize: 13, outline: "none",
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
    color: "#fff", boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
    color: "rgba(255,255,255,0.42)", marginBottom: 6,
  };

  return (
    <div style={{ ...card, padding: 22 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 18px 0" }}>
        New Campaign
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 620 }}>
        <div>
          <label htmlFor="campaign-name" style={label}>CAMPAIGN NAME</label>
          <input id="campaign-name" style={input} value={name}
            onChange={(e) => setName(e.target.value)} placeholder="Brand awareness tracking" />
        </div>

        <div>
          <label htmlFor="campaign-frequency" style={label}>FREQUENCY</label>
          <select id="campaign-frequency" style={input} value={frequency}
            onChange={(e) => setFrequency(e.target.value as Campaign["frequency"])}>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label htmlFor="campaign-prompts" style={label}>PROMPTS — ONE PER LINE</label>
          <textarea id="campaign-prompts" rows={5} style={{ ...input, resize: "vertical", fontFamily: "inherit" }}
            value={promptText} onChange={(e) => setPromptText(e.target.value)}
            placeholder={"What is the best CRM for small businesses?\nTop project management tools"} />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", margin: "6px 0 0 0" }}>
            {prompts.length} prompt{prompts.length === 1 ? "" : "s"} · each is sent to every configured AI engine
          </p>
        </div>

        {error && <p style={{ fontSize: 12, color: "#FCA5A5", margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={submit} disabled={busy} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 20px", borderRadius: 8, border: "none",
            cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1,
            background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700,
          }}>
            {busy ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Campaign"}
          </button>
          <button onClick={onCancel} style={{
            padding: "9px 20px", borderRadius: 8, cursor: "pointer",
            background: "transparent", border: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 600,
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── One run row, expandable to the raw engine answers ──────────────────────

function RunRow({ run }: { run: PromptRun }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[run.status as RunStatus] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const rank = bestRank(run);
  const responses = run.responses ?? [];

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
          padding: "3px 9px", borderRadius: 20, background: cfg.bg, color: cfg.color,
          fontSize: 11, fontWeight: 600,
        }}>
          <StatusIcon size={11} />
          {cfg.label}
        </span>

        <span style={{
          flex: 1, minWidth: 0, fontSize: 12.5, color: "rgba(255,255,255,0.80)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {run.promptText}
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {responses.map((r, i) => {
            const Logo = MODEL_LOGO_MAP[r.model ?? ""] ?? GenericEngineLogo;
            return <span key={i} title={engineLabel(r.model)}><Logo size={14} /></span>;
          })}
        </span>

        <span style={{
          fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, flexShrink: 0,
          minWidth: 34, textAlign: "center",
          background: "rgba(255,255,255,0.06)",
          color: rank === 1 ? "#C9F31D" : "rgba(255,255,255,0.45)",
        }}>
          {rank ? `#${rank}` : "—"}
        </span>

        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", flexShrink: 0, minWidth: 62, textAlign: "right" }}>
          {relativeTime(run.createdAt)}
        </span>

        <ChevronDown size={13} style={{
          color: "rgba(255,255,255,0.35)", flexShrink: 0,
          transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s",
        }} />
      </button>

      {open && (
        <div style={{ padding: "0 16px 14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {run.errorMessage && (
            <p style={{
              fontSize: 11.5, color: "#FCA5A5", margin: 0, padding: "8px 10px", borderRadius: 7,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
            }}>
              {run.errorMessage}
            </p>
          )}

          {responses.length === 0 && !run.errorMessage && (
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", margin: 0 }}>
              {run.status === "running" || run.status === "pending"
                ? "Waiting for the engines to answer…"
                : "No engine returned a response."}
            </p>
          )}

          {responses.map((r, i) => {
            const Logo = MODEL_LOGO_MAP[r.model ?? ""] ?? GenericEngineLogo;
            const mention = (r.mentions ?? [])[0];
            return (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                  <Logo size={13} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{engineLabel(r.model)}</span>
                  {mention
                    ? <span style={{
                        fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                        background: "rgba(201,243,29,0.14)", color: "#C9F31D",
                      }}>
                        mentioned{mention.rankPosition ? ` · rank #${mention.rankPosition}` : ""}
                      </span>
                    : <span style={{
                        fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.40)",
                      }}>
                        not mentioned
                      </span>
                  }
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.28)" }}>
                    {r.latencyMs ? `${(r.latencyMs / 1000).toFixed(1)}s` : ""}
                    {r.citations?.length ? ` · ${r.citations.length} citations` : ""}
                  </span>
                </div>
                <p style={{
                  fontSize: 11.5, lineHeight: 1.55, color: "rgba(255,255,255,0.58)",
                  margin: 0, whiteSpace: "pre-wrap",
                }}>
                  {(r.responseText ?? "").slice(0, 600)}
                  {(r.responseText ?? "").length > 600 ? "…" : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PromptsPage() {
  const projectId = useAuthStore((s) => s.projectId);
  const { campaigns, runs, runsByCampaign, loading, error, reload } = useCampaigns();

  const [filter, setFilter]     = useState<"all" | "active" | "paused">("all");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId]     = useState<string | null>(null);
  const [notice, setNotice]     = useState<string | null>(null);

  const stats = useMemo(() => {
    const total     = runs.length;
    const completed = runs.filter((r) => r.status === "completed").length;
    const inFlight  = runs.filter((r) => r.status === "running" || r.status === "pending").length;
    return {
      campaigns: campaigns.length,
      runs:      total,
      // Undefined, not 0% — a project with no runs has no success rate.
      success:   total ? `${Math.round((completed / total) * 100)}%` : "—",
      running:   inFlight,
    };
  }, [campaigns, runs]);

  const visible = campaigns.filter((c) =>
    filter === "all" ? true : filter === "active" ? c.isActive : !c.isActive);

  async function handleRun(c: Campaign) {
    setBusyId(c._id);
    setNotice(null);
    try {
      const res = await campaignsApi.run(c._id);
      setNotice(`Queued ${res.queued} prompt${res.queued === 1 ? "" : "s"} for "${c.name}". Results appear below as each engine answers.`);
      // The worker runs inline locally and takes a few seconds per engine.
      setTimeout(reload, 4000);
      setTimeout(reload, 12000);
      setTimeout(reload, 25000);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not start the run.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggle(c: Campaign) {
    setBusyId(c._id);
    try {
      await campaignsApi.update(c._id, { isActive: !c.isActive });
      reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(c: Campaign) {
    if (!window.confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    setBusyId(c._id);
    try {
      await campaignsApi.remove(c._id);
      reload();
    } finally {
      setBusyId(null);
    }
  }

  const statCards = [
    { label: "Total Campaigns", value: stats.campaigns, icon: BarChart2,    color: "#C9F31D" },
    { label: "Total Runs",      value: stats.runs,      icon: Zap,          color: "#22B8CF" },
    { label: "Success Rate",    value: stats.success,   icon: CheckCircle2, color: "#22C55E" },
    { label: "Running Now",     value: stats.running,   icon: Activity,     color: "#C9F31D" },
  ];

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Prompt Campaigns" subtitle="Monitor your brand across AI models" />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

        {!projectId && !loading && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)",
          }}>
            <AlertCircle size={14} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
              No project yet. Create one in{" "}
              <Link href="/settings" style={{ color: "#C9F31D", fontWeight: 600 }}>Settings → Project</Link>
              {" "}before running campaigns.
            </span>
          </div>
        )}

        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
              <AlertCircle size={14} style={{ color: "#EF4444" }} />
              {error}
            </span>
            <button onClick={reload} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7,
              border: "none", cursor: "pointer", background: "rgba(239,68,68,0.12)",
              color: "#EF4444", fontSize: 11, fontWeight: 600,
            }}>
              <RefreshCw size={11} /> Retry
            </button>
          </div>
        )}

        {notice && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
            background: "rgba(201,243,29,0.07)", border: "1px solid rgba(201,243,29,0.20)",
          }}>
            <CheckCircle2 size={14} style={{ color: "#C9F31D", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.70)" }}>{notice}</span>
          </div>
        )}

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ ...card, padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                  {loading ? "…" : value}
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "2px 0 0 0" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters + New ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {([
              { id: "all"    as const, label: "All Campaigns", count: campaigns.length },
              { id: "active" as const, label: "Active",        count: campaigns.filter((c) => c.isActive).length },
              { id: "paused" as const, label: "Paused",        count: campaigns.filter((c) => !c.isActive).length },
            ]).map(({ id, label, count }) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9,
                border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                background: filter === id ? "#C9F31D" : "rgba(255,255,255,0.04)",
                color: filter === id ? "#000" : "rgba(255,255,255,0.55)",
              }}>
                {label}
                <span style={{
                  fontSize: 11, padding: "1px 6px", borderRadius: 20,
                  background: filter === id ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
                }}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCreating(true)}
            disabled={!projectId}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9,
              border: "none", cursor: projectId ? "pointer" : "not-allowed", opacity: projectId ? 1 : 0.45,
              background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700,
            }}
          >
            <Plus size={14} /> New Campaign
          </button>
        </div>

        {creating && projectId && (
          <NewCampaignForm
            projectId={projectId}
            onCancel={() => setCreating(false)}
            onCreated={() => { setCreating(false); reload(); }}
          />
        )}

        {/* ── Campaign list ── */}
        {loading ? (
          <div style={{ ...card, padding: 40 }}>
            <EmptyState icon={Loader2} title="Loading campaigns…" />
          </div>
        ) : visible.length === 0 ? (
          <div style={{ ...card, padding: 40 }}>
            <EmptyState
              icon={Zap}
              title={campaigns.length ? "No campaigns match this filter" : "No campaigns yet"}
              hint={campaigns.length
                ? undefined
                : "Create a campaign to ask AI engines about your brand and track how you rank."}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visible.map((c) => {
              const cRuns    = runsByCampaign[c._id] ?? [];
              const latest   = cRuns[0];
              const done     = cRuns.filter((r) => r.status === "completed").length;
              const active   = cRuns.some((r) => r.status === "running" || r.status === "pending");
              const engines  = Array.from(new Set(
                cRuns.flatMap((r) => (r.responses ?? []).map((x) => x.model)).filter(Boolean)
              )) as string[];
              const status: RunStatus = active
                ? "running"
                : latest
                  ? (latest.status as RunStatus)
                  : "pending";
              const cfg = STATUS_CONFIG[status];

              return (
                <div key={c._id} style={{ ...card, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: cfg.bg, border: `1px solid ${cfg.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <cfg.icon size={17} style={{ color: cfg.color }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", margin: 0 }}>{c.name}</h3>
                      <span style={{
                        fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        background: cfg.bg, color: cfg.color,
                      }}>
                        {cfg.label}
                      </span>
                      {!c.isActive && (
                        <span style={{
                          fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                          background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)",
                        }}>
                          Paused
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", margin: 0 }}>
                      {c.prompts.length} prompt{c.prompts.length === 1 ? "" : "s"}
                      {"  ·  "}{c.frequency}
                      {"  ·  "}Last: {latest ? relativeTime(latest.createdAt) : "never"}
                      {"  ·  "}Next: {c.isActive ? untilTime(c.nextRunAt) : "paused"}
                      {cRuns.length > 0 && `  ·  ${done}/${cRuns.length} runs succeeded`}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    {engines.length > 0
                      ? engines.map((m) => {
                          const Logo = MODEL_LOGO_MAP[m] ?? GenericEngineLogo;
                          return (
                            <span key={m} title={engineLabel(m)} style={{
                              width: 30, height: 30, borderRadius: 8,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                            }}>
                              <Logo size={15} />
                            </span>
                          );
                        })
                      : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>not run yet</span>
                    }
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => handleRun(c)}
                      disabled={busyId === c._id}
                      title="Run now"
                      style={{
                        width: 34, height: 34, borderRadius: 8, cursor: "pointer",
                        background: "rgba(201,243,29,0.10)", border: "1px solid rgba(201,243,29,0.22)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {busyId === c._id
                        ? <Loader2 size={14} className="animate-spin" style={{ color: "#C9F31D" }} />
                        : <Play size={14} style={{ color: "#C9F31D" }} />}
                    </button>
                    <button
                      onClick={() => handleToggle(c)}
                      title={c.isActive ? "Pause schedule" : "Resume schedule"}
                      style={{
                        width: 34, height: 34, borderRadius: 8, cursor: "pointer",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Clock size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      title="Delete campaign"
                      style={{
                        width: 34, height: 34, borderRadius: 8, cursor: "pointer",
                        background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.16)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Trash2 size={14} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Recent runs ── */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Recent Prompt Runs</h3>
            <button onClick={reload} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.10)", cursor: "pointer",
              background: "transparent", color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600,
            }}>
              <RefreshCw size={11} /> Refresh
            </button>
          </div>

          {runs.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No prompt runs yet"
              hint="Press play on a campaign to send its prompts to every configured AI engine."
            />
          ) : (
            <div>
              {runs.slice(0, 30).map((r) => <RunRow key={r._id} run={r} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

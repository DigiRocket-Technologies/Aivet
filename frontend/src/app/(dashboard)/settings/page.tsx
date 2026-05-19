"use client";

import Topbar from "@/components/shared/Topbar";
import { useState } from "react";
import {
  Eye, EyeOff, Copy, RefreshCw, Plus, Trash2,
  FolderOpen, Users, Key, Bell, CheckCircle2, Shield, Globe, Building2,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "Project",       icon: FolderOpen },
  { id: "Team",          icon: Users      },
  { id: "API Keys",      icon: Key        },
  { id: "Notifications", icon: Bell       },
];

const TEAM = [
  { name: "John Doe",  email: "john@acme.com",  role: "Owner",  avatar: "JD", joined: "Jan 2025" },
  { name: "Sarah Kim", email: "sarah@acme.com", role: "Admin",  avatar: "SK", joined: "Mar 2025" },
  { name: "Mike Chen", email: "mike@acme.com",  role: "Member", avatar: "MC", joined: "May 2025" },
];

const ROLE_STYLE: Record<string, { color: string; bg: string }> = {
  Owner:  { color: "#C9F31D", bg: "rgba(201,243,29,0.12)"  },
  Admin:  { color: "#22B8CF", bg: "rgba(34,184,207,0.12)"  },
  Member: { color: "rgba(255,255,255,0.55)", bg: "rgba(255,255,255,0.07)" },
};

const NOTIFICATIONS = [
  { label: "Weekly visibility summary",    desc: "Receive a weekly digest of your AI visibility score",  enabled: true  },
  { label: "Campaign completion alerts",   desc: "Get notified when a prompt campaign finishes running", enabled: true  },
  { label: "Score drop alerts",            desc: "Alert when your visibility score drops by 5+ points",  enabled: true  },
  { label: "New citation detected",        desc: "Notify when a new domain cites your brand",            enabled: false },
  { label: "Competitor score changes",     desc: "Alert when a competitor's score changes significantly",enabled: false },
  { label: "Monthly report ready",         desc: "Email when your monthly report is generated",          enabled: true  },
];

// ── Styles ─────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 13px",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#fff",
  boxSizing: "border-box",
};

// ── Toggle ─────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
        background: enabled ? "#C9F31D" : "rgba(255,255,255,0.12)",
        position: "relative", flexShrink: 0, transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: enabled ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: enabled ? "#000" : "rgba(255,255,255,0.55)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab]   = useState("Project");
  const [showKey, setShowKey]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const [notifs, setNotifs]         = useState(NOTIFICATIONS.map((n) => n.enabled));

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div style={{ background: "#0E0F11", minHeight: "100vh" }}>
      <Topbar title="Settings" subtitle="Manage your project and account settings" />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Tabs ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: 4, borderRadius: 10, width: "fit-content",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                background: activeTab === id ? "#C9F31D" : "transparent",
                color: activeTab === id ? "#000" : "rgba(255,255,255,0.50)",
              }}
            >
              <Icon size={13} />
              {id}
            </button>
          ))}
        </div>

        {/* ── PROJECT TAB ── */}
        {activeTab === "Project" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 860 }}>

            {/* Project Details */}
            <div style={{ ...card, padding: "22px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "rgba(201,243,29,0.12)", border: "1px solid rgba(201,243,29,0.20)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FolderOpen size={13} style={{ color: "#C9F31D" }} />
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Project Details</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Project Name",  value: "Acme Corp",    icon: Building2 },
                  { label: "Domain",        value: "acmecorp.com", icon: Globe     },
                  { label: "Brand Name",    value: "Acme Corp",    icon: Shield    },
                  { label: "Industry",      value: "SaaS / B2B",   icon: FolderOpen },
                  { label: "Target Region", value: "Global",       icon: Globe     },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.42)", marginBottom: 6, letterSpacing: "0.04em" }}>
                      {label.toUpperCase()}
                    </label>
                    <input defaultValue={value} style={inputStyle} />
                  </div>
                ))}

                <button style={{
                  marginTop: 4, padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700, alignSelf: "flex-start",
                }}>
                  Save Changes
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ ...card, padding: "22px 22px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 6px 0" }}>Project Info</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", margin: "0 0 16px 0" }}>
                  Created January 12, 2025 · Plan: Pro
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Prompts tracked", value: "742" },
                    { label: "Campaigns active", value: "3"  },
                    { label: "Competitors",       value: "4"  },
                    { label: "Team members",      value: "3"  },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                ...card,
                padding: "22px 22px",
                border: "1px solid rgba(239,68,68,0.18)",
                background: "rgba(239,68,68,0.03)",
              }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", margin: "0 0 6px 0" }}>Danger Zone</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", margin: "0 0 16px 0" }}>
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button style={{
                    padding: "8px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                    color: "#EF4444", fontSize: 12, fontWeight: 600,
                  }}>
                    Reset all campaign data
                  </button>
                  <button style={{
                    padding: "8px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                    color: "#EF4444", fontSize: 12, fontWeight: 600,
                  }}>
                    Delete project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TEAM TAB ── */}
        {activeTab === "Team" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: "rgba(201,243,29,0.12)", border: "1px solid rgba(201,243,29,0.20)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Users size={12} style={{ color: "#C9F31D" }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Team Members</h3>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                    background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)",
                  }}>
                    {TEAM.length}
                  </span>
                </div>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                  background: "#C9F31D", color: "#000", fontSize: 12, fontWeight: 700,
                }}>
                  <Plus size={12} />
                  Invite Member
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {["Member", "Role", "Joined", ""].map((h) => (
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
                    {TEAM.map((m, i) => {
                      const roleStyle = ROLE_STYLE[m.role];
                      return (
                        <tr
                          key={m.email}
                          style={{
                            borderBottom: i < TEAM.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          {/* Member */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                                background: "rgba(201,243,29,0.12)", border: "1px solid rgba(201,243,29,0.20)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 800, color: "#C9F31D",
                              }}>
                                {m.avatar}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.name}</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 1 }}>{m.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                              background: roleStyle.bg, color: roleStyle.color, letterSpacing: "0.04em",
                            }}>
                              {m.role}
                            </span>
                          </td>

                          {/* Joined */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{m.joined}</span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            {m.role !== "Owner" ? (
                              <button style={{
                                width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer",
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "background 0.15s",
                              }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.18)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                              >
                                <Trash2 size={12} style={{ color: "#EF4444" }} />
                              </button>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                                <Shield size={11} />
                                Protected
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── API KEYS TAB ── */}
        {activeTab === "API Keys" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ ...card, padding: "22px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.20)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Key size={13} style={{ color: "#C084FC" }} />
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Your API Key</h3>
              </div>

              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>
                Use this key to access the AIVet API programmatically. Keep it secret — do not share or expose it in client-side code.
              </p>

              {/* Key display */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.42)", marginBottom: 8, letterSpacing: "0.04em" }}>
                  SECRET KEY
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    flex: 1, display: "flex", alignItems: "center",
                    padding: "10px 14px", borderRadius: 8,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                    fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.70)",
                    letterSpacing: showKey ? "0.02em" : "0.12em",
                    overflow: "hidden", whiteSpace: "nowrap",
                  }}>
                    {showKey ? "aivet_live_sk_a8f3d2c1e9b4f7a2d6e8c3b1" : "aivet_live_sk_••••••••••••••••••••••••"}
                  </div>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(255,255,255,0.06)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  >
                    {showKey
                      ? <EyeOff size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
                      : <Eye    size={14} style={{ color: "rgba(255,255,255,0.55)" }} />}
                  </button>
                  <button
                    onClick={handleCopy}
                    style={{
                      width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                      border: copied ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(255,255,255,0.09)",
                      transition: "all 0.15s",
                    }}
                  >
                    {copied
                      ? <CheckCircle2 size={14} style={{ color: "#22C55E" }} />
                      : <Copy size={14} style={{ color: "rgba(255,255,255,0.55)" }} />}
                  </button>
                </div>
              </div>

              {/* Key meta */}
              <div style={{
                padding: "12px 14px", borderRadius: 8,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                {[
                  { label: "Created",      value: "Jan 12, 2025" },
                  { label: "Last used",    value: "2 hours ago"  },
                  { label: "Permissions",  value: "Read + Write" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.30)", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Regenerate */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                  color: "#EF4444", fontSize: 12, fontWeight: 600,
                }}>
                  <RefreshCw size={13} />
                  Regenerate Key
                </button>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
                  This will invalidate your current key immediately.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === "Notifications" && (
          <div style={{ maxWidth: 620 }}>
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
                    <Bell size={12} style={{ color: "#22B8CF" }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Email Notifications</h3>
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  {notifs.filter(Boolean).length} of {notifs.length} enabled
                </span>
              </div>

              <div>
                {NOTIFICATIONS.map((n, i) => (
                  <div
                    key={n.label}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px",
                      borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{n.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{n.desc}</div>
                    </div>
                    <Toggle
                      enabled={notifs[i]}
                      onChange={() => setNotifs((prev) => prev.map((v, j) => j === i ? !v : v))}
                    />
                  </div>
                ))}
              </div>

              <div style={{
                padding: "14px 20px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                display: "flex", justifyContent: "flex-end",
              }}>
                <button style={{
                  padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "#C9F31D", color: "#000", fontSize: 13, fontWeight: 700,
                }}>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

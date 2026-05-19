"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Eye, Zap, Users2, Link2, Sparkles,
  FileText, CreditCard, Settings, ChevronDown,
  Bot, LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/overview",    icon: LayoutDashboard, label: "Overview" },
  { href: "/visibility",  icon: Eye,             label: "AI Visibility" },
  { href: "/prompts",     icon: Zap,             label: "Prompt Campaigns" },
  { href: "/competitors", icon: Users2,          label: "Competitors" },
  { href: "/citations",   icon: Link2,           label: "Citations" },
  { href: "/geo",         icon: Sparkles,        label: "GEO Recommendations" },
  { href: "/reports",     icon: FileText,        label: "Reports" },
];

const BOTTOM_ITEMS = [
  { href: "/billing",  icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings,   label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "240px",
        height: "100vh",
        background: "#0E0F11",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "20px 16px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#C9F31D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Bot size={16} color="#000" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: "-0.3px" }}>
          AIVet
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 4,
            background: "rgba(201,243,29,0.12)",
            color: "#C9F31D",
            flexShrink: 0,
          }}
        >
          PRO
        </span>
      </div>

      {/* ── Project Selector ── */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#C9F31D",
              color: "#000",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#fff",
              flex: 1,
              textAlign: "left",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Acme Corp
          </span>
          <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.40)", flexShrink: 0 }} />
        </button>
      </div>

      {/* ── Main Nav ── */}
      <nav
        style={{
          flex: 1,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 10px 8px",
          }}
        >
          Main
        </p>

        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                background: active ? "#C9F31D" : "transparent",
                color: active ? "#000" : "rgba(255,255,255,0.65)",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                }
              }}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Nav ── */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                background: active ? "#C9F31D" : "transparent",
                color: active ? "#000" : "rgba(255,255,255,0.55)",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}

        {/* ── User Profile ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 8,
            marginTop: 4,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(201,243,29,0.15)",
              color: "#C9F31D",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            JD
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              John Doe
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              john@acme.com
            </p>
          </div>
          <LogOut size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}

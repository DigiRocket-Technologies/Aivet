"use client";

import { Bell, Search, Calendar, ChevronDown } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(14,15,17,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.3 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", margin: 0, marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Search size={13} style={{ color: "rgba(255,255,255,0.40)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              width: 130,
            }}
          />
        </div>

        {/* Date Range */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.70)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Calendar size={13} />
          Last 30 days
          <ChevronDown size={12} />
        </button>

        {/* Notifications */}
        <button
          style={{
            position: "relative",
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={14} style={{ color: "rgba(255,255,255,0.70)" }} />
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#C9F31D",
            }}
          />
        </button>
      </div>
    </header>
  );
}

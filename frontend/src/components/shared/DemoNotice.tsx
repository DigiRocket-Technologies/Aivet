"use client";

import { FlaskConical } from "lucide-react";

/**
 * Marks a page whose contents are still placeholder figures, not this
 * account's data. Unlabelled sample numbers sitting next to real ones are
 * indistinguishable from a broken dashboard.
 */
export default function DemoNotice({ what }: { what: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 10,
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.22)",
      }}
    >
      <FlaskConical size={14} style={{ color: "#F59E0B", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>
        <strong style={{ color: "#F59E0B", fontWeight: 700 }}>Sample data</strong>
        {" — "}this page is not connected to your account yet. {what}
      </span>
    </div>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";

/**
 * Shown wherever a panel has no data to display. The alternative — filling the
 * panel with sample figures — reads as real and is worse than showing nothing.
 */
export default function EmptyState({
  icon: Icon,
  title,
  hint,
  height,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        height,
        minHeight: height ? undefined : 140,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 20,
        textAlign: "center",
      }}
    >
      <Icon size={20} style={{ color: "rgba(255,255,255,0.20)" }} />
      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", margin: 0 }}>
        {title}
      </p>
      {hint && (
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0, maxWidth: 260 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

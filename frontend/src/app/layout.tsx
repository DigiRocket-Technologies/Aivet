import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIVet — AI Visibility & GEO Platform",
  description: "Track your brand across ChatGPT, Gemini, Claude & Perplexity. AI Visibility Scoring, GEO Optimization, Competitor Analysis.",
  keywords: ["AI visibility", "GEO", "generative engine optimization", "brand tracking", "AI search"],
};

export const viewport: Viewport = {
  themeColor: "#0E0F11",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

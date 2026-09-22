import { api } from "./client";

// Field names mirror the API exactly — it answers in camelCase
// (see backend/src/routes/visibility.js).
export interface TrendEntry {
  scoreDate:        string;
  overallScore:     number;
  mentionScore:     number | null;
  rankingScore:     number | null;
  sentimentScore:   number | null;
  citationScore:    number | null;
  diversityScore:   number | null;
  totalPrompts:     number | null;
  totalMentions:    number | null;
  modelsBreakdown:  Record<string, number> | null;
}

export interface DashboardData {
  currentScore:  number;
  scoreBand:     string;
  scoreChange:   number;
  totalPrompts:  number;
  totalMentions: number;
  trend:         TrendEntry[];
}

export type LatestScore = TrendEntry;

export const visibilityApi = {
  getDashboard: (projectId: string, days = 30) =>
    api.get<DashboardData>(`/projects/${projectId}/dashboard?days=${days}`),

  getLatestScore: (projectId: string) =>
    api.get<LatestScore>(`/projects/${projectId}/scores/latest`),
};

import { api } from "./client";

export interface DashboardData {
  current_score:  number;
  score_band:     string;
  score_change:   number;
  total_prompts:  number;
  total_mentions: number;
  trend: {
    score_date:       string;
    overall_score:    number;
    mention_score:    number | null;
    ranking_score:    number | null;
    sentiment_score:  number | null;
    citation_score:   number | null;
    diversity_score:  number | null;
    total_prompts:    number | null;
    total_mentions:   number | null;
    models_breakdown: Record<string, number> | null;
  }[];
}

export interface LatestScore {
  score_date:       string;
  overall_score:    number;
  mention_score:    number | null;
  ranking_score:    number | null;
  sentiment_score:  number | null;
  citation_score:   number | null;
  diversity_score:  number | null;
  total_prompts:    number | null;
  total_mentions:   number | null;
  models_breakdown: Record<string, number> | null;
}

export const visibilityApi = {
  getDashboard: (projectId: string, days = 30) =>
    api.get<DashboardData>(`/projects/${projectId}/dashboard?days=${days}`),

  getLatestScore: (projectId: string) =>
    api.get<LatestScore>(`/projects/${projectId}/scores/latest`),
};

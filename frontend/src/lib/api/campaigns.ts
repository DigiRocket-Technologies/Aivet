import { api } from "./client";

export interface CampaignPrompt {
  _id?:      string;
  text:      string;
  category?: string;
  intent?:   string;
  isActive?: boolean;
}

export interface Campaign {
  _id:          string;
  projectId:    string;
  name:         string;
  description?: string;
  frequency:    "hourly" | "daily" | "weekly";
  isActive:     boolean;
  nextRunAt?:   string;
  prompts:      CampaignPrompt[];
  createdAt?:   string;
  updatedAt?:   string;
}

export interface RunMention {
  entityName?:     string;
  mentionCount?:   number;
  rankPosition?:   number;
  sentiment?:      string;
  contextSnippet?: string;
}

export interface RunCitation {
  citedUrl?:      string;
  citedDomain?:   string;
  isBrandDomain?: boolean;
}

export interface RunResponse {
  model?:        string;
  provider?:     string;
  responseText?: string;
  tokensUsed?:   number;
  latencyMs?:    number;
  mentions?:     RunMention[];
  citations?:    RunCitation[];
}

export interface PromptRun {
  _id:           string;
  campaignId:    string;
  projectId:     string;
  promptText:    string;
  status:        "pending" | "running" | "completed" | "failed";
  startedAt?:    string;
  completedAt?:  string;
  errorMessage?: string;
  responses?:    RunResponse[];
  createdAt?:    string;
}

export const campaignsApi = {
  list: (projectId: string) =>
    api.get<Campaign[]>(`/campaigns?projectId=${encodeURIComponent(projectId)}`),

  create: (body: {
    projectId: string;
    name: string;
    description?: string;
    frequency: Campaign["frequency"];
    prompts: CampaignPrompt[];
  }) => api.post<Campaign>("/campaigns", body),

  update: (id: string, body: Partial<Campaign>) =>
    api.put<Campaign>(`/campaigns/${id}`, body),

  remove: (id: string) => api.delete<void>(`/campaigns/${id}`),

  run: (id: string) => api.post<{ queued: number }>(`/campaigns/${id}/run`, {}),

  runs: (id: string) => api.get<PromptRun[]>(`/campaigns/${id}/runs`),
};

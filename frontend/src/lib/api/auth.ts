import { api } from "./client";

export interface AuthResponse {
  token:    string;
  userId:   string;
  email:    string;
  fullName: string;
  teamId:   string;
}

export interface Competitor {
  domain:    string;
  brandName: string;
  addedAt?:  string;
}

export interface Project {
  _id:           string;
  name:          string;
  domain:        string;
  brandName:     string;
  industry?:     string;
  targetRegion?: string;
  competitors?:  Competitor[];
  createdAt?:    string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  register: (email: string, password: string, fullName: string) =>
    api.post<AuthResponse>("/auth/register", { email, password, fullName }),

  me: () => api.get<{ id: string; email: string; fullName: string }>("/auth/me"),
};

export const projectsApi = {
  list:   ()                   => api.get<Project[]>("/projects"),
  create: (body: Partial<Project>) => api.post<Project>("/projects", body),
  update: (id: string, body: Partial<Project>) => api.put<Project>(`/projects/${id}`, body),
};

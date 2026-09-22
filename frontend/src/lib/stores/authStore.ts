import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/lib/api/auth";

export interface AuthUser {
  id:         string;
  email:      string;
  fullName:   string;
  avatarUrl?: string | null;
}

interface AuthState {
  token:     string | null;
  user:      AuthUser | null;
  projectId: string | null;
  projects:  Project[];
  /** False until persisted state has been read back from localStorage. */
  hydrated:  boolean;

  setHydrated:  () => void;
  setAuth:      (token: string, user: AuthUser) => void;
  setProjects:  (projects: Project[]) => void;
  setProjectId: (id: string) => void;
  logout:       () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:     null,
      user:      null,
      projectId: null,
      projects:  [],
      hydrated:  false,

      setHydrated: () => set({ hydrated: true }),

      setAuth: (token, user) => {
        // The API client reads the raw token straight from localStorage, so it
        // has to be kept in step with the persisted store.
        localStorage.setItem("access_token", token);
        set({ token, user });
      },

      setProjects: (projects) =>
        set((s) => ({
          projects,
          // Keep the current selection if it still exists, else fall back to
          // the first project so the dashboard has something to show.
          projectId: projects.some((p) => p._id === s.projectId)
            ? s.projectId
            : projects[0]?._id ?? null,
        })),

      setProjectId: (id) => set({ projectId: id }),

      logout: () => {
        localStorage.removeItem("access_token");
        set({ token: null, user: null, projectId: null, projects: [] });
      },
    }),
    {
      name: "aivet-auth",
      partialize: (s) => ({
        token:     s.token,
        user:      s.user,
        projectId: s.projectId,
        projects:  s.projects,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-seed the raw token: a reload restores the store from localStorage
        // but nothing else puts `access_token` back for the API client.
        // Note this runs during create(), so the store binding isn't assigned
        // yet — go through the rehydrated state's own action, not the hook.
        if (state?.token) localStorage.setItem("access_token", state.token);
        state?.setHydrated();
      },
    }
  )
);

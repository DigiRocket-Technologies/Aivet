import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
}

interface AuthState {
  token:        string | null;
  user:         AuthUser | null;
  projectId:    string | null;

  setAuth:      (token: string, user: AuthUser) => void;
  setProjectId: (id: string) => void;
  logout:       () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:     null,
      user:      null,
      projectId: null,

      setAuth: (token, user) => {
        localStorage.setItem("access_token", token);
        set({ token, user });
      },

      setProjectId: (id) => set({ projectId: id }),

      logout: () => {
        localStorage.removeItem("access_token");
        set({ token: null, user: null, projectId: null });
      },
    }),
    {
      name: "aivet-auth",
      partialize: (s) => ({ token: s.token, user: s.user, projectId: s.projectId }),
    }
  )
);

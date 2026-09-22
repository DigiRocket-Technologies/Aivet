"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Gates the dashboard. Renders nothing until the persisted session has been
 * read back from localStorage — without that wait, a reload would bounce a
 * signed-in user to /login before the store rehydrates.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token  = useAuthStore((s) => s.token);

  // The store rehydrates at module scope, so by the first client render it is
  // already hydrated — which would not match what the server rendered. The
  // server snapshot pins the first render to `false` on both sides.
  const ready = useSyncExternalStore(
    useAuthStore.subscribe,
    () => useAuthStore.getState().hydrated,
    () => false,
  );

  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  if (!ready || !token) {
    return <div style={{ background: "#0E0F11", minHeight: "100vh" }} />;
  }

  return <>{children}</>;
}

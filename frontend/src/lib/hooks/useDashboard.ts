import { useEffect, useState } from "react";
import { visibilityApi, type DashboardData } from "@/lib/api/visibility";
import { useAuthStore } from "@/lib/stores/authStore";

interface UseDashboardResult {
  data:    DashboardData | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

export function useDashboard(days = 30): UseDashboardResult {
  const projectId = useAuthStore((s) => s.projectId);
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    visibilityApi
      .getDashboard(projectId, days)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [projectId, days, tick]);

  return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}

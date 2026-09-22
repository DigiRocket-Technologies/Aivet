"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { campaignsApi, type Campaign, type PromptRun } from "@/lib/api/campaigns";
import { useAuthStore } from "@/lib/stores/authStore";

export interface CampaignsState {
  campaigns: Campaign[];
  /** Runs across every campaign, newest first. */
  runs:      PromptRun[];
  runsByCampaign: Record<string, PromptRun[]>;
  loading:   boolean;
  error:     string | null;
  reload:    () => void;
}

export function useCampaigns(): CampaignsState {
  const projectId = useAuthStore((s) => s.projectId);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [runsByCampaign, setRunsByCampaign] = useState<Record<string, PromptRun[]>>({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  // Stops a slow response for one project overwriting a newer one after the
  // user switches projects.
  const requestId = useRef(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const id = ++requestId.current;
    const current = () => id === requestId.current;

    async function load() {
      // Yield first so nothing in here updates state synchronously while the
      // effect is still running.
      await Promise.resolve();

      if (!projectId) {
        if (!current()) return;
        setCampaigns([]);
        setRunsByCampaign({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const list = await campaignsApi.list(projectId);
        if (!current()) return;
        setCampaigns(list);

        // Runs are exposed per campaign only, so fan out and merge.
        const perCampaign = await Promise.all(
          list.map(async (c) =>
            [c._id, await campaignsApi.runs(c._id).catch(() => [])] as const)
        );
        if (!current()) return;
        setRunsByCampaign(Object.fromEntries(perCampaign));
      } catch (err) {
        if (!current()) return;
        setError(err instanceof Error ? err.message : "Could not load campaigns.");
      } finally {
        if (current()) setLoading(false);
      }
    }

    void load();
  }, [projectId, tick]);

  const runs = Object.values(runsByCampaign)
    .flat()
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  return { campaigns, runs, runsByCampaign, loading, error, reload };
}

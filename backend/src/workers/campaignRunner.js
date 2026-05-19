import { Campaign, PromptRun } from "../models/index.js";
import { availableCallers } from "../lib/aiClients.js";
import { calculateScoreForProject } from "./scoreCalculator.js";

// ── Simple mention extractor ──────────────────────────────────────────────
// Brand-name match with rough rank-position + naive positive sentiment.
// Replace with a real NLP/LLM call when ready.
function extractMentions(text, brandName) {
  if (!text || !brandName) return [];
  const lower = text.toLowerCase();
  const brand = brandName.toLowerCase();
  const idx = lower.indexOf(brand);
  if (idx === -1) return [];

  // Approximate rank position by how early the brand appears (1-10 buckets)
  const rank = Math.max(1, Math.min(10, Math.floor((idx / Math.max(1, text.length)) * 10) + 1));
  const count = (lower.match(new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
  return [{
    entityName:     brandName,
    entityType:     "brand",
    mentionCount:   count,
    rankPosition:   rank,
    sentiment:      "positive",
    sentimentScore: 0.5,
    confidence:     0.7,
    contextSnippet: text.slice(Math.max(0, idx - 60), idx + 120),
  }];
}

function markBrandCitations(citations, brandDomain) {
  if (!brandDomain) return citations;
  const d = brandDomain.toLowerCase();
  return citations.map((c) => ({
    ...c,
    isBrandDomain: c.citedDomain?.toLowerCase().includes(d) ?? false,
  }));
}

// ── Main runner ───────────────────────────────────────────────────────────

export async function runCampaign(campaignId) {
  const campaign = await Campaign.findById(campaignId).populate("projectId");
  if (!campaign) return;

  const project   = campaign.projectId;
  const brandName = project?.brandName ?? "";
  const brandDomain = project?.domain ?? "";
  const activePrompts = campaign.prompts.filter((p) => p.isActive);
  const callers = availableCallers();

  if (!callers.length) {
    console.warn(`[campaign ${campaignId}] no AI engines configured`);
    return;
  }

  for (const prompt of activePrompts) {
    const run = await PromptRun.findOneAndUpdate(
      { campaignId, promptText: prompt.text, status: "pending" },
      { status: "running", startedAt: new Date() },
      { new: true, sort: { createdAt: -1 } }
    );
    if (!run) continue;

    try {
      const results = await Promise.allSettled(callers.map((fn) => fn(prompt.text)));
      const responses = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => ({
          ...r.value,
          mentions:  extractMentions(r.value.responseText, brandName),
          citations: markBrandCitations(r.value.citations ?? [], brandDomain),
        }));

      run.responses   = responses;
      run.status      = "completed";
      run.completedAt = new Date();
      await run.save();
    } catch (err) {
      run.status       = "failed";
      run.errorMessage = err.message;
      run.completedAt  = new Date();
      await run.save();
    }
  }

  // Schedule next run
  const intervals = { hourly: 3600000, daily: 86400000, weekly: 604800000 };
  campaign.nextRunAt = new Date(Date.now() + (intervals[campaign.frequency] ?? 86400000));
  await campaign.save();

  // Recompute project score after the run finishes
  try {
    await calculateScoreForProject(project._id);
  } catch (err) {
    console.error("[score after campaign]", err);
  }

  console.log(`✅ Campaign ${campaignId} complete (${activePrompts.length} prompts × ${callers.length} engines)`);
}

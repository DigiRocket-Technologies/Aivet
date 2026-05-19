import { Router } from "express";
import { Campaign, PromptRun } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";
import { publishJob } from "../lib/qstash.js";

const router = Router();
router.use(requireAuth);

// GET /api/campaigns?projectId=xxx
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ success: false, message: "projectId required" });
    const campaigns = await Campaign.find({ projectId });
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/campaigns
router.post("/", async (req, res) => {
  try {
    const { projectId, name, description, frequency, prompts } = req.body;
    const nextRunAt = new Date(Date.now() + 60 * 60 * 1000); // +1h
    const campaign = await Campaign.create({ projectId, name, description, frequency, prompts, nextRunAt });
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/campaigns/:id
router.put("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/campaigns/:id
router.delete("/:id", async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/campaigns/:id/run — trigger a run (queues via QStash, or inline locally)
router.post("/:id/run", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

    // Create one pending PromptRun per active prompt
    const pendingRuns = await Promise.all(
      campaign.prompts.filter((p) => p.isActive).map((p) =>
        PromptRun.create({
          campaignId: campaign._id,
          projectId:  campaign.projectId,
          promptText: p.text,
          status:     "pending",
        })
      )
    );

    await publishJob(
      "/api/webhooks/run-campaign",
      { campaignId: campaign._id.toString() },
      {
        runLocal: async () => {
          const { runCampaign } = await import("../workers/campaignRunner.js");
          await runCampaign(campaign._id.toString());
        },
      }
    );

    res.status(202).json({ success: true, data: { queued: pendingRuns.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/campaigns/:id/runs
router.get("/:id/runs", async (req, res) => {
  try {
    const runs = await PromptRun.find({ campaignId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: runs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

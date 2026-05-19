import { Router } from "express";
import { VisibilityScore } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function getScoreBand(score) {
  if (score >= 80) return "DOMINANT";
  if (score >= 60) return "STRONG";
  if (score >= 40) return "BUILDING";
  if (score >= 20) return "WEAK";
  return "CRITICAL";
}

// GET /api/projects/:projectId/dashboard?days=30
router.get("/:projectId/dashboard", async (req, res) => {
  try {
    const { projectId } = req.params;
    const days = parseInt(req.query.days ?? "30");

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split("T")[0];

    const scores = await VisibilityScore.find({
      projectId,
      scoreDate: { $gte: sinceStr },
    }).sort({ scoreDate: 1 });

    if (!scores.length) {
      return res.json({
        success: true,
        data: { currentScore: 0, scoreBand: "CRITICAL", scoreChange: 0, totalPrompts: 0, totalMentions: 0, trend: [] },
      });
    }

    const latest = scores.at(-1);
    const first  = scores[0];
    const change = +(latest.overallScore - first.overallScore).toFixed(2);

    res.json({
      success: true,
      data: {
        currentScore:  latest.overallScore,
        scoreBand:     getScoreBand(latest.overallScore),
        scoreChange:   change,
        totalPrompts:  scores.reduce((s, x) => s + (x.totalPrompts  ?? 0), 0),
        totalMentions: scores.reduce((s, x) => s + (x.totalMentions ?? 0), 0),
        trend: scores.map((s) => ({
          scoreDate:      s.scoreDate,
          overallScore:   s.overallScore,
          mentionScore:   s.mentionScore,
          rankingScore:   s.rankingScore,
          sentimentScore: s.sentimentScore,
          citationScore:  s.citationScore,
          diversityScore: s.diversityScore,
          totalPrompts:   s.totalPrompts,
          totalMentions:  s.totalMentions,
          modelsBreakdown: s.modelsBreakdown ? Object.fromEntries(s.modelsBreakdown) : null,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:projectId/scores/latest
router.get("/:projectId/scores/latest", async (req, res) => {
  try {
    const score = await VisibilityScore.findOne({ projectId: req.params.projectId }).sort({ scoreDate: -1 });
    if (!score) return res.status(404).json({ success: false, message: "No scores yet" });
    res.json({ success: true, data: score });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

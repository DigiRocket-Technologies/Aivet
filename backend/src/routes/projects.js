import { Router } from "express";
import { Project, Team } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

async function getUserTeam(userId) {
  return Team.findOne({ "members.userId": userId });
}

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const team = await getUserTeam(req.user._id);
    if (!team) return res.status(404).json({ success: false, message: "No team found" });

    const projects = await Project.find({ teamId: team._id, isActive: true });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects
router.post("/", async (req, res) => {
  try {
    const team = await getUserTeam(req.user._id);
    if (!team) return res.status(404).json({ success: false, message: "No team found" });

    const { name, domain, brandName, industry, targetRegion } = req.body;
    const project = await Project.create({ teamId: team._id, name, domain, brandName, industry, targetRegion });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects/:id/competitors
router.post("/:id/competitors", async (req, res) => {
  try {
    const { domain, brandName } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $push: { competitors: { domain, brandName } } },
      { new: true }
    );
    res.json({ success: true, data: project.competitors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:id/competitors
router.get("/:id/competitors", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select("competitors");
    res.json({ success: true, data: project?.competitors ?? [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

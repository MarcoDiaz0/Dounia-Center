import { Router } from "express";
import {
  getChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild,
  addMilestone,
  // Programs
  enrollProgram,
  unenrollProgram,
  // Assessments
  addAssessment,
  deleteAssessment,
  // Sessions
  addSession,
  updateSessionStatus,
  deleteSession,
  // Notes
  addNote,
  deleteNote,
} from "../controllers/child.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

// ─── Children ───────────────────────────
router.get("/", getChildren);
router.post("/", createChild);
router.get("/:id", getChildById);
router.put("/:id", updateChild);
router.delete("/:id", deleteChild);

// ─── Milestones ──────────────────────────
router.post("/:id/milestones", addMilestone);

// ─── Programs ────────────────────────────
router.post("/:id/programs", enrollProgram);
router.delete("/:id/programs/:programId", unenrollProgram);

// ─── Assessments ─────────────────────────
router.post("/:id/assessments", addAssessment);
router.delete("/:id/assessments/:assessmentId", deleteAssessment);

// ─── Sessions ────────────────────────────
router.post("/:id/sessions", addSession);
router.patch("/:id/sessions/:sessionId", updateSessionStatus);
router.delete("/:id/sessions/:sessionId", deleteSession);

// ─── Notes ───────────────────────────────
router.post("/:id/notes", addNote);
router.delete("/:id/notes/:noteId", deleteNote);

export default router;

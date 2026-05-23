import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createSession,
  getMySessions,
  getAllSessions,
  respondToSession,
} from "../controllers/session.controller.js";

const router = express.Router();

// User routes (needs login)
router.post("/", protect, createSession);
router.get("/my", protect, getMySessions);

// Admin only routes
router.get("/", protect, authorize("admin"), getAllSessions);
router.put("/:id/respond", protect, authorize("admin"), respondToSession);

export default router;

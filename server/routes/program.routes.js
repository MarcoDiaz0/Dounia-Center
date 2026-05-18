import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/program.controller.js";

const router = express.Router();

router.get("/", getPrograms);

// Admin only routes
router.post("/", protect, authorize("admin"), createProgram);
router.put("/:id", protect, authorize("admin"), updateProgram);
router.delete("/:id", protect, authorize("admin"), deleteProgram);

export default router;

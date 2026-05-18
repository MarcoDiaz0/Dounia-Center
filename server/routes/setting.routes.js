import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/setting.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Retrieve settings publicly (for parents booking services)
router.get("/", getSettings);

// Admin-only updates
router.post("/", protect, authorize("admin"), updateSettings);

export default router;

import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getAllSubscriptions,
  updateSubscriptionStatus,
  getMySubscriptions,
} from "../controllers/subscription.controller.js";

const router = express.Router();

// User routes (needs login)
router.post("/", protect, createSubscription);
router.get("/my", protect, getMySubscriptions);

// Admin only routes
router.get("/", protect, authorize("admin"), getAllSubscriptions);
router.put("/:id/status", protect, authorize("admin"), updateSubscriptionStatus);

export default router;

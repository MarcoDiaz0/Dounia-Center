import { Router } from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getNotifications);
router.post("/", authorize("admin"), createNotification);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;

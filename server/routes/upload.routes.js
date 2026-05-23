import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @route   POST /api/upload/signature
 * @desc    Generate a signed Cloudinary upload payload for direct browser uploads
 * @access  Private (Admin)
 */
router.post("/signature", protect, authorize("admin"), (req, res) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary environment variables are not configured",
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "dounia_center";
    const public_id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        public_id,
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    res.status(200).json({
      success: true,
      message: "Upload signature generated successfully",
      data: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
        public_id,
        timestamp,
        signature,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate upload signature",
      error: error.message,
    });
  }
});

export default router;

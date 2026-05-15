import { Router } from 'express';
import upload from '../middleware/upload.middleware.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   POST /api/upload
 * @desc    Upload a file to Cloudinary
 * @access  Private (Admin)
 */
router.post('/', protect, authorize('admin'), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Cloudinary returns the secure_url and other metadata in req.file
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: req.file.path || req.file.secure_url,
        public_id: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

export default router;

import { Router } from 'express';
import { 
  getAssessments, 
  getAssessmentById, 
  createAssessment, 
  updateAssessment, 
  submitAssessment,
  deleteAssessment 
} from '../controllers/assessment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Get all assessments for logged-in parent
router.get('/', getAssessments);

// Create new assessment
router.post('/', createAssessment);

// Get assessment by ID
router.get('/:id', getAssessmentById);

// Update assessment (add/modify answers)
router.put('/:id', updateAssessment);

// Submit assessment for completion
router.post('/:id/submit', submitAssessment);

// Delete assessment (only draft/in-progress)
router.delete('/:id', deleteAssessment);

export default router;

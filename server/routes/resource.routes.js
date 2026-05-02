import { Router } from 'express';
import { 
  getResources, 
  getResourceById, 
  getFeaturedResources,
  getResourcesByCategory,
  createResource, 
  updateResource, 
  deleteResource,
  likeResource 
} from '../controllers/resource.controller.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getResources);
router.get('/featured', getFeaturedResources);
router.get('/category/:category', getResourcesByCategory);
router.get('/:id', getResourceById);

// Protected routes
router.post('/:id/like', optionalAuth, likeResource);

// Admin/Specialist only routes
router.post('/', protect, authorize('admin', 'specialist'), createResource);
router.put('/:id', protect, authorize('admin', 'specialist'), updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);

export default router;

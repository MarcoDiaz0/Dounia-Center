import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Get all users (admin only)
router.get('/', authorize('admin'), getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user profile
router.put('/:id', updateUser);

// Delete/deactivate user
router.delete('/:id', deleteUser);

export default router;

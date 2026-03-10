import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// New routes (without gymId)
router.post('/', protect, workoutController.addWorkout);
router.get('/', protect, workoutController.getUserWorkouts);

// Legacy routes (with gymId for compatibility)
router.post('/:gymId', protect, workoutController.addWorkout);
router.get('/:gymId', protect, workoutController.getUserWorkouts);
router.get('/:gymId/all', protect, workoutController.getGymWorkouts);

// Update and delete
router.patch('/:workoutId', protect, workoutController.updateWorkout);
router.delete('/:workoutId', protect, workoutController.deleteWorkout);

export default router;

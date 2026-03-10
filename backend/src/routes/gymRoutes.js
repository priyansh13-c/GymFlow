import express from 'express';
import * as gymController from '../controllers/gymController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Gym owner routes
router.post('/', protect, authorize('gym_owner'), gymController.createGym);
router.get('/owner/my-gym', protect, authorize('gym_owner'), gymController.getOwnerGyms);
router.get('/:gymId', protect, gymController.getGym);
router.get('/:gymId/members', protect, authorize('gym_owner'), gymController.getGymMembers);
router.get('/:gymId/stats', protect, authorize('gym_owner'), gymController.getGymStats);
router.patch('/:gymId', protect, authorize('gym_owner'), gymController.updateGym);

export default router;

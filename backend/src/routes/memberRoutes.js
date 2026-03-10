import express from 'express';
import * as memberController from '../controllers/memberController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/join-gym', protect, authorize('gym_member'), memberController.joinGym);
router.get('/membership', protect, authorize('gym_member'), memberController.getMembership);
router.get('/:gymId/all', protect, authorize('gym_owner'), memberController.getAllMembers);
router.patch('/:memberId', protect, authorize('gym_owner'), memberController.updateMembership);
router.delete('/:memberId', protect, authorize('gym_owner'), memberController.removeMember);

export default router;

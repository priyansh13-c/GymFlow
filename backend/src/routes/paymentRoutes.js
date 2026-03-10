import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:gymId/process', protect, paymentController.processPayment);
router.get('/:gymId/history', protect, authorize('gym_member'), paymentController.getPaymentHistory);
router.get('/:gymId/all', protect, authorize('gym_owner'), paymentController.getGymPayments);
router.post('/:paymentId/refund', protect, authorize('gym_owner'), paymentController.refundPayment);

export default router;

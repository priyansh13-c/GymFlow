import express from 'express';
import * as trainerController from '../controllers/trainerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// owner actions
router.post('/:gymId', protect, authorize('gym_owner'), trainerController.createTrainer);
router.patch('/update/:trainerId', protect, authorize('gym_owner'), trainerController.updateTrainer);
router.delete('/delete/:trainerId', protect, authorize('gym_owner'), trainerController.deleteTrainer);

// member booking actions
router.post('/:trainerId/book', protect, authorize('gym_member'), trainerController.bookTrainer);
router.get('/:gymId/bookings', protect, authorize('gym_member'), trainerController.getUserBookings);

// trainer-specific routes
router.get('/:trainerId/my-bookings', protect, trainerController.getTrainerBookings);
router.patch('/:bookingId/confirm', protect, trainerController.confirmBooking);
router.patch('/:bookingId/cancel', protect, trainerController.cancelBooking);

// accessible by both roles; gymId can be in params or token
router.get('/:gymId?', protect, trainerController.getTrainers);

export default router;

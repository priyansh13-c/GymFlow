import express from 'express';
import * as noticeController from '../controllers/noticeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Post notice (expects gymId in body)
router.post('/', protect, authorize('gym_owner'), noticeController.postNotice);

// Get notices (expects gymId in query or params)
router.get('/', protect, noticeController.getNotices);
router.get('/:gymId', protect, noticeController.getNotices);

// Mark as read
router.patch('/:noticeId/read', protect, noticeController.markNoticeRead);

// Update notice
router.patch('/:noticeId', protect, authorize('gym_owner'), noticeController.updateNotice);

// Delete notice
router.delete('/:noticeId', protect, authorize('gym_owner'), noticeController.deleteNotice);

export default router;

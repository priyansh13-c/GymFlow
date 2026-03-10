import express from 'express';
import * as calorieController from '../controllers/calorieController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:gymId/upload', protect, upload.single('foodImage'), calorieController.uploadFoodImage);
router.get('/:gymId', protect, calorieController.getCalorieLogs);
router.delete('/:calorieLogId', protect, calorieController.deleteCalorieLog);

export default router;

import CalorieLog from '../models/CalorieLog.js';
import { estimateCaloriesFromImage } from '../services/calorieService.js';

// Upload food image and get calorie estimation
export const uploadFoodImage = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { mealType = 'snack', quantity } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Call AI API to estimate calories
    let nutritionData;
    try {
      nutritionData = await estimateCaloriesFromImage(req.file.path);
    } catch (apiError) {
      // Fallback to manual estimation if AI API fails
      nutritionData = {
        foodName: 'Unknown Food',
        estimatedCalories: 200,
        estimatedCarbs: 30,
        estimatedProtein: 20,
        estimatedFats: 5,
      };
    }

    // Create calorie log
    const calorieLog = new CalorieLog({
      member: req.userId,
      gym: gymId,
      foodImage: req.file.path,
      foodName: nutritionData.foodName,
      estimatedCalories: nutritionData.estimatedCalories,
      estimatedCarbs: nutritionData.estimatedCarbs,
      estimatedProtein: nutritionData.estimatedProtein,
      estimatedFats: nutritionData.estimatedFats,
      quantity,
      mealType,
      apiResponse: nutritionData.apiResponse || {},
    });

    await calorieLog.save();

    res.status(201).json({
      message: 'Food image analyzed successfully',
      calorieLog,
    });
  } catch (error) {
    console.error('Upload food image error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's calorie logs
export const getCalorieLogs = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { startDate, endDate, mealType } = req.query;

    let query = {
      member: req.userId,
      gym: gymId,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (mealType) {
      query.mealType = mealType;
    }

    const logs = await CalorieLog.find(query).sort({ date: -1 });

    // Calculate daily totals
    const dailyTotals = {};
    logs.forEach((log) => {
      const date = new Date(log.date).toISOString().split('T')[0];
      if (!dailyTotals[date]) {
        dailyTotals[date] = {
          calories: 0,
          carbs: 0,
          protein: 0,
          fats: 0,
        };
      }
      dailyTotals[date].calories += log.estimatedCalories || 0;
      dailyTotals[date].carbs += log.estimatedCarbs || 0;
      dailyTotals[date].protein += log.estimatedProtein || 0;
      dailyTotals[date].fats += log.estimatedFats || 0;
    });

    res.status(200).json({
      count: logs.length,
      logs,
      dailyTotals,
    });
  } catch (error) {
    console.error('Get calorie logs error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete calorie log
export const deleteCalorieLog = async (req, res) => {
  try {
    const { calorieLogId } = req.params;

    await CalorieLog.findByIdAndDelete(calorieLogId);

    res.status(200).json({ message: 'Calorie log deleted' });
  } catch (error) {
    console.error('Delete calorie log error:', error);
    res.status(500).json({ message: error.message });
  }
};

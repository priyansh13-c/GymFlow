import axios from 'axios';

/**
 * Call Nutrient/Calorie API to estimate calories from food image
 * Using LogMeal API as example (replace with your preferred API)
 */
export const estimateCaloriesFromImage = async (imagePath) => {
  try {
    // This is a placeholder implementation
    // Replace with actual API calls based on your chosen service

    // Example using FormData for image upload
    const formData = new FormData();
    formData.append('image', imagePath);

    const response = await axios.post(
      `${process.env.NUTRIENT_API_URL}/image/recognition/v2/recognition`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NUTRIENT_API_KEY}`,
        },
      }
    );

    // Parse API response and extract calorie data
    const foodInfo = response.data.results?.[0];
    
    return {
      foodName: foodInfo?.name || 'Unknown',
      estimatedCalories: foodInfo?.calories || 0,
      estimatedCarbs: foodInfo?.carbs || 0,
      estimatedProtein: foodInfo?.protein || 0,
      estimatedFats: foodInfo?.fats || 0,
      apiResponse: response.data,
    };
  } catch (error) {
    console.error('Error calling nutrition API:', error);
    throw new Error('Failed to estimate calories from image');
  }
};

/**
 * Fallback: Estimate calories based on weights (without AI)
 */
export const estimateCaloriesBasic = (foodItems) => {
  const calorieDatabase = {
    'chicken_breast': 165,
    'rice_cooked': 130,
    'broccoli': 34,
    'banana': 89,
    'eggs': 155,
    'milk': 149,
  };

  let totalCalories = 0;
  foodItems.forEach((item) => {
    const calories = calorieDatabase[item.foodType] || 0;
    totalCalories += calories * (item.weight / 100);
  });

  return totalCalories;
};

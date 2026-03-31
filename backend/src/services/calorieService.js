import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

/**
 * Call Gemini AI API to estimate calories from food image
 */
export const estimateCaloriesFromImage = async (imagePath) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in the environment');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Read the image file and convert to base64
    const imageBytes = fs.readFileSync(imagePath);
    const base64Image = imageBytes.toString('base64');
    
    // Determine mime type from extension
    let mimeType = 'image/jpeg';
    const lowerPath = imagePath.toLowerCase();
    if (lowerPath.endsWith('.png')) mimeType = 'image/png';
    else if (lowerPath.endsWith('.webp')) mimeType = 'image/webp';
    else if (lowerPath.endsWith('.heic')) mimeType = 'image/heic';
    else if (lowerPath.endsWith('.heif')) mimeType = 'image/heif';

    const prompt = `Analyze this food image. Provide a JSON response containing: 
    - foodName (string, the name of the main dish/food)
    - estimatedCalories (number)
    - estimatedCarbs (number, in grams)
    - estimatedProtein (number, in grams)
    - estimatedFats (number, in grams)
    - aiReasoning (string, brief explanation of what you see and your calculation logic)
    - confidence (number, 0 to 100 indicating how confident you are in this estimation)
    
    Do not include any text outside the JSON block.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { 
              inlineData: {
                data: base64Image,
                mimeType
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const textResponse = response.text;
    const foodInfo = JSON.parse(textResponse);
    
    return {
      foodName: foodInfo.foodName || 'Unknown Food',
      estimatedCalories: foodInfo.estimatedCalories || 0,
      estimatedCarbs: foodInfo.estimatedCarbs || 0,
      estimatedProtein: foodInfo.estimatedProtein || 0,
      estimatedFats: foodInfo.estimatedFats || 0,
      apiResponse: foodInfo, // Includes aiReasoning and confidence to save directly to DB if needed
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to estimate calories from image via Gemini');
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

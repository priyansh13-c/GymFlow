import mongoose from 'mongoose';

const calorieLogSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    foodImage: {
      type: String,
      required: true,
    },
    foodName: String,
    estimatedCalories: Number,
    estimatedCarbs: Number,
    estimatedProtein: Number,
    estimatedFats: Number,
    quantity: String,
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    apiResponse: mongoose.Schema.Types.Mixed, // Store full API response
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

calorieLogSchema.index({ member: 1, gym: 1, date: -1 });

export default mongoose.model('CalorieLog', calorieLogSchema);

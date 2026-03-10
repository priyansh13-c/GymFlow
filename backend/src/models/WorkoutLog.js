import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [
      {
        exerciseName: String,
        sets: Number,
        reps: Number,
        weight: String, // e.g., "50kg"
        duration: Number, // in minutes
        caloriesBurned: Number,
        notes: String,
      },
    ],
    totalDurationMinutes: Number,
    totalCaloriesBurned: Number,
    notes: String,
  },
  { timestamps: true }
);

// Index for quick user and gym lookup
workoutLogSchema.index({ member: 1, gym: 1, date: -1 });

export default mongoose.model('WorkoutLog', workoutLogSchema);

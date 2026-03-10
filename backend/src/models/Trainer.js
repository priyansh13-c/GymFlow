import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // optional; owner may add trainers without separate user accounts
    },
    specialization: [String], // e.g., ['strength', 'cardio', 'yoga']
    experience: Number, // years
    qualification: String,
    hourlyRate: Number,
    bio: String,
    profileImage: String,
    availableSlots: [
      {
        day: String, // Monday, Tuesday, etc.
        startTime: String,
        endTime: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

trainerSchema.index({ gym: 1 });

export default mongoose.model('Trainer', trainerSchema);

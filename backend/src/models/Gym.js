import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gymName: {
      type: String,
      required: [true, 'Gym name is required'],
      unique: true,
    },
    description: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String,
    email: String,
    Website: String,
    logoImage: String,
    coverImage: String,
    
    // Unique gym code for members to join
    gymCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },

    // Membership pricing
    monthlyFee: {
      type: Number,
      default: 0,
    },
    annualFee: {
      type: Number,
      default: 0,
    },

    // Facilities
    facilities: [String], // e.g., ['cardio', 'weights', 'yoga', 'swimming']
    capacity: Number,
    openingTime: String,
    closingTime: String,

    // Trainer management
    totalTrainers: {
      type: Number,
      default: 0,
    },

    // Member stats
    totalMembers: {
      type: Number,
      default: 0,
    },
    activeMembers: {
      type: Number,
      default: 0,
    },

    // Revenue tracking
    totalRevenue: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Gym', gymSchema);

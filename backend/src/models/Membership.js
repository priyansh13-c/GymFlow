import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
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
    membershipType: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    renewalReminder: {
      type: Boolean,
      default: false,
    },
    renewalReminderSent: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for quick lookup by member and gym
membershipSchema.index({ member: 1, gym: 1 });

export default mongoose.model('Membership', membershipSchema);

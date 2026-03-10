import mongoose from 'mongoose';

const trainerBookingSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    startTime: String, // e.g., "10:00"
    endTime: String, // e.g., "11:00"
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    duration: Number, // in minutes
    notes: String,
  },
  { timestamps: true }
);

trainerBookingSchema.index({ member: 1, gym: 1, bookingDate: -1 });

export default mongoose.model('TrainerBooking', trainerBookingSchema);

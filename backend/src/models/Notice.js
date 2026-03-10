import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notice title is required'],
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    image: String,
    readBy: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: Date,
      },
    ],
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

noticeSchema.index({ gym: 1, createdAt: -1 });

export default mongoose.model('Notice', noticeSchema);

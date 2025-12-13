import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  village: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  endTime: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
taskSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Task', taskSchema);

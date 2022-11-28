import mongoose from 'mongoose';

const { Schema } = mongoose;
const taskScheme = new Schema({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  columnId: {
    type: String,
    required: true,
  },
  users: {
    type: [String],
    default: [],
  }
}, { versionKey: false });

export default mongoose.model('Task', taskScheme);
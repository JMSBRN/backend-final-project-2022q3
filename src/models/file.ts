import mongoose from 'mongoose';

const { Schema } = mongoose;
const fileScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  }
}, { versionKey: false });

export default mongoose.model('File', fileScheme);
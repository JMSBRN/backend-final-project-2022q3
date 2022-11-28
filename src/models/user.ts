import mongoose from 'mongoose';

const { Schema } = mongoose;
const userScheme = new Schema({
  name: {
    type: String,
    required: true,
  }, login: {
    type: String,
    required: true,
  }, password: {
    type: String,
    required: true,
  }
}, { versionKey: false });

export default mongoose.model('User', userScheme);
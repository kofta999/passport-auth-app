import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    minLength: 8,
  },
  google: {
    id: {
      type: String,
    }
  },
  github: {
    id: {
      type: String,
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;
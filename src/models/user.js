import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});

const User = mongoose.model('User', userSchema);
export default User;
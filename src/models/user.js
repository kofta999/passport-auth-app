import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  google: {
    id: {
      type: String,
    }
  },
  facebook: {
    id: {
      type: String,
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;
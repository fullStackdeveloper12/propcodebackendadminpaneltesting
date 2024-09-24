import mongoose from "mongoose";

// Create auth Schema
const authSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  password: {
    type: String,
  },
  role: {
    type:String,
  },
});

// auth
const authUser = mongoose.model("Auth", authSchema);

// Export
export default authUser;
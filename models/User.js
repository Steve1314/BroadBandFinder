import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["customer", "agent"], required: true },
  name: String,
  email: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);

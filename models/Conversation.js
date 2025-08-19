import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  lastMessageAt: Date,
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);

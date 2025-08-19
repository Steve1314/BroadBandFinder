import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", index: true },
  senderRole: { type: String, enum: ["customer", "agent"], required: true },
  text: { type: String, trim: true },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);

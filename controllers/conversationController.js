import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  const convos = await Conversation.find().sort({ updatedAt: -1 }).limit(50).lean();
  res.json(convos);
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const messages = await Message.find({ conversationId: id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(+limit)
    .lean();
  res.json(messages.reverse());
};

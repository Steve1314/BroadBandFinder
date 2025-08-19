import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

async function ensureGuestUser(name = "Guest") {
  const u = new User({ role: "customer", name });
  return u.save();
}

export default function chatSocket(socket, io) {
  socket.on("start_conversation", async ({ role, name, conversationId }) => {
    try {
      let convo;
      if (conversationId) {
        convo = await Conversation.findById(conversationId);
      } else {
        let customer = await ensureGuestUser(name || "Guest");
        convo = await Conversation.create({ customerId: customer._id, lastMessageAt: new Date() });
      }
      const room = convo._id.toString();
      socket.join(room);
      socket.emit("conversation_ready", { conversationId: room });
    } catch (e) {
      console.error(e);
      socket.emit("error_msg", "Failed to start conversation");
    }
  });

  socket.on("join_as_agent", async ({ agentName }) => {
    let agent = await User.findOne({ name: agentName, role: "agent" });
    if (!agent) agent = await User.create({ name: agentName, role: "agent" });
    socket.data.agentId = agent._id.toString();
    socket.emit("agent_ready", { agentId: socket.data.agentId });
  });

  socket.on("agent_join_conversation", async ({ conversationId }) => {
    const convo = await Conversation.findById(conversationId);
    if (!convo) return socket.emit("error_msg", "Conversation not found");
    convo.agentId = socket.data.agentId || convo.agentId;
    await convo.save();
    socket.join(conversationId);
  });

  socket.on("send_message", async ({ conversationId, text, senderRole }) => {
    if (!conversationId || !text?.trim()) return;
    const msg = await Message.create({ conversationId, text: text.trim(), senderRole });
    await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });
    io.to(conversationId).emit("new_message", {
      _id: msg._id,
      conversationId,
      text: msg.text,
      senderRole: msg.senderRole,
      sentAt: msg.sentAt
    });
  });

  socket.on("typing", ({ conversationId, senderRole, isTyping }) => {
    socket.to(conversationId).emit("typing", { senderRole, isTyping });
  });

  socket.on("mark_read", async ({ conversationId }) => {
    await Message.updateMany({ conversationId, read: false }, { $set: { read: true } });
    io.to(conversationId).emit("read_receipt", { conversationId });
  });
}

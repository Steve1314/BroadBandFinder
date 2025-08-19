import express from "express";
import { getConversations, getMessages } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", getConversations);
router.get("/:id/messages", getMessages);

export default router;

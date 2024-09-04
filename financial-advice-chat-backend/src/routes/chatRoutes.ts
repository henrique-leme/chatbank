import { Router } from "express";
import { getChatHistory, addChatMessage } from "../controllers/chatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/history", authMiddleware, getChatHistory);
router.post("/message", authMiddleware, addChatMessage);

export default router;

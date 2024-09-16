import { Router } from "express";
import {
  getChatHistory,
  getFinancialLevelQuestions,
  addChatMessageFinance,
} from "../controllers/chatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/history", authMiddleware, getChatHistory);
router.get("/questions/llama", authMiddleware, getFinancialLevelQuestions);
router.post("/message/finance", authMiddleware, addChatMessageFinance);

export default router;

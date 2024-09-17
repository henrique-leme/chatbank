import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  getAllUserProfiles,
  deleteUserProfile,
  findUserByEmail,
  evaluateFinancialLevel,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { loginUser } from "../controllers/authController";

const router = Router();

router.post("/register", createUserProfile);
router.post("/login", loginUser);
router.get("/details", authMiddleware, getUserProfile);
router.put("/details", authMiddleware, updateUserProfile);
router.get("/", authMiddleware, getAllUserProfiles);
router.post("/search", authMiddleware, findUserByEmail);
router.delete("/delete", authMiddleware, deleteUserProfile);
router.post(
  "/evaluate-finance-level/llama",
  authMiddleware,
  evaluateFinancialLevel
);

export default router;

import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isUser } from "../middleware/permission.middleware.js";
import { getUserTransaction } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/user-transaction", authMiddleware, isUser, getUserTransaction);

export default router;

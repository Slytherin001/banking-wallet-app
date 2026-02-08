import express from "express";
import { createAdmin, creditAdminBalance, getAllTransactions, getAllUsers } from "../controllers/owner.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {isOwner} from "../middleware/permission.middleware.js";
const router = express.Router();

router.post("/create-admin", authMiddleware, isOwner, createAdmin);
router.get("/all-users", authMiddleware, isOwner, getAllUsers);
router.post("/credit",authMiddleware,isOwner,creditAdminBalance)
router.get("/transaction",authMiddleware,isOwner,getAllTransactions)

export default router;

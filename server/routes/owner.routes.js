import express from "express";
import {
  addMoneyToOwner,
  createAdmin,
  creditAdminBalance,
  getAllTransactions,
  getAllUsers,
  ownerAdmin,
} from "../controllers/owner.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/permission.middleware.js";
const router = express.Router();

router.post("/create-admin", authMiddleware, isOwner, createAdmin);
router.get("/all-users", authMiddleware, isOwner, getAllUsers);
router.get("/owner-admin", authMiddleware, isOwner, ownerAdmin);
router.post("/transfer-money", authMiddleware, isOwner, creditAdminBalance);
router.get("/transaction", authMiddleware, isOwner, getAllTransactions);
router.post("/add-balance", authMiddleware, isOwner, addMoneyToOwner);

export default router;

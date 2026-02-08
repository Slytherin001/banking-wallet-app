import express from "express";
import { isAdmin } from "../middleware/permission.middleware.js";
import {
  createUserByAdmin,
  creditUserBalance,
  getAdminTransaction,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controllers/owner.controller.js";
const router = express.Router();

router.post(
  "/create-user-by-admin",
  authMiddleware,
  isAdmin,
  createUserByAdmin,
);
router.post("/credit", authMiddleware, isAdmin, creditUserBalance);
router.get("/get-my-users", authMiddleware, isAdmin, getAllUsers);
router.get("/get-admin-transaction",authMiddleware,isAdmin,getAdminTransaction)

export default router;

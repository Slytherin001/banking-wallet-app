import express from "express";
import { isAdmin } from "../middleware/permission.middleware.js";
import {
  createUserByAdmin,
  creditUserBalance,
  getAdminTransaction,
  getMyBeneficaries,
  getMyUsers,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/create-user-by-admin",
  authMiddleware,
  isAdmin,
  createUserByAdmin,
);
router.post("/credit-money", authMiddleware, isAdmin, creditUserBalance);
router.get("/get-my-users", authMiddleware, isAdmin, getMyUsers);
router.get(
  "/get-admin-transaction",
  authMiddleware,
  isAdmin,
  getAdminTransaction,
);
router.get("/get-beneficary", authMiddleware, isAdmin, getMyBeneficaries);

export default router;

import express from "express";
import { auth_login, auth_logout, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/login", auth_login);
router.get("/logout", auth_logout);
router.get("/me",authMiddleware,getMe);


export default router;

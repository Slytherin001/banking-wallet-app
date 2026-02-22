import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  bulkDeleteNotification,
  deleteNotification,
  getNotification,
  readNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();

router.get("/", authMiddleware, getNotification);
router.patch("/mark-as-read/:id", authMiddleware, readNotification);
router.delete("/bulk-delete", authMiddleware, bulkDeleteNotification);
router.delete("/:id", authMiddleware, deleteNotification);

export default router;

import { userModel as User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, resp, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return resp.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return resp.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return resp.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
    });
  }
};

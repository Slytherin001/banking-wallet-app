import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { userModel as User } from "../models/user.model.js";

const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      credentials: true,
    },
  });
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("Authentication cookie missing"));
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      if (!token) {
        return next(new Error("Token not found in cookies"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(new Error("User not found"));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    socket.join(userId);
    const freshUser = await User.findById(userId);
    socket.emit("balance-update", freshUser.balance);
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.username}`);
    });
  });

  return io;
};

export default socketConfig;

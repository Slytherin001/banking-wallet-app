import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import { connectDB } from "./config/db.js";
import socketConfig from "./utils/socket.js";

// import { createOwner } from "./scripts/create.owner.js";

//Import Routes
import authRoutes from "./routes/auth.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);

const server = http.createServer(app);
const io = socketConfig(server);

app.use((req, resp, next) => {
  req.io = io;
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/owner", ownerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/user", userRoutes);

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
  // createOwner();
});

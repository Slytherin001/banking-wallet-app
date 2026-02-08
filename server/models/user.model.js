import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "USER"],
      default: "USER",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("User", userSchema);

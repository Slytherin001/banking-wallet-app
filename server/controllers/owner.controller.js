import { userModel as User } from "../models/user.model.js";
import { transactionModel as Transaction } from "../models/transaction.model.js";
import { encryptPassword } from "../utils/hash.password.js";

export const createAdmin = async (req, resp) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return resp.status(400).json({
        success: false,
        message: "Username and Password is required",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return resp.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashPassword = await encryptPassword(password);

    const admin = await User.create({
      username,
      password: hashPassword,
      role: "ADMIN",
      parentId: req.user._id,
      balance: 0,
    });

    resp.status(200).json({
      success: true,
      message: "Admin has been created successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, resp) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    })
      .select("-password")
      .sort({ createdAt: -1 });
    resp.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllTransactions = async (req, resp) => {
  try {
    const transactions = await Transaction.find()
      .populate("fromUser", "username role")
      .populate("toUser", "username role")
      .sort({ createdAt: -1 });

    resp.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const creditAdminBalance = async (req, resp) => {
  try {
    const { adminId, amount } = req.body;

    if (!adminId || !amount || amount < 0) {
      return resp.status(400).json({
        success: false,
        message: "Admin and valid amount is required",
      });
    }

    const owner = await User.findOne(req.user._id);
    if (owner.balance < amount) {
      return resp.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const admin = await User.findOne({
      _id: adminId,
      parentId: req.user._id,
    });

    if (!admin) {
      return resp.status(400).json({
        success: false,
        message: "Amount only credited to direct admin",
      });
    }

    owner.balance -= amount;
    admin.balance += amount;

    await owner.save();
    await admin.save();

    await Transaction.create({
      fromUser: owner._id,
      toUser: admin._id,
      amount,
      type: "CREDIT",
    });

    req.io.to(owner._id.toString()).emit("balance-update", owner.balance);
    req.io.to(admin._id.toString()).emit("balance-update", admin.balance);

    resp.status(200).json({
      success: true,
      message: "Amount has been sent successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal",
    });
  }
};

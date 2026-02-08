import { encryptPassword } from "../utils/hash.password.js";
import { userModel as User } from "../models/user.model.js";
import { transactionModel as Transaction } from "../models/transaction.model.js";

export const createUserByAdmin = async (req, resp) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return resp.status(400).json({
        success: false,
        message: "Please provide username and password",
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

    const user = await User.create({
      username,
      password: hashPassword,
      role: "USER",
      parentId: req.user._id,
      balance: 0,
    });

    resp.status(200).json({
      success: true,
      message: "User has been created by Admin successfully",
      user,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMyUsers = async (req, resp) => {
  try {
    const admin = await User.findOne({ _id: req.user._id });
    if (!admin) {
      return resp.status(400).json({
        success: false,
        message: "Admin not exists",
      });
    }
    const users = await User.find({
      parentId: req.user._id,
    });

    resp.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return resp.status(5000).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const creditUserBalance = async (req, resp) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      resp.status(400).json({
        success: false,
        message: "User and Amount is required",
      });
    }

    const admin = await User.findById(req.user._id);
    if (!admin) {
      return resp.status(400).json({
        success: false,
        message: "Admin is not exists",
      });
    }

    if (admin.balance < amount) {
      return resp.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const user = await User.findOne({
      _id: userId,
      parentId: admin._id,
    });

    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "Credit only direct users",
      });
    }

    admin.balance -= amount;
    user.balance += amount;

    await admin.save();
    await user.save();

    await Transaction.create({
      fromUser: admin._id,
      toUser: user._id,
      amount,
      type: "CREDIT",
    });

    req.io.to(admin._id.toString()).emit("balance-update", admin.balance);
    req.io.to(user._id.toString()).emit("balance-update", user.balance);

    resp.status(200).json({
      success: true,
      message: "Amount has been sent successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAdminTransaction = async (req, resp) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    })
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

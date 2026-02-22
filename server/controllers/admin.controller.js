import { encryptPassword } from "../utils/hash.password.js";
import { userModel as User } from "../models/user.model.js";
import { transactionModel as Transaction } from "../models/transaction.model.js";
import { notificationModel as Notification } from "../models/notification.model.js";
import mongoose from "mongoose";

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
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // Check if admin exists
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return resp.status(400).json({
        success: false,
        message: "Admin not exists",
      });
    }

    // Count total users under this admin
    const totalUsers = await User.countDocuments({
      parentId: req.user._id,
    });

    // Fetch paginated users
    const users = await User.find({
      parentId: req.user._id,
    })
      .populate("parentId", "username role")
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    resp.status(200).json({
      success: true,
      users,
      pagination: {
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMyBeneficaries = async (req, resp) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return resp.status(400).json({
        success: false,
        message: "Admin not exists",
      });
    }

    const beneficary = await User.find({
      parentId: req.user._id,
    });

    resp.status(200).json({
      success: true,
      beneficary,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const creditUserBalance = async (req, resp) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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
      await session.abortTransaction();
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
    }).session(session);

    if (!user) {
      await session.abortTransaction();
      return resp.status(400).json({
        success: false,
        message: "Credit only direct users",
      });
    }

    await User.findByIdAndUpdate(
      admin._id,
      { $inc: { balance: -amount } },
      { session },
    );

    await User.findByIdAndUpdate(
      user._id,
      { $inc: { balance: amount } },
      { session },
    );

    await Transaction.create(
      [
        {
          fromUser: admin._id,
          toUser: user._id,
          amount,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const updatedAdmin = await User.findById(admin._id);
    const updatedUser = await User.findById(user._id);

    req.io
      .to(admin._id.toString())
      .emit("balance-update", updatedAdmin.balance);
    req.io.to(user._id.toString()).emit("balance-update", updatedUser.balance);

    const notification = await Notification.create({
      userId: user._id,
      message: `${req.user.username} sent ₹${amount} to you`,
    });

    req.io.to(user._id.toString()).emit("notifications", notification);

    resp.status(200).json({
      success: true,
      message: "Amount has been sent successfully",
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAdminTransaction = async (req, resp) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // ✅ Get total count
    const totalTransactions = await Transaction.countDocuments({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    });

    // ✅ Fetch paginated data
    const transactions = await Transaction.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    })
      .populate("fromUser", "username role")
      .populate("toUser", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTransactions = transactions.map((txn) => {
      let type = "CREDIT";

      if (txn.fromUser?._id.toString() === req.user._id.toString()) {
        type = "DEBIT";
      }

      return {
        ...txn.toObject(),
        type,
      };
    });

    resp.status(200).json({
      success: true,
      transactions: formattedTransactions,

      // ✅ Pagination metadata
      pagination: {
        totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: page,
        limit,
        hasNextPage: page < Math.ceil(totalTransactions / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

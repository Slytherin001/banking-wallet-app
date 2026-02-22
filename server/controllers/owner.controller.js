import { userModel as User } from "../models/user.model.js";
import { transactionModel as Transaction } from "../models/transaction.model.js";
import { notificationModel as Notification } from "../models/notification.model.js";
import { encryptPassword } from "../utils/hash.password.js";
import mongoose from "mongoose";

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
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({
      _id: { $ne: req.user._id },
    });

    const users = await User.find({
      _id: { $ne: req.user._id },
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

export const getAllTransactions = async (req, resp) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // ✅ Get total count
    const totalTransactions = await Transaction.countDocuments();

    // ✅ Fetch paginated data
    const transactions = await Transaction.find()
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

export const creditAdminBalance = async (req, resp) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { adminId, amount } = req.body;

    if (!adminId || !amount || amount < 0) {
      return resp.status(400).json({
        success: false,
        message: "Admin and valid amount is required",
      });
    }

    const owner = await User.findById(req.user._id);

    if (!owner) {
      await session.abortTransaction();
      return resp.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    if (owner.balance < amount) {
      await session.abortTransaction();
      return resp.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const admin = await User.findOne({
      _id: adminId,
      parentId: req.user._id,
    }).session(session);

    if (!admin) {
      await session.abortTransaction();
      return resp.status(400).json({
        success: false,
        message: "Amount only credited to direct admin",
      });
    }

    await User.findByIdAndUpdate(
      owner._id,
      { $inc: { balance: -amount } },
      { session },
    );

    await User.findByIdAndUpdate(
      admin._id,
      { $inc: { balance: amount } },
      { session },
    );

    await Transaction.create(
      [
        {
          fromUser: owner._id,
          toUser: admin._id,
          amount,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const updatedOwner = await User.findById(owner._id);
    const updatedAdmin = await User.findById(admin._id);

    req.io
      .to(owner._id.toString())
      .emit("balance-update", updatedOwner.balance);
    req.io
      .to(admin._id.toString())
      .emit("balance-update", updatedAdmin.balance);

    const notification = await Notification.create({
      userId: admin._id,
      message: `${req.user.username} sent ₹${amount} to you`,
    });

    req.io.to(admin._id.toString()).emit("notifications", notification);

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
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const ownerAdmin = async (req, resp) => {
  try {
    const owner = await User.findOne({ _id: req.user._id });
    if (!owner) {
      return resp.status(400).json({
        success: false,
        message: "Owner doesn't exists",
      });
    }

    const admin = await User.find({
      parentId: req.user._id,
    });

    resp.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addMoneyToOwner = async (req, resp) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount } = req.body;

    const owner = await User.findById(req.user._id);
    if (!owner) {
      await session.abortTransaction();
      return resp.status(400).json({
        success: false,
        message: "Owner doesn't exists",
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { balance: amount },
      },
      { new: true },
    );

    await Transaction.create(
      [
        {
          fromUser: null,
          toUser: owner._id,
          amount,
          type: "CREDIT",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const updatedOwner = await User.findById(owner._id);

    req.io
      .to(owner._id.toString())
      .emit("balance-update", updatedOwner.balance);

    const notification = await Notification.create({
      userId: owner._id,
      message: `Top up of ₹${amount} has been added to your account`,
    });

    req.io.to(owner._id.toString()).emit("notifications", notification);

    resp.status(200).json({
      success: true,
      message: "Balance has been added successfully",
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    return resp.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

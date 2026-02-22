import {transactionModel as Transaction} from "../models/transaction.model.js"

export const getUserTransaction = async (req, resp) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const totalTransactions = await Transaction.countDocuments({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    });

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

import { notificationModel as Notification } from "../models/notification.model.js";

export const getNotification = async (req, resp) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    resp.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const readNotification = async (req, resp) => {
  try {
    const { id } = req.params;

    if (!id) {
      return resp.status(400).json({
        success: false,
        message: "Please provide id",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );

    resp.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, resp) => {
  try {
    const { id } = req.params;
    if (!id) {
      return resp.status(400).json({
        success: false,
        message: "Please provide id",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return resp.status(404).json({
        success: false,
        message: "Notification is not found",
      });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return resp.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    await Notification.findByIdAndDelete(id);

    resp.status(200).json({
      success: true,
      messsage: "Notification deleted successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const bulkDeleteNotification = async (req, resp) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return resp.status(400).json({
        success: false,
        message: "Please provide valid ids",
      });
    }

    await Notification.deleteMany({
      _id: { $in: ids },
      userId: req.user._id.toString(),
    });

    return resp.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

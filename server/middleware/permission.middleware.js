export const isOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        message: "Access denied. OWNER role required.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const isAdmin = (req, resp, next) => {
  try {
    if (!req.user) {
      return resp.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "ADMIN") {
      return resp.status(403).json({
        message: "Access denied. ADMIN role required.",
      });
    }

    next();
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

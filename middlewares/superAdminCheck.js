const ApiError = require("../utils/ApiError");

module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "superadmin") {
      next(new ApiError("Forbidden!, you're not superadmin", 403));
    }
    next();
  } catch (err) {
    next(new ApiError(err.message, 500));
    return;
  }
};

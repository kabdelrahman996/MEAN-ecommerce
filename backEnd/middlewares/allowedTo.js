const appError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      return next(appError.create("User not authenticated", 401));
    }

    const userRole = req.currentUser.isAdmin ? "admin" : "user";

    if (!roles.includes(userRole)) {
      return next(appError.create("This role is not authorized", 403));
    }

    next();
  };
};

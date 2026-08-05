import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not authorized to access this resource"
      );
    }

    next();
  };
};
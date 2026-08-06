import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changeCurrentPassword,
  forgotPasswordRequest,
  resetForgotPassword,
  verifyEmail,
  resendEmailVerification,
  googleLogin
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password/:resetToken", resetForgotPassword);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post(
  "/resend-verification-email",
  resendEmailVerification
);
router.post("/google", googleLogin);

// Protected Routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);


export default router;
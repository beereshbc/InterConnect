import express from "express";
import {
  registerStudent,
  loginStudent,
  sendResetOtp,
  resetPassword,
} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);
// Add the new routes:
studentRouter.post("/forgot-password/send-otp", sendResetOtp);
studentRouter.post("/forgot-password/reset", resetPassword);

export default studentRouter;

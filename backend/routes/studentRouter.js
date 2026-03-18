import express from "express";
import {
  registerStudent,
  loginStudent,
  sendResetOtp,
  resetPassword,
  getPublishedProblems,
  createProblem,
  joinProblem,
} from "../controllers/studentController.js";
import studentAuth from "../middlewares/studentAuth.js";

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);
// Add the new routes:
studentRouter.post("/forgot-password/send-otp", sendResetOtp);
studentRouter.post("/forgot-password/reset", resetPassword);
studentRouter.get("/published", getPublishedProblems);

// --- Protected Routes (Requires Student Login) ---
studentRouter.post("/create", studentAuth, createProblem);
studentRouter.post("/:id/join", studentAuth, joinProblem);
export default studentRouter;

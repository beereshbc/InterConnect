import express from "express";
import {
  registerStudent,
  loginStudent,
  sendResetOtp,
  resetPassword,
  getStudentProfile,
  updateStudentProfile,
  getPublishedProblems,
  createProblem,
  joinProblem,
  getMyProjects,
  getMyLogs,
  selfAssignLog,
  getLeaderboard,
  getStudentDashboard,
  getPublishedNotifications,
} from "../controllers/studentController.js";
import studentAuth from "../middlewares/studentAuth.js";

const studentRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
studentRouter.post("/register", registerStudent);
studentRouter.post("/login", loginStudent);
studentRouter.post("/forgot-password/send-otp", sendResetOtp);
studentRouter.post("/forgot-password/reset", resetPassword);

// Published problems — canonical + legacy alias
studentRouter.get("/problems/published", getPublishedProblems);
studentRouter.get("/published", getPublishedProblems); // legacy

// ─── Protected ────────────────────────────────────────────────────────────────
studentRouter.get("/profile", studentAuth, getStudentProfile);
studentRouter.put("/profile", studentAuth, updateStudentProfile);

studentRouter.get("/dashboard", studentAuth, getStudentDashboard);

// Problems (authenticated)
studentRouter.post("/problems/create", studentAuth, createProblem);
studentRouter.post("/create", studentAuth, createProblem); // legacy
studentRouter.post("/problems/:id/join", studentAuth, joinProblem);
studentRouter.post("/:id/join", studentAuth, joinProblem); // legacy

// Projects
studentRouter.get("/projects", studentAuth, getMyProjects);

// Logs (The Route for Claiming the Task)
studentRouter.get("/logs", studentAuth, getMyLogs);
studentRouter.patch("/logs/:logId/self-assign", studentAuth, selfAssignLog);

// Leaderboard
studentRouter.get("/leaderboard", studentAuth, getLeaderboard);
studentRouter.get("/notifications", getPublishedNotifications);
export default studentRouter;

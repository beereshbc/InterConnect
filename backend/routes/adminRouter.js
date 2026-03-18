import express from "express";
import {
  // Auth
  registerAdmin,
  loginAdmin,
  sendOtp,
  resetPassword,
  getAdminProfile,
  // Projects
  getAssignedProjects,
  getProjectById,
  updateProject,
  toggleProjectBlock,
  // Logs
  createLog,
  closeLog,
  // Students (admin view)
  getStudentDetail,
  // ── Super Admin ──────────────────────────────────────
  saLogin,
  getSADashboard,
  saGetAllProblems,
  saApproveProblem,
  saRejectProblem,
  saAssignCoordinator,
  saGetAllAdmins,
  saToggleBlockAdmin,
  saDeleteAdmin,
  saGetAllStudents,
  saToggleBlockStudent,
  saGetStudentDetail,
} from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";
const adminRouter = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────────────────────────────────────
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/forgot-password/send-otp", sendOtp);
adminRouter.post("/forgot-password/reset", resetPassword);

// ─── Super Admin login (public, no token needed) ─────────────────────────────
adminRouter.post("/sa/login", saLogin);

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED — regular admin
// ─────────────────────────────────────────────────────────────────────────────
adminRouter.use("/profile", adminAuth);
adminRouter.use("/projects", adminAuth);
adminRouter.use("/logs", adminAuth);

adminRouter.get("/profile", getAdminProfile);

// Projects
adminRouter.get("/projects", getAssignedProjects);
adminRouter.get("/projects/:projectId", getProjectById);
adminRouter.put("/projects/:projectId", updateProject);
adminRouter.patch("/projects/:projectId/toggle-block", toggleProjectBlock);

// Logs
adminRouter.post("/projects/:projectId/logs", createLog);
adminRouter.put("/logs/:logId/close", closeLog);

// Student detail inside a project
adminRouter.get(
  "/projects/:projectId/students/:studentId",
  adminAuth,
  getStudentDetail,
);

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED — super admin   (all /sa/* except /sa/login)
// ─────────────────────────────────────────────────────────────────────────────
adminRouter.use("/sa", superAdminAuth);

// Dashboard
adminRouter.get("/sa/dashboard", getSADashboard);

// Problem Management
adminRouter.get("/sa/problems", saGetAllProblems);
adminRouter.put("/sa/problems/:problemId/approve", saApproveProblem);
adminRouter.put("/sa/problems/:problemId/reject", saRejectProblem);
adminRouter.patch(
  "/sa/problems/:problemId/assign-coordinator",
  saAssignCoordinator,
);

// Admin Management
adminRouter.get("/sa/admins", saGetAllAdmins);
adminRouter.patch("/sa/admins/:adminId/toggle-block", saToggleBlockAdmin);
adminRouter.delete("/sa/admins/:adminId", saDeleteAdmin);

// Student Management
adminRouter.get("/sa/students", saGetAllStudents);
adminRouter.get("/sa/students/:studentId", saGetStudentDetail);
adminRouter.patch("/sa/students/:studentId/toggle-block", saToggleBlockStudent);

export default adminRouter;

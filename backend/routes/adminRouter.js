import express from "express";
import {
  registerAdmin,
  loginAdmin,
  sendOtp,
  resetPassword,
  getAdminProfile,
  getAssignedProjects,
  getProjectById,
  updateProject,
  toggleProjectBlock,
  createLog,
  togglePublishLog,
  updateLog,
  closeLog,
  terminateLog,
  reopenLog,
  checkAndTerminateExpiredLogs,
  getOpenLogs,
  selfAssignLog,
  getStudentDetail,
  saLogin,
  getSADashboard,
  saGetAllProblems,
  saApproveProblem,
  saRejectProblem,
  saAssignCoordinator,
  saReassignCoordinator, // <-- ADDED THIS IMPORT
  saGetAllAdmins,
  saToggleBlockAdmin,
  saDeleteAdmin,
  saGetAllStudents,
  saToggleBlockStudent,
  saGetStudentDetail,
  saCreateNotification,
  saGetNotifications,
  saTogglePublishNotification,
  saTogglePinNotification,
  saDeleteNotification,
} from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js";
import superAdminAuth from "../middlewares/superAdminAuth.js";

const adminRouter = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/forgot-password/send-otp", sendOtp);
adminRouter.post("/forgot-password/reset", resetPassword);
adminRouter.post("/sa/login", saLogin);

// ─── Admin auth required ──────────────────────────────────────────────────────
adminRouter.get("/profile", adminAuth, getAdminProfile);

// Projects
adminRouter.get("/projects", adminAuth, getAssignedProjects);
adminRouter.get("/projects/:projectId", adminAuth, getProjectById);
adminRouter.put("/projects/:projectId", adminAuth, updateProject);
adminRouter.patch(
  "/projects/:projectId/toggle-block",
  adminAuth,
  toggleProjectBlock,
);

// Logs — lifecycle
adminRouter.post("/projects/:projectId/logs", adminAuth, createLog);
adminRouter.patch(
  "/projects/:projectId/logs/:logId/publish",
  adminAuth,
  togglePublishLog,
);
adminRouter.patch("/logs/:logId/update", adminAuth, updateLog);
adminRouter.put("/logs/:logId/close", adminAuth, closeLog);
adminRouter.patch("/logs/:logId/terminate", adminAuth, terminateLog);
adminRouter.patch("/logs/:logId/reopen", adminAuth, reopenLog);
// ⚠ IMPORTANT: /logs/check-deadlines MUST come before /logs/:logId/... routes
adminRouter.patch(
  "/logs/check-deadlines",
  adminAuth,
  checkAndTerminateExpiredLogs,
);

// Contributor-facing (no adminAuth — called from student panel too)
adminRouter.get("/projects/:projectId/open-logs", getOpenLogs);
adminRouter.patch("/logs/:logId/self-assign", selfAssignLog);

// Student detail inside project
adminRouter.get(
  "/projects/:projectId/students/:studentId",
  adminAuth,
  getStudentDetail,
);

// ─── Super Admin ──────────────────────────────────────────────────────────────
adminRouter.get("/sa/dashboard", superAdminAuth, getSADashboard);

adminRouter.get("/sa/problems", superAdminAuth, saGetAllProblems);
adminRouter.put(
  "/sa/problems/:problemId/approve",
  superAdminAuth,
  saApproveProblem,
);
adminRouter.put(
  "/sa/problems/:problemId/reject",
  superAdminAuth,
  saRejectProblem,
);
adminRouter.patch(
  "/sa/problems/:problemId/assign-coordinator",
  superAdminAuth,
  saAssignCoordinator,
);

// Create a new notification (and broadcast if published)
adminRouter.post("/sa/notifications", superAdminAuth, saCreateNotification);
adminRouter.get("/sa/notifications", superAdminAuth, saGetNotifications);
adminRouter.patch(
  "/sa/notifications/:id/publish",
  superAdminAuth,
  saTogglePublishNotification,
);
adminRouter.patch(
  "/sa/notifications/:id/pin",
  superAdminAuth,
  saTogglePinNotification,
);
adminRouter.delete(
  "/sa/notifications/:id",
  superAdminAuth,
  saDeleteNotification,
);

adminRouter.get("/sa/admins", superAdminAuth, saGetAllAdmins);
adminRouter.patch(
  "/sa/admins/:adminId/toggle-block",
  superAdminAuth,
  saToggleBlockAdmin,
);
adminRouter.delete("/sa/admins/:adminId", superAdminAuth, saDeleteAdmin);

adminRouter.get("/sa/students", superAdminAuth, saGetAllStudents);
adminRouter.get("/sa/students/:studentId", superAdminAuth, saGetStudentDetail);
adminRouter.patch(
  "/sa/students/:studentId/toggle-block",
  superAdminAuth,
  saToggleBlockStudent,
);

// ─── NEW: CORRECTED REASSIGN ROUTE ──────────────────────────────────────────
adminRouter.put(
  "/sa/problems/:problemId/reassign-coordinator",
  superAdminAuth,
  saReassignCoordinator, // <-- FIXED: Was saAssignCoordinator before
);

export default adminRouter;

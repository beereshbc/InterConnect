import Project from "../models/Project.js";
import Problem from "../models/Problem.js";
import Student from "../models/Student.js";
import Logs from "../models/Logs.js";
import Admin from "../models/Admin.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const generateSAToken = (id) =>
  jwt.sign({ id, role: "superadmin" }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"InteConnect Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[EMAIL ERROR]", err.message);
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN AUTH
// ═════════════════════════════════════════════════════════════════════════════

export const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      branch,
      program,
      githubLink,
      password,
    } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists.",
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({
      name,
      email,
      phone,
      college,
      branch,
      program,
      githubLink,
      password: hashedPassword,
    });
    await admin.save();
    const token = generateToken(admin._id);
    res.status(201).json({
      success: true,
      message: "Admin Profile initialized! Welcome to the network.",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin account not found." });
    if (admin.isBlocked)
      return res.status(403).json({
        success: false,
        message: "This admin account has been blocked.",
      });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    const token = generateToken(admin._id);
    res.status(200).json({
      success: true,
      message: "Admin Authorization Granted!",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "No admin found with this email." });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordOtp = otp;
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await admin.save();
    console.log(`[DEV] OTP for ${email} → ${otp}`);
    res.status(200).json({
      success: true,
      message: "An override OTP has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    if (admin.resetPasswordOtp !== otp)
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP sequence." });
    if (admin.resetPasswordExpires < Date.now())
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    res.status(200).json({
      success: true,
      message: "Authorization sequence updated successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN PROJECTS
// ═════════════════════════════════════════════════════════════════════════════

export const getAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ coordinators: req.adminId })
      .populate({
        path: "problem",
        select:
          "problemID title category description theme tags ownerName organization department contactInfo problem_coordinator is_published",
      })
      .populate({
        path: "contributors",
        select:
          "name email phone department program branch college githubLink isBlocked projectWiseContribution",
      })
      .populate({
        path: "logs",
        select:
          "taskTitle description problemId githubIssueLink assignedTaskPoints contributorID task_coordinator_id task_contributor task_status isPublished createdAt updatedAt",
      })
      .populate({ path: "topContributors", select: "name email department" })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      coordinators: req.adminId,
    })
      .populate({
        path: "problem",
        select:
          "problemID title category description theme tags ownerName organization department contactInfo problem_coordinator is_published",
      })
      .populate({
        path: "contributors",
        select:
          "name email phone department program branch college githubLink isBlocked projectWiseContribution",
      })
      .populate({
        path: "logs",
        select:
          "taskTitle description problemId githubIssueLink assignedTaskPoints contributorID task_coordinator_id task_contributor task_status isPublished createdAt updatedAt",
      });
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied.",
      });
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      coordinators: req.adminId,
    });
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied.",
      });
    const {
      projectDescription,
      githubRepoLink,
      liveHostedLink,
      projectProgressRate,
      is_blocked,
      title,
      category,
      theme,
      description,
      ownerName,
      organization,
      department,
      contactInfo,
      problem_coordinator,
    } = req.body;
    if (projectDescription !== undefined)
      project.projectDescription = projectDescription;
    if (githubRepoLink !== undefined) project.githubRepoLink = githubRepoLink;
    if (liveHostedLink !== undefined) project.liveHostedLink = liveHostedLink;
    if (projectProgressRate !== undefined)
      project.projectProgressRate = Math.min(
        100,
        Math.max(0, Number(projectProgressRate)),
      );
    if (is_blocked !== undefined) project.is_blocked = Boolean(is_blocked);
    await project.save();
    const problemUpdates = {};
    if (title !== undefined) problemUpdates.title = title;
    if (category !== undefined) problemUpdates.category = category;
    if (theme !== undefined) problemUpdates.theme = theme;
    if (description !== undefined) problemUpdates.description = description;
    if (ownerName !== undefined) problemUpdates.ownerName = ownerName;
    if (organization !== undefined) problemUpdates.organization = organization;
    if (department !== undefined) problemUpdates.department = department;
    if (contactInfo !== undefined) problemUpdates.contactInfo = contactInfo;
    if (problem_coordinator !== undefined)
      problemUpdates.problem_coordinator = problem_coordinator;
    if (Object.keys(problemUpdates).length > 0)
      await Problem.findByIdAndUpdate(
        project.problem,
        { $set: problemUpdates },
        { new: true, runValidators: true },
      );
    const updatedProject = await Project.findById(project._id)
      .populate("problem")
      .populate({
        path: "contributors",
        select:
          "name email phone department program branch college githubLink isBlocked projectWiseContribution",
      })
      .populate("logs")
      .populate({ path: "topContributors", select: "name email department" });
    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProjectBlock = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      coordinators: req.adminId,
    });
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied.",
      });
    project.is_blocked = !project.is_blocked;
    await project.save();
    res.status(200).json({
      success: true,
      message: `Project ${project.is_blocked ? "blocked" : "unblocked"} successfully.`,
      is_blocked: project.is_blocked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN LOGS
// ═════════════════════════════════════════════════════════════════════════════

export const createLog = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      coordinators: req.adminId,
    });
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied.",
      });
    const {
      taskTitle,
      description,
      githubIssueLink,
      assignedTaskPoints,
      contributorID,
      task_contributor,
    } = req.body;
    const contributorExists = project.contributors.some(
      (id) => id.toString() === contributorID,
    );
    if (!contributorExists)
      return res.status(400).json({
        success: false,
        message: "Contributor is not assigned to this project.",
      });
    const newLog = await Logs.create({
      taskTitle,
      description,
      problemId: project.problem,
      githubIssueLink,
      assignedTaskPoints: Number(assignedTaskPoints) || 0,
      contributorID,
      task_coordinator_id: req.adminId,
      task_contributor,
      task_status: "pending",
      isPublished: false,
    });
    project.logs.push(newLog._id);
    await project.save();
    await Student.findByIdAndUpdate(contributorID, {
      $push: { logs: newLog._id },
    });
    res.status(201).json({
      success: true,
      message: "Task log opened successfully.",
      log: newLog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const closeLog = async (req, res) => {
  try {
    const log = await Logs.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });
    const project = await Project.findOne({
      logs: req.params.logId,
      coordinators: req.adminId,
    });
    if (!project)
      return res.status(403).json({
        success: false,
        message: "You are not authorized to close this log.",
      });
    if (log.task_status === "completed")
      return res.status(400).json({
        success: false,
        message: "This log is already marked as completed.",
      });
    const { githubPrLink, contributionScore, note } = req.body;
    log.task_status = "completed";
    log.isPublished = true;
    if (githubPrLink) log.githubIssueLink = githubPrLink;
    if (note) {
      log.actions = log.actions || [];
      log.actions.push({ actionType: "closed", note });
    }
    await log.save();
    const awardedPoints = Number(contributionScore) || log.assignedTaskPoints;
    await Student.findOneAndUpdate(
      {
        _id: log.contributorID,
        "projectWiseContribution.project": project._id,
      },
      {
        $inc: { "projectWiseContribution.$.contributionScore": awardedPoints },
      },
    );
    await Problem.findByIdAndUpdate(project.problem, {
      $push: {
        actions: {
          actionType: "log_closed",
          note: `Log "${log.taskTitle}" closed. ${awardedPoints} pts to ${log.task_contributor}.`,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: `Log closed. ${awardedPoints} points awarded to ${log.task_contributor}.`,
      log,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentDetail = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      coordinators: req.adminId,
      contributors: req.params.studentId,
    });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project or student not found." });
    const student = await Student.findById(req.params.studentId).select(
      "-password -resetPasswordOtp -resetPasswordExpires",
    );
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    const studentLogs = await Logs.find({
      contributorID: req.params.studentId,
      problemId: project.problem,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, student, logs: studentLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN — AUTH
// ═════════════════════════════════════════════════════════════════════════════

// @route  POST /api/admin/sa/login  (public)
export const saLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!process.env.SA_MAIL || !process.env.SA_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Super Admin credentials not configured.",
      });
    }
    if (email !== process.env.SA_MAIL || password !== process.env.SA_PASSWORD) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Super Admin credentials." });
    }
    const saId = Buffer.from(process.env.SA_MAIL).toString("base64");
    const token = generateSAToken(saId);
    res.status(200).json({
      success: true,
      message: "Super Admin access granted.",
      token,
      superAdmin: {
        id: saId,
        email: process.env.SA_MAIL,
        role: "superadmin",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN — DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

// @route  GET /api/admin/sa/dashboard
export const getSADashboard = async (req, res) => {
  try {
    const [
      totalAdmins,
      blockedAdmins,
      totalStudents,
      blockedStudents,
      totalProblems,
      publishedProblems,
      totalProjects,
      blockedProjects,
      totalLogs,
      completedLogs,
    ] = await Promise.all([
      Admin.countDocuments(),
      Admin.countDocuments({ isBlocked: true }),
      Student.countDocuments(),
      Student.countDocuments({ isBlocked: true }),
      Problem.countDocuments(),
      Problem.countDocuments({ is_published: true }),
      Project.countDocuments(),
      Project.countDocuments({ is_blocked: true }),
      Logs.countDocuments(),
      Logs.countDocuments({ task_status: "completed" }),
    ]);
    const recentProblems = await Problem.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "problemID title category theme is_published ownerName organization createdAt",
      );
    const topStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email department college projectWiseContribution");
    res.status(200).json({
      success: true,
      stats: {
        admins: {
          total: totalAdmins,
          blocked: blockedAdmins,
          active: totalAdmins - blockedAdmins,
        },
        students: {
          total: totalStudents,
          blocked: blockedStudents,
          active: totalStudents - blockedStudents,
        },
        problems: {
          total: totalProblems,
          published: publishedProblems,
          pending: totalProblems - publishedProblems,
        },
        projects: {
          total: totalProjects,
          blocked: blockedProjects,
          active: totalProjects - blockedProjects,
        },
        logs: {
          total: totalLogs,
          completed: completedLogs,
          pending: totalLogs - completedLogs,
        },
      },
      recentProblems,
      topStudents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN — PROBLEM MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

// @route  GET /api/admin/sa/problems
export const saGetAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }).lean();
    const problemIds = problems.map((p) => p._id);
    const projects = await Project.find({ problem: { $in: problemIds } })
      .populate({ path: "coordinators", select: "name email" })
      .select("problem coordinators projectID is_blocked createdAt");
    const projectMap = {};
    projects.forEach((proj) => {
      projectMap[proj.problem.toString()] = proj;
    });
    const enriched = problems.map((p) => ({
      ...p,
      project: projectMap[p._id.toString()] || null,
    }));
    res
      .status(200)
      .json({ success: true, count: enriched.length, problems: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/admin/sa/problems/:problemId/approve
// Body: { coordinatorId, githubRepoLink, projectDescription }
export const saApproveProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem)
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    const { coordinatorId, githubRepoLink, projectDescription } = req.body;
    if (!coordinatorId)
      return res.status(400).json({
        success: false,
        message: "Please assign a coordinator admin.",
      });
    const coordinator = await Admin.findById(coordinatorId);
    if (!coordinator)
      return res
        .status(404)
        .json({ success: false, message: "Coordinator admin not found." });
    const existingProject = await Project.findOne({ problem: problem._id });
    if (existingProject)
      return res.status(400).json({
        success: false,
        message: "A project for this problem already exists.",
      });

    problem.is_published = true;
    problem.actions.push({
      actionType: "approved",
      note: `Approved by Super Admin. Coordinator: ${coordinator.name}`,
    });
    await problem.save();

    const newProject = await Project.create({
      problem: problem._id,
      coordinators: [coordinatorId],
      contributors: [],
      logs: [],
      githubRepoLink: githubRepoLink || "https://github.com/placeholder",
      projectDescription: projectDescription || problem.description,
      projectProgressRate: 0,
      is_blocked: false,
    });
    await Admin.findByIdAndUpdate(coordinatorId, {
      $push: { managedProjects: newProject._id },
    });

    await sendEmail({
      to: problem.contactInfo,
      subject: `✅ Problem Statement Approved — InteConnect 26.0`,
      html: `<div style="font-family:monospace;background:#080c14;color:#f0f4ff;padding:32px;border-radius:12px;max-width:600px"><h2 style="color:#4ade80">Problem Approved ✓</h2><p style="color:#8892a4">Your problem statement has been approved.</p><div style="background:#0c0f18;border:1px solid #1e2330;border-radius:8px;padding:16px;margin:16px 0"><div style="font-size:11px;color:#6b7a99;text-transform:uppercase">Problem</div><div style="font-size:16px;font-weight:700;color:#f0f4ff;margin-top:4px">${problem.title}</div></div><div style="background:#1a3a2a;border:1px solid #4ade8030;border-radius:8px;padding:16px;margin-bottom:16px"><div style="font-size:11px;color:#4ade80;text-transform:uppercase">Assigned Coordinator</div><div style="color:#f0f4ff;margin-top:4px">${coordinator.name} — ${coordinator.email}</div></div><p style="font-size:11px;color:#4a5568">Project ID: ${newProject.projectID}</p><hr style="border-color:#1e2330;margin:20px 0"><p style="font-size:10px;color:#4a5568">© InteConnect 26.0 · GMIT</p></div>`,
    });

    res.status(201).json({
      success: true,
      message: `Problem approved. Project ${newProject.projectID} initiated.`,
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/admin/sa/problems/:problemId/reject
// Body: { reason }
export const saRejectProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem)
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    const { reason } = req.body;
    problem.is_published = false;
    problem.actions.push({
      actionType: "rejected",
      note: reason || "Rejected by Super Admin.",
    });
    await problem.save();

    await sendEmail({
      to: problem.contactInfo,
      subject: `❌ Problem Statement Update — InteConnect 26.0`,
      html: `<div style="font-family:monospace;background:#080c14;color:#f0f4ff;padding:32px;border-radius:12px;max-width:600px"><h2 style="color:#f87171">Problem Not Selected</h2><p style="color:#8892a4">Your problem statement was reviewed but could not be approved.</p><div style="background:#0c0f18;border:1px solid #1e2330;border-radius:8px;padding:16px;margin:16px 0"><div style="font-size:11px;color:#6b7a99;text-transform:uppercase">Problem</div><div style="font-size:16px;font-weight:700;color:#f0f4ff;margin-top:4px">${problem.title}</div></div>${reason ? `<div style="background:#3a1a1a;border:1px solid #f8717130;border-radius:8px;padding:16px;margin-bottom:16px"><div style="font-size:11px;color:#f87171;text-transform:uppercase">Reason</div><div style="color:#c4cedf;margin-top:4px">${reason}</div></div>` : ""}<hr style="border-color:#1e2330;margin:20px 0"><p style="font-size:10px;color:#4a5568">© InteConnect 26.0 · GMIT</p></div>`,
    });

    res
      .status(200)
      .json({ success: true, message: "Problem rejected and owner notified." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PATCH /api/admin/sa/problems/:problemId/assign-coordinator
export const saAssignCoordinator = async (req, res) => {
  try {
    const { coordinatorId } = req.body;
    const coordinator = await Admin.findById(coordinatorId);
    if (!coordinator)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    const project = await Project.findOne({ problem: req.params.problemId });
    if (!project)
      return res.status(404).json({
        success: false,
        message: "No project initiated for this problem yet.",
      });
    if (!project.coordinators.map(String).includes(coordinatorId)) {
      project.coordinators.push(coordinatorId);
      await project.save();
      await Admin.findByIdAndUpdate(coordinatorId, {
        $addToSet: { managedProjects: project._id },
      });
    }
    res.status(200).json({
      success: true,
      message: `${coordinator.name} assigned as coordinator.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN — ADMIN MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

// @route  GET /api/admin/sa/admins
export const saGetAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: admins.length, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PATCH /api/admin/sa/admins/:adminId/toggle-block
export const saToggleBlockAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    admin.isBlocked = !admin.isBlocked;
    await admin.save();
    res.status(200).json({
      success: true,
      message: `Admin ${admin.isBlocked ? "blocked" : "unblocked"}.`,
      isBlocked: admin.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/admin/sa/admins/:adminId
export const saDeleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.adminId);
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    res.status(200).json({ success: true, message: "Admin account removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN — STUDENT MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

// @route  GET /api/admin/sa/students
export const saGetAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .populate({
        path: "projects",
        select: "projectID problem projectProgressRate",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PATCH /api/admin/sa/students/:studentId/toggle-block
export const saToggleBlockStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    student.isBlocked = !student.isBlocked;
    await student.save();
    res.status(200).json({
      success: true,
      message: `Student ${student.isBlocked ? "blocked" : "unblocked"}.`,
      isBlocked: student.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/admin/sa/students/:studentId
export const saGetStudentDetail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .populate({
        path: "projects",
        select: "projectID problem projectProgressRate",
      })
      .populate({
        path: "logs",
        select: "taskTitle task_status assignedTaskPoints createdAt",
        options: { sort: { createdAt: -1 }, limit: 20 },
      });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

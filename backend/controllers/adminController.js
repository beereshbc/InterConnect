import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Project from "../models/Project.js";
import Problem from "../models/Problem.js";
import Log from "../models/Logs.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Notification from "../models/Notification.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const genSAToken = () =>
  jwt.sign({ role: "superadmin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await mailer.sendMail({
      from: `"InteConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error("[EMAIL]", e.message);
  }
};

/**
 * syncProjectStats — recalculates project-level counters from real log data.
 * Called after EVERY log status change so numbers are always accurate.
 */
const syncProjectStats = async (projectId) => {
  const project = await Project.findById(projectId).select("logs");
  if (!project) return;
  const logs = await Log.find({ _id: { $in: project.logs } }).select(
    "task_status assignedTaskPoints",
  );
  const total = logs.length;
  const completed = logs.filter((l) => l.task_status === "completed").length;
  const pts = logs
    .filter((l) => l.task_status === "completed")
    .reduce((a, l) => a + (l.assignedTaskPoints || 0), 0);
  await Project.findByIdAndUpdate(projectId, {
    projectProgressRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalTasksCreated: total,
    totalTasksCompleted: completed,
    totalPointsDistributed: pts,
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN AUTH
// ═══════════════════════════════════════════════════════════════════════════════

export const registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      college,
      program,
      branch,
      githubLink,
    } = req.body;
    if (await Admin.findOne({ email }))
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    const admin = await Admin.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      college,
      program,
      branch,
      githubLink,
    });
    res.status(201).json({
      success: true,
      message: "Admin registered.",
      token: genToken(admin._id),
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    if (admin.isBlocked)
      return res
        .status(403)
        .json({ success: false, message: "Account blocked." });
    if (!(await bcrypt.compare(password, admin.password)))
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    res.json({
      success: true,
      message: "Login successful.",
      token: genToken(admin._id),
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordOtp = await bcrypt.hash(otp, 10);
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await admin.save();
    console.log(`[DEV OTP] ${admin.email} → ${otp}`);
    res.json({ success: true, message: "OTP sent." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ success: false, message: "Not found." });
    if (admin.resetPasswordExpires < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired." });
    if (!(await bcrypt.compare(otp, admin.resetPasswordOtp)))
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    res.json({ success: true, message: "Password reset successfully." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select(
      "-password -resetPasswordOtp -resetPasswordExpires",
    );
    if (!admin)
      return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, admin });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════════

export const getAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ coordinators: req.adminId })
      .populate({
        path: "problem",
        select:
          "problemID title category description theme tags ownerName organization department contactInfo problem_coordinator is_published assignedStudents",
      })
      .populate({
        path: "contributors",
        select:
          "name email phone usn semester department program branch college githubLink isBlocked projectWiseContribution totalScore totalTasksCompleted",
      })
      .populate({
        path: "logs",
        select:
          "taskTitle description requirements githubIssueLink githubPrLink closureNote assignedTaskPoints contributorID task_contributor task_status isPublished deadlineDays deadlineAt assignedAt closedAt reopenCount createdAt",
      })
      .populate({
        path: "topContributors",
        select: "name email department totalScore",
      })
      .populate({
        path: "coordinators",
        select: "name email phone college branch",
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
          "name email phone usn semester department program branch college githubLink isBlocked projectWiseContribution totalScore totalTasksCompleted",
      })
      .populate({
        path: "logs",
        select:
          "taskTitle description requirements githubIssueLink githubPrLink closureNote assignedTaskPoints contributorID task_contributor task_status isPublished deadlineDays deadlineAt assignedAt closedAt reopenCount actions createdAt",
      })
      .populate({
        path: "topContributors",
        select: "name email department totalScore",
      })
      .populate({
        path: "coordinators",
        select: "name email phone college branch",
      });

    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied.",
      });
    res.json({ success: true, project });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
      resourcesLink,
      communityLink,
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
    if (resourcesLink !== undefined) project.resourcesLink = resourcesLink;
    if (communityLink !== undefined) project.communityLink = communityLink;
    if (is_blocked !== undefined) project.is_blocked = Boolean(is_blocked);
    await project.save();

    const pu = {};
    if (title !== undefined) pu.title = title;
    if (category !== undefined) pu.category = category;
    if (theme !== undefined) pu.theme = theme;
    if (description !== undefined) pu.description = description;
    if (ownerName !== undefined) pu.ownerName = ownerName;
    if (organization !== undefined) pu.organization = organization;
    if (department !== undefined) pu.department = department;
    if (contactInfo !== undefined) pu.contactInfo = contactInfo;
    if (problem_coordinator !== undefined)
      pu.problem_coordinator = problem_coordinator;
    if (Object.keys(pu).length)
      await Problem.findByIdAndUpdate(
        project.problem,
        { $set: pu },
        { runValidators: true },
      );

    const updated = await Project.findById(project._id)
      .populate("problem")
      .populate({
        path: "contributors",
        select:
          "name email phone usn semester department program branch college githubLink isBlocked projectWiseContribution totalScore totalTasksCompleted",
      })
      .populate("logs")
      .populate({ path: "topContributors", select: "name email" })
      .populate({
        path: "coordinators",
        select: "name email phone college branch",
      });

    res.json({ success: true, message: "Project updated.", project: updated });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const toggleProjectBlock = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      coordinators: req.adminId,
    });
    if (!project)
      return res.status(404).json({ success: false, message: "Not found." });
    project.is_blocked = !project.is_blocked;
    await project.save();
    res.json({
      success: true,
      message: `Project ${project.is_blocked ? "blocked" : "unblocked"}.`,
      is_blocked: project.is_blocked,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGS — full lifecycle
// ═══════════════════════════════════════════════════════════════════════════════

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
      requirements,
      githubIssueLink,
      assignedTaskPoints,
      deadlineDays,
    } = req.body;
    if (!taskTitle || !description || !githubIssueLink)
      return res.status(400).json({
        success: false,
        message: "taskTitle, description, and githubIssueLink are required.",
      });

    const pts = Number(assignedTaskPoints) || 10;
    const log = await Log.create({
      taskTitle,
      description,
      requirements: requirements || "",
      problemId: project.problem,
      projectId: project._id,
      githubIssueLink,
      assignedTaskPoints: pts,
      deadlineDays: Number(deadlineDays) || 7,
      task_coordinator_id: req.adminId,
      task_status: "open",
      isPublished: false,
      actions: [
        {
          actionType: "opened",
          note: "Log created as draft.",
          by: req.adminId.toString(),
        },
      ],
    });
    await Project.findByIdAndUpdate(project._id, { $push: { logs: log._id } });
    await Admin.findByIdAndUpdate(req.adminId, {
      $inc: { totalTaskCreated: 1, totalPointsAllocated: pts },
    });
    await syncProjectStats(project._id);

    res.status(201).json({
      success: true,
      message:
        "Log created as draft. Publish to make it visible to contributors.",
      log,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const togglePublishLog = async (req, res) => {
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
    const log = await Log.findOne({
      _id: req.params.logId,
      projectId: project._id,
    });
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });
    if (["completed", "terminated"].includes(log.task_status))
      return res.status(400).json({
        success: false,
        message: "Cannot toggle publish state of a closed log.",
      });
    log.isPublished = !log.isPublished;
    log.actions.push({
      actionType: log.isPublished ? "published" : "unpublished",
      note: log.isPublished
        ? "Published — visible to contributors."
        : "Unpublished — hidden from contributors.",
      by: req.adminId.toString(),
    });
    await log.save();
    res.json({
      success: true,
      message: `Log ${log.isPublished ? "published" : "unpublished"}.`,
      log,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });
    const project = await Project.findOne({
      logs: log._id,
      coordinators: req.adminId,
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    if (log.task_status === "assigned")
      return res
        .status(400)
        .json({ success: false, message: "Cannot edit an assigned log." });
    if (["completed", "terminated"].includes(log.task_status))
      return res
        .status(400)
        .json({ success: false, message: "Cannot edit a closed log." });

    const {
      taskTitle,
      description,
      requirements,
      githubIssueLink,
      assignedTaskPoints,
      deadlineDays,
    } = req.body;
    const oldPts = log.assignedTaskPoints;
    if (taskTitle !== undefined) log.taskTitle = taskTitle;
    if (description !== undefined) log.description = description;
    if (requirements !== undefined) log.requirements = requirements;
    if (githubIssueLink !== undefined) log.githubIssueLink = githubIssueLink;
    if (assignedTaskPoints !== undefined)
      log.assignedTaskPoints = Number(assignedTaskPoints);
    if (deadlineDays !== undefined) log.deadlineDays = Number(deadlineDays);
    log.actions.push({
      actionType: "updated",
      note: "Log updated by admin.",
      by: req.adminId.toString(),
    });
    await log.save();
    if (
      assignedTaskPoints !== undefined &&
      Number(assignedTaskPoints) !== oldPts
    )
      await Admin.findByIdAndUpdate(req.adminId, {
        $inc: { totalPointsAllocated: Number(assignedTaskPoints) - oldPts },
      });
    res.json({ success: true, message: "Log updated.", log });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── FIX: closeLog now accepts both "assigned" AND "pending" statuses ─────────
export const closeLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });

    const project = await Project.findOne({
      logs: log._id,
      coordinators: req.adminId,
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });

    // Guard: already completed
    if (log.task_status === "completed")
      return res
        .status(400)
        .json({ success: false, message: "Log is already completed." });

    // Guard: terminated
    if (log.task_status === "terminated")
      return res.status(400).json({
        success: false,
        message: "Cannot close a terminated log. Reopen it first.",
      });

    // ✅ FIX: Accept both "assigned" and "pending" (student-submitted) statuses
    const closeableStatuses = ["assigned", "pending"];
    if (!closeableStatuses.includes(log.task_status))
      return res.status(400).json({
        success: false,
        message: `Only assigned or pending-review logs can be completed. Current status: "${log.task_status}".`,
      });

    if (!log.contributorID)
      return res
        .status(400)
        .json({ success: false, message: "No contributor on this log." });

    const { githubPrLink, contributionScore, closureNote } = req.body;
    if (!githubPrLink)
      return res.status(400).json({
        success: false,
        message: "githubPrLink is required to close a log.",
      });

    const pts = Number(contributionScore) || log.assignedTaskPoints;
    const studentId = log.contributorID.toString();
    const projectId = project._id.toString();

    log.task_status = "completed";
    log.isPublished = true;
    log.githubPrLink = githubPrLink;
    log.closureNote = closureNote || "";
    log.assignedTaskPoints = pts;
    log.closedAt = new Date();
    log.actions.push({
      actionType: "completed",
      note: `Closed by admin. PR: ${githubPrLink}. Points awarded: ${pts}.`,
      by: req.adminId.toString(),
    });
    await log.save();

    // ── Update student scores ──────────────────────────────────────────────
    const student = await Student.findById(studentId);
    let studentName = log.task_contributor || "contributor";
    if (student) {
      studentName = student.name;
      const ci = student.projectWiseContribution.findIndex(
        (c) => c.project?.toString() === projectId,
      );
      if (ci >= 0) {
        student.projectWiseContribution[ci].contributionScore += pts;
        student.projectWiseContribution[ci].tasksCompleted += 1;
      } else {
        student.projectWiseContribution.push({
          project: projectId,
          contributionScore: pts,
          tasksCompleted: 1,
          role: "Contributor",
        });
      }
      student.totalScore = (student.totalScore || 0) + pts;
      student.totalTasksCompleted = (student.totalTasksCompleted || 0) + 1;
      await student.save();
    }

    await syncProjectStats(projectId);

    // ── Recalculate top contributors ──────────────────────────────────────
    const allContribs = await Student.find({ projects: projectId })
      .select("_id projectWiseContribution")
      .lean();
    const topRanked = allContribs
      .map((s) => {
        const c = s.projectWiseContribution?.find(
          (x) => x.project?.toString() === projectId,
        );
        return { id: s._id, score: c?.contributionScore || 0 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.id);
    await Project.findByIdAndUpdate(projectId, { topContributors: topRanked });

    await Admin.findByIdAndUpdate(req.adminId, { $inc: { totalPoints: pts } });

    res.json({
      success: true,
      message: `Task completed! ${pts} points awarded to ${studentName}.`,
      log,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const terminateLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });
    const project = await Project.findOne({
      logs: log._id,
      coordinators: req.adminId,
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    if (log.task_status === "completed")
      return res
        .status(400)
        .json({ success: false, message: "Cannot terminate a completed log." });
    if (log.task_status === "terminated")
      return res
        .status(400)
        .json({ success: false, message: "Log is already terminated." });

    log.task_status = "terminated";
    log.isPublished = false;
    log.closureNote = req.body.closureNote || "Terminated by admin.";
    log.closedAt = new Date();
    log.actions.push({
      actionType: "terminated",
      note: log.closureNote,
      by: req.adminId.toString(),
    });
    await log.save();
    await syncProjectStats(project._id);
    res.json({
      success: true,
      message: "Log terminated. You can reopen it anytime.",
      log,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const reopenLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });
    const project = await Project.findOne({
      logs: log._id,
      coordinators: req.adminId,
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    if (log.task_status !== "terminated")
      return res.status(400).json({
        success: false,
        message: "Only terminated logs can be reopened.",
      });

    const { deadlineDays } = req.body;
    log.task_status = "open";
    log.isPublished = true;
    log.contributorID = null;
    log.task_contributor = "";
    log.assignedAt = null;
    log.deadlineAt = null;
    log.closedAt = null;
    log.closureNote = "";
    log.githubPrLink = "";
    if (deadlineDays) log.deadlineDays = Number(deadlineDays);
    log.reopenCount += 1;
    log.actions.push({
      actionType: "reopened",
      note: `Reopened. New window: ${log.deadlineDays}d.`,
      by: req.adminId.toString(),
    });
    await log.save();
    await syncProjectStats(project._id);
    res.json({
      success: true,
      message: "Log reopened and published. Contributors can now self-assign.",
      log,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const checkAndTerminateExpiredLogs = async (req, res) => {
  try {
    // ✅ Also auto-terminate "pending" logs that have blown past deadline
    const expired = await Log.find({
      task_status: { $in: ["assigned", "pending"] },
      deadlineAt: { $lte: new Date() },
    });
    let count = 0;
    for (const log of expired) {
      log.task_status = "terminated";
      log.isPublished = false;
      log.closureNote =
        "Auto-terminated: deadline exceeded without admin review.";
      log.closedAt = new Date();
      log.actions.push({
        actionType: "terminated",
        note: "Auto-terminated (deadline passed).",
        by: "system",
      });
      await log.save();
      await syncProjectStats(log.projectId.toString());
      count++;
    }
    res.json({
      success: true,
      message: `${count} log(s) auto-terminated.`,
      count,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getOpenLogs = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).select(
      "_id is_blocked",
    );
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    if (project.is_blocked)
      return res
        .status(403)
        .json({ success: false, message: "Project is blocked." });
    const logs = await Log.find({
      projectId: project._id,
      isPublished: true,
      task_status: "open",
    }).select(
      "taskTitle description requirements githubIssueLink assignedTaskPoints deadlineDays createdAt projectId",
    );
    res.json({ success: true, count: logs.length, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── Admin forces assignment to a specific student ────────────────────────────
export const selfAssignLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Log not found." });
    if (!log.isPublished)
      return res
        .status(400)
        .json({ success: false, message: "Task not published." });
    if (log.task_status !== "open")
      return res
        .status(400)
        .json({ success: false, message: "Task no longer available." });

    const { contributorID, contributorName } = req.body;
    if (!contributorID)
      return res
        .status(400)
        .json({ success: false, message: "Please select a contributor." });

    const project = await Project.findOne({
      _id: log.projectId,
      contributors: contributorID,
    });
    if (!project)
      return res.status(403).json({
        success: false,
        message: "This student is not a contributor on this project.",
      });

    const now = new Date();
    const deadlineAt = new Date(now.getTime() + log.deadlineDays * 86400000);
    log.contributorID = contributorID;
    log.task_contributor = contributorName || "Contributor";
    log.task_status = "assigned";
    log.assignedAt = now;
    log.deadlineAt = deadlineAt;
    log.actions.push({
      actionType: "self_assigned",
      note: `Task assigned to ${log.task_contributor} by Admin. Deadline: ${deadlineAt.toISOString()}`,
      by: req.adminId.toString(),
    });
    await log.save();
    await Student.findByIdAndUpdate(contributorID, {
      $addToSet: { logs: log._id },
    });
    res.json({
      success: true,
      message: `Task manually assigned to ${log.task_contributor}!`,
      log,
      deadlineAt,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
      return res.status(404).json({ success: false, message: "Not found." });
    const student = await Student.findById(req.params.studentId).select(
      "-password -resetPasswordOtp -resetPasswordExpires",
    );
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    const logs = await Log.find({
      contributorID: req.params.studentId,
      projectId: project._id,
    }).sort({ createdAt: -1 });
    res.json({ success: true, student, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN
// ═══════════════════════════════════════════════════════════════════════════════

export const saLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!process.env.SA_MAIL || !process.env.SA_PASSWORD)
      return res
        .status(500)
        .json({ success: false, message: "SA credentials not configured." });
    if (email !== process.env.SA_MAIL || password !== process.env.SA_PASSWORD)
      return res
        .status(401)
        .json({ success: false, message: "Invalid SA credentials." });
    res.json({
      success: true,
      message: "Super Admin access granted.",
      token: genSAToken(),
      superAdmin: { email: process.env.SA_MAIL, role: "superadmin" },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

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
      Log.countDocuments(),
      Log.countDocuments({ task_status: "completed" }),
    ]);
    const ptAgg = await Log.aggregate([
      { $match: { task_status: "completed" } },
      { $group: { _id: null, total: { $sum: "$assignedTaskPoints" } } },
    ]);
    const recentProblems = await Problem.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "problemID title category theme is_published ownerName organization createdAt",
      );
    const topStudents = await Student.find()
      .sort({ totalScore: -1 })
      .limit(5)
      .select("name email department college totalScore totalTasksCompleted");
    res.json({
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
        totalPointsDistributed: ptAgg[0]?.total || 0,
      },
      recentProblems,
      topStudents,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saGetAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }).lean();
    const projects = await Project.find({
      problem: { $in: problems.map((p) => p._id) },
    })
      .populate({ path: "coordinators", select: "name email" })
      .select("problem coordinators projectID is_blocked createdAt");
    const projMap = {};
    projects.forEach((p) => {
      projMap[p.problem.toString()] = p;
    });
    res.json({
      success: true,
      count: problems.length,
      problems: problems.map((p) => ({
        ...p,
        project: projMap[p._id.toString()] || null,
      })),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saApproveProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem)
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });

    const { coordinatorId, githubRepoLink, projectDescription } = req.body;
    if (!coordinatorId)
      return res
        .status(400)
        .json({ success: false, message: "Assign a coordinator." });

    const coordinator = await Admin.findById(coordinatorId);
    if (!coordinator)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });

    if (await Project.findOne({ problem: problem._id }))
      return res
        .status(400)
        .json({
          success: false,
          message: "Project already exists for this problem.",
        });

    problem.is_published = true;
    problem.actions.push({
      actionType: "approved",
      note: `Approved. Coordinator: ${coordinator.name}`,
    });
    await problem.save();

    const lastProject = await Project.findOne().sort({ _id: -1 });
    let nextIdNumber = 1;
    if (lastProject?.projectID?.startsWith("GMP-")) {
      const lastNumber = parseInt(
        lastProject.projectID.replace("GMP-", ""),
        10,
      );
      if (!isNaN(lastNumber)) nextIdNumber = lastNumber + 1;
    }
    const generatedProjectID = `GMP-${nextIdNumber.toString().padStart(3, "0")}`;

    const project = await Project.create({
      projectID: generatedProjectID,
      problem: problem._id,
      coordinators: [coordinatorId],
      contributors: [],
      logs: [],
      githubRepoLink: githubRepoLink || "https://github.com/placeholder",
      projectDescription: projectDescription || problem.description,
    });

    await Admin.findByIdAndUpdate(coordinatorId, {
      $push: { managedProjects: project._id },
    });

    await sendEmail({
      to: problem.contactInfo,
      subject: "✅ Problem Approved — InteConnect 26.0",
      html: `<div style="font-family:monospace;background:#080c14;color:#f0f4ff;padding:32px;border-radius:12px;max-width:600px"><h2 style="color:#4ade80">Problem Approved ✓</h2><p>Your problem <strong>${problem.title}</strong> has been approved.</p><p>Project ID: ${project.projectID}<br>Coordinator: ${coordinator.name} (${coordinator.email})</p></div>`,
    });

    res.status(201).json({
      success: true,
      message: `Problem approved. Project ${project.projectID} initiated.`,
      project,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

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
      subject: "❌ Problem Update — InteConnect 26.0",
      html: `<div style="font-family:monospace;background:#080c14;color:#f0f4ff;padding:32px;border-radius:12px;max-width:600px"><h2 style="color:#f87171">Problem Not Selected</h2><p>Your problem <strong>${problem.title}</strong> could not be approved.${reason ? `<br><br>Reason: ${reason}` : ""}</p></div>`,
    });
    res.json({ success: true, message: "Problem rejected." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saAssignCoordinator = async (req, res) => {
  try {
    const coordinator = await Admin.findById(req.body.coordinatorId);
    if (!coordinator)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    const project = await Project.findOne({ problem: req.params.problemId });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "No project for this problem." });
    if (
      !project.coordinators
        .map(String)
        .includes(req.body.coordinatorId.toString())
    ) {
      project.coordinators.push(req.body.coordinatorId);
      await project.save();
      await Admin.findByIdAndUpdate(req.body.coordinatorId, {
        $addToSet: { managedProjects: project._id },
      });
    }
    res.json({
      success: true,
      message: `${coordinator.name} assigned as coordinator.`,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saGetAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: admins.length, admins });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saToggleBlockAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin)
      return res.status(404).json({ success: false, message: "Not found." });
    admin.isBlocked = !admin.isBlocked;
    await admin.save();
    res.json({
      success: true,
      message: `Admin ${admin.isBlocked ? "blocked" : "unblocked"}.`,
      isBlocked: admin.isBlocked,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saDeleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.adminId);
    res.json({ success: true, message: "Admin removed." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saGetAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .populate({
        path: "projects",
        select: "projectID problem projectProgressRate",
      })
      .sort({ totalScore: -1 });
    res.json({ success: true, count: students.length, students });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saToggleBlockStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student)
      return res.status(404).json({ success: false, message: "Not found." });
    student.isBlocked = !student.isBlocked;
    await student.save();
    res.json({
      success: true,
      message: `Student ${student.isBlocked ? "blocked" : "unblocked"}.`,
      isBlocked: student.isBlocked,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

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
      });
    if (!student)
      return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, student });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN — NOTIFICATIONS & BROADCASTS
// ═══════════════════════════════════════════════════════════════════════════════

const broadcastEmail = async (title, message, type) => {
  try {
    const [students, admins] = await Promise.all([
      Student.find({ isBlocked: false }).select("email").lean(),
      Admin.find({ isBlocked: false }).select("email").lean(),
    ]);
    const allEmails = [
      ...students.map((s) => s.email),
      ...admins.map((a) => a.email),
    ];
    if (allEmails.length === 0) return;
    const colorMap = {
      info: "#3a9de8",
      update: "#fbbf24",
      alert: "#f87171",
      success: "#4ade80",
    };
    const accentColor = colorMap[type] || colorMap.info;
    await mailer.sendMail({
      from: `"InterConnect 26.0" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      bcc: allEmails,
      subject: `📢 Announcement: ${title}`,
      html: `
        <div style="font-family:monospace;background:#080c14;color:#f0f4ff;padding:32px;border-radius:12px;max-width:600px;margin:auto;border:1px solid #1e2330;">
          <h2 style="color:${accentColor}; border-bottom: 1px solid #1e2330; padding-bottom: 12px;">${title}</h2>
          <p style="color:#8892a4; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          <hr style="border-color:#1e2330;margin:30px 0 20px 0">
          <p style="color:#4a5568;font-size:12px;text-align:center;">© InteConnect 26.0 · GMU Campus</p>
        </div>
      `,
    });
    console.log(`[BROADCAST SUCCESS] Sent to ${allEmails.length} users.`);
  } catch (error) {
    console.error("[BROADCAST ERROR]", error.message);
  }
};

export const saCreateNotification = async (req, res) => {
  try {
    const { title, message, type, isPublished } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type,
      isPublished: Boolean(isPublished),
      emailSent: Boolean(isPublished),
    });
    if (notification.isPublished) broadcastEmail(title, message, type);
    res
      .status(201)
      .json({ success: true, message: "Notification created", notification });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saGetNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      isPinned: -1,
      createdAt: -1,
    });
    res.json({ success: true, count: notifications.length, notifications });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saTogglePublishNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ success: false, message: "Not found." });
    notification.isPublished = !notification.isPublished;
    if (notification.isPublished && !notification.emailSent) {
      broadcastEmail(
        notification.title,
        notification.message,
        notification.type,
      );
      notification.emailSent = true;
    }
    await notification.save();
    res.json({
      success: true,
      message: `Notification ${notification.isPublished ? "Published" : "Unpublished"}`,
      notification,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saTogglePinNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ success: false, message: "Not found." });
    notification.isPinned = !notification.isPinned;
    await notification.save();
    res.json({
      success: true,
      message: `Notification ${notification.isPinned ? "Pinned" : "Unpinned"}`,
      notification,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const saDeleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

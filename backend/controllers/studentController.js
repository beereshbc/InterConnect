import Student from "../models/Student.js";
import Project from "../models/Project.js";
import Problem from "../models/Problem.js";
import Log from "../models/Logs.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Notification from "../models/Notification.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// AUTH
// ═════════════════════════════════════════════════════════════════════════════

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      program,
      semester,
      usn,
      department,
      branch,
      password,
    } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      name,
      email,
      phone,
      college,
      program,
      semester,
      usn,
      department: department || "",
      branch: branch || "",
      password: hashedPassword,
    });

    await newStudent.save();

    const token = generateToken(newStudent._id);
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    if (student.isBlocked)
      return res
        .status(403)
        .json({ success: false, message: "Your account has been blocked." });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });

    const token = generateToken(student._id);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      student: { _id: student._id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "No account found with that email." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    student.resetPasswordOtp = await bcrypt.hash(otp, salt);
    student.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await student.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: "InterConnect — Password Reset OTP",
      html: `
        <div style="font-family:monospace;background:#080c14;color:#f0f4ff;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#3a9de8">Password Reset Request</h2>
          <p style="color:#8892a4">Hello ${student.name},</p>
          <p style="color:#8892a4">Use the OTP below to reset your password. Valid for <strong>10 minutes</strong>.</p>
          <div style="background:#0c0f18;border:1px solid #3a9de830;border-radius:8px;padding:24px;text-align:center;margin:20px 0">
            <h1 style="color:#3a9de8;letter-spacing:10px;margin:0">${otp}</h1>
          </div>
          <p style="color:#6b7a99;font-size:12px">If you did not request this, please ignore this email.</p>
          <hr style="border-color:#1e2330;margin:20px 0">
          <p style="color:#4a5568;font-size:10px">© InteConnect 26.0 · GMIT</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const student = await Student.findOne({ email });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (student.resetPasswordExpires < Date.now())
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });

    const isMatch = await bcrypt.compare(otp, student.resetPasswordOtp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid OTP." });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    student.resetPasswordOtp = undefined;
    student.resetPasswordExpires = undefined;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now login.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═════════════════════════════════════════════════════════════════════════════

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId)
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .populate({
        path: "projects",
        select: "projectID problem projectProgressRate contributors is_blocked",
        populate: { path: "problem", select: "problemID title category theme" },
      })
      .populate({
        path: "logs",
        select:
          "taskTitle description task_status assignedTaskPoints deadlineAt closedAt createdAt projectId",
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

export const updateStudentProfile = async (req, res) => {
  try {
    const { name, phone, department, program, branch, college, githubLink } =
      req.body;
    const student = await Student.findById(req.studentId);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    if (name !== undefined) student.name = name;
    if (phone !== undefined) student.phone = phone;
    if (department !== undefined) student.department = department;
    if (program !== undefined) student.program = program;
    if (branch !== undefined) student.branch = branch;
    if (college !== undefined) student.college = college;
    if (githubLink !== undefined) student.githubLink = githubLink;
    await student.save();

    res
      .status(200)
      .json({ success: true, message: "Profile updated.", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// PROBLEMS
// ═════════════════════════════════════════════════════════════════════════════

export const getPublishedProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ is_published: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, problems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      theme,
      tags,
      ownerName,
      organization,
      department,
      contactInfo,
      Phone,
    } = req.body;

    const lastProblem = await Problem.findOne().sort({ _id: -1 });
    let nextIdNumber = 1;

    if (
      lastProblem &&
      lastProblem.problemID &&
      lastProblem.problemID.startsWith("P-")
    ) {
      const lastNumber = parseInt(lastProblem.problemID.replace("P-", ""), 10);
      if (!isNaN(lastNumber)) {
        nextIdNumber = lastNumber + 1;
      }
    }

    const generatedProblemID = `P-${nextIdNumber.toString().padStart(4, "0")}`;

    const newProblem = new Problem({
      problemID: generatedProblemID,
      title,
      category,
      description,
      theme,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      ownerName,
      organization,
      department,
      contactInfo,
      Phone,
      is_published: false,
    });

    await newProblem.save();

    res.status(201).json({
      success: true,
      message: "Problem submitted successfully. Pending admin review.",
      problemID: generatedProblemID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    const studentId = req.studentId;
    const role = req.body && req.body.role ? req.body.role : "Contributor";

    const problem = await Problem.findById(problemId);
    if (!problem)
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });

    if (!problem.is_published)
      return res.status(403).json({
        success: false,
        message: "This problem is not open for contributors yet.",
      });

    let project = await Project.findOne({ problem: problemId });

    if (project) {
      if (project.contributors.map(String).includes(studentId.toString()))
        return res.status(400).json({
          success: false,
          message: "You have already joined this project.",
        });
      project.contributors.push(studentId);
    } else {
      project = new Project({
        problem: problemId,
        contributors: [studentId],
        coordinators: [],
        projectDescription: problem.description,
        githubRepoLink: "https://github.com/placeholder",
      });
    }

    await project.save();

    await Problem.findByIdAndUpdate(problemId, {
      $addToSet: { assignedStudents: studentId },
    });

    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { projects: project._id },
      $push: {
        projectWiseContribution: {
          project: project._id,
          contributionScore: 0,
          role: role,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully joined the project pipeline!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═════════════════════════════════════════════════════════════════════════════

export const getMyProjects = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select(
      "projects projectWiseContribution",
    );
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    const projects = await Project.find({ _id: { $in: student.projects } })
      .populate({
        path: "problem",
        select:
          "problemID title category theme description tags ownerName organization",
      })
      .populate({
        path: "contributors",
        select: "name email branch department",
      })
      .populate({
        path: "logs",
        select:
          "taskTitle task_status assignedTaskPoints deadlineAt task_contributor isPublished createdAt",
      });

    const enriched = projects
      .map((proj) => {
        const contrib = student.projectWiseContribution?.find(
          (c) => c.project?.toString() === proj._id?.toString(),
        );
        return {
          ...proj.toObject(),
          myContribution: {
            score: contrib?.contributionScore ?? 0,
            role: contrib?.role ?? "",
            description: contrib?.description ?? "",
          },
        };
      })
      .sort((a, b) => b.myContribution.score - a.myContribution.score);

    res
      .status(200)
      .json({ success: true, count: enriched.length, projects: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGS
// ═════════════════════════════════════════════════════════════════════════════

export const getMyLogs = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { contributorID: req.studentId };
    if (status) query.task_status = status;

    const logs = await Log.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "projectId",
        select: "projectID problem",
        populate: { path: "problem", select: "title" },
      });

    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const selfAssignLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log)
      return res
        .status(404)
        .json({ success: false, message: "Task log not found." });

    if (!log.isPublished)
      return res.status(400).json({
        success: false,
        message: "This task is not published by the admin yet.",
      });

    if (log.task_status !== "open")
      return res.status(400).json({
        success: false,
        message: "This task has already been claimed.",
      });

    const project = await Project.findOne({
      _id: log.projectId,
      contributors: req.studentId,
    });

    if (!project)
      return res.status(403).json({
        success: false,
        message: "You must join this project before initiating its tasks.",
      });

    const student = await Student.findById(req.studentId).select("name");
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    const activeLogs = await Log.countDocuments({
      contributorID: req.studentId,
      task_status: "assigned",
    });

    if (activeLogs >= 5)
      return res.status(400).json({
        success: false,
        message:
          "You already have 5 active tasks. Complete some before taking more.",
      });

    const now = new Date();
    const deadlineAt = new Date(
      now.getTime() + log.deadlineDays * 24 * 60 * 60 * 1000,
    );

    log.contributorID = req.studentId;
    log.task_contributor = student.name;
    log.task_status = "assigned";
    log.assignedAt = now;
    log.deadlineAt = deadlineAt;

    log.actions.push({
      actionType: "self_assigned",
      note: `Task initiated by ${student.name}. Deadline: ${deadlineAt.toISOString()}`,
      by: req.studentId.toString(),
    });

    await log.save();

    await Student.findByIdAndUpdate(req.studentId, {
      $addToSet: { logs: log._id },
    });

    res.status(200).json({
      success: true,
      message: `Task initiated! You have ${log.deadlineDays} day(s) to complete it.`,
      log,
      deadlineAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── NEW: Mark Log Complete (Student side) ───
export const markLogComplete = async (req, res) => {
  try {
    const { githubPrLink, closureNote } = req.body;
    const logId = req.params.logId;
    const studentId = req.studentId;

    if (!githubPrLink) {
      return res.status(400).json({
        success: false,
        message: "A GitHub PR or Commit link is required to submit your task.",
      });
    }

    const log = await Log.findOne({ _id: logId, contributorID: studentId });
    if (!log) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Log not found or not assigned to you.",
        });
    }

    if (log.task_status !== "assigned") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only assigned tasks can be marked for review.",
        });
    }

    // Set to pending so Admin knows to review/close it
    log.task_status = "pending";
    log.githubPrLink = githubPrLink;
    if (closureNote) log.closureNote = closureNote;

    log.actions.push({
      actionType: "submitted_for_review",
      note: `Submitted by student. PR: ${githubPrLink}. Note: ${closureNote || "None"}`,
      by: studentId.toString(),
    });

    await log.save();

    res.status(200).json({
      success: true,
      message: "Task submitted successfully! Pending admin review.",
      log,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId)
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .populate({
        path: "projects",
        select:
          "projectID problem projectProgressRate contributors logs is_blocked resourcesLink communityLink githubRepoLink liveHostedLink",
        populate: [
          {
            path: "problem",
            select: "problemID title category theme tags description",
          },
          { path: "contributors", select: "name email branch" },
        ],
      })
      .populate({
        path: "logs",
        select:
          "taskTitle description requirements task_status assignedTaskPoints deadlineDays deadlineAt assignedAt closedAt githubIssueLink githubPrLink closureNote isPublished reopenCount createdAt projectId",
        populate: {
          path: "projectId",
          select: "projectID problem",
          populate: { path: "problem", select: "title" },
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    const logs = student.logs || [];
    const totalScore = (student.projectWiseContribution || []).reduce(
      (a, c) => a + (c.contributionScore || 0),
      0,
    );
    const completedLogs = logs.filter((l) => l.task_status === "completed");
    const assignedLogs = logs.filter(
      (l) => l.task_status === "assigned" || l.task_status === "pending",
    );
    const terminatedLogs = logs.filter((l) => l.task_status === "terminated");
    const totalPoints = completedLogs.reduce(
      (a, l) => a + (l.assignedTaskPoints || 0),
      0,
    );

    const projectsEnriched = (student.projects || [])
      .map((proj) => {
        const contrib = student.projectWiseContribution?.find(
          (c) => c.project?.toString() === proj._id?.toString(),
        );
        const projLogs = logs.filter(
          (l) =>
            l.projectId?._id?.toString() === proj._id?.toString() ||
            l.projectId?.toString() === proj._id?.toString(),
        );
        return {
          ...proj.toObject(),
          myScore: contrib?.contributionScore ?? 0,
          myRole: contrib?.role ?? "",
          myDescription: contrib?.description ?? "",
          myLogs: projLogs,
          myTasksDone: projLogs.filter((l) => l.task_status === "completed")
            .length,
          myTasksActive: projLogs.filter(
            (l) => l.task_status === "assigned" || l.task_status === "pending",
          ).length,
        };
      })
      .sort((a, b) => b.myScore - a.myScore);

    const projectIds = (student.projects || []).map((p) => p._id);

    const openLogs = await Log.find({
      projectId: { $in: projectIds },
      isPublished: true,
      task_status: "open",
    })
      .select(
        "taskTitle description requirements assignedTaskPoints deadlineDays createdAt projectId githubIssueLink task_status isPublished",
      )
      .populate({
        path: "projectId",
        select: "projectID problem",
        populate: { path: "problem", select: "title" },
      })
      .sort({ createdAt: -1 });

    const allStudents = await Student.find({ isBlocked: false })
      .select("name projectWiseContribution department")
      .lean();

    const ranked = allStudents
      .map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        department: s.department,
        totalScore: (s.projectWiseContribution || []).reduce(
          (a, c) => a + (c.contributionScore || 0),
          0,
        ),
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    const myRank = ranked.findIndex((s) => s._id === req.studentId) + 1;
    const top10 = ranked.slice(0, 10);

    res.status(200).json({
      success: true,
      student: student.toObject(),
      stats: {
        totalScore,
        totalPoints,
        totalProjects: projectsEnriched.length,
        totalLogs: logs.length,
        completedLogs: completedLogs.length,
        assignedLogs: assignedLogs.length,
        terminatedLogs: terminatedLogs.length,
        completionRate:
          logs.length > 0
            ? Math.round((completedLogs.length / logs.length) * 100)
            : 0,
      },
      projects: projectsEnriched,
      recentLogs: logs.slice(0, 10),
      openLogs,
      ranking: { myRank, totalStudents: ranked.length, top10 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═════════════════════════════════════════════════════════════════════════════

export const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const students = await Student.find({ isBlocked: false })
      .select(
        "name email department college branch totalScore totalTasksCompleted githubLink",
      )
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalStudents = await Student.countDocuments({ isBlocked: false });
    const totalPages = Math.ceil(totalStudents / limit);

    const now = new Date();
    const day = now.getDay();
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diffToMonday));
    startOfWeek.setHours(0, 0, 0, 0);

    const topProjectAgg = await Log.aggregate([
      { $match: { task_status: "completed", closedAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: "$projectId",
          weekPoints: { $sum: "$assignedTaskPoints" },
          tasks: { $sum: 1 },
        },
      },
      { $sort: { weekPoints: -1 } },
      { $limit: 1 },
    ]);

    let topProject = null;
    if (topProjectAgg.length > 0) {
      const proj = await Project.findById(topProjectAgg[0]._id).populate(
        "problem",
        "title theme category",
      );
      if (proj) {
        topProject = {
          _id: proj._id,
          projectID: proj.projectID,
          problemTitle: proj.problem?.title,
          theme: proj.problem?.theme,
          weekPoints: topProjectAgg[0].weekPoints,
          weekTasks: topProjectAgg[0].tasks,
        };
      }
    }

    const topCoordAgg = await Log.aggregate([
      { $match: { task_status: "completed", closedAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: "$task_coordinator_id",
          weekPoints: { $sum: "$assignedTaskPoints" },
          tasks: { $sum: 1 },
        },
      },
      { $sort: { weekPoints: -1 } },
      { $limit: 1 },
    ]);

    let topCoordinator = null;
    if (topCoordAgg.length > 0 && topCoordAgg[0]._id) {
      const admin = await Admin.findById(topCoordAgg[0]._id).select(
        "name email college department",
      );
      if (admin) {
        topCoordinator = {
          _id: admin._id,
          name: admin.name,
          college: admin.college,
          weekPoints: topCoordAgg[0].weekPoints,
          weekTasks: topCoordAgg[0].tasks,
        };
      }
    }

    res.status(200).json({
      success: true,
      leaderboard: students,
      pagination: {
        page,
        limit,
        totalPages,
        totalStudents,
      },
      topProject,
      topCoordinator,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublishedNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isPublished: true }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res
      .status(200)
      .json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

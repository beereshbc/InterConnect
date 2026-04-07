import Student from "../models/Student.js";
import Project from "../models/Project.js";
import Problem from "../models/Problem.js";
import Log from "../models/Logs.js";
import Admin from "../models/Admin.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
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

    if (await Student.findOne({ email }))
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });

    const newStudent = await Student.create({
      name,
      email,
      phone,
      college,
      program,
      semester,
      usn,
      department: department || "",
      branch: branch || "",
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: generateToken(newStudent._id),
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
    if (!(await bcrypt.compare(password, student.password)))
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });

    res.json({
      success: true,
      message: "Login successful.",
      token: generateToken(student._id),
      student: { _id: student._id, name: student.name, email: student.email },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Ensure transporter is imported/configured correctly

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const student = await Student.findOne({
      email: email.toLowerCase().trim(),
    });

    // Security Tip: In production, some prefer to return 'success' even if user isn't found
    // to prevent email enumeration. Here we'll stick to your logic but sanitize the email.
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with that email." });
    }

    // 1. Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Hash OTP and set expiry (10 mins)
    const hashedOtp = await bcrypt.hash(otp, 10);
    student.resetPasswordOtp = hashedOtp;
    student.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await student.save();

    // 3. Send Email with Error Handling
    const mailOptions = {
      from: `"InterConnect Support" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: sans-serif; background:#f4f7f6; padding:20px; border-radius:10px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; border-top: 4px solid #3a9de8;">
            <h2 style="color: #333;">Password Reset</h2>
            <p>Hi ${student.name || "there"},</p>
            <p>You requested a password reset. Use the code below to proceed:</p>
            <div style="background: #f0f7ff; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3a9de8; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #666;">This code expires in 10 minutes. If you didn't request this, please secure your account.</p>
          </div>
        </div>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "A reset code has been sent to your email.",
    });
  } catch (error) {
    console.error("OTP SEND ERROR:", error); // Vital for debugging production
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const student = await Student.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!student || !student.resetPasswordOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request or OTP expired." });
    }

    // 1. Check Expiry
    if (student.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    // 2. Verify OTP
    const isMatch = await bcrypt.compare(otp, student.resetPasswordOtp);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP code." });
    }

    // 3. Update Password & Clear OTP Fields
    student.password = await bcrypt.hash(newPassword, 10);
    student.resetPasswordOtp = undefined;
    student.resetPasswordExpires = undefined;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during reset." });
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

    res.json({ success: true, student });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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

    res.json({ success: true, message: "Profile updated.", student });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
    res.json({ success: true, problems });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
    if (lastProblem?.problemID?.startsWith("P-")) {
      const n = parseInt(lastProblem.problemID.replace("P-", ""), 10);
      if (!isNaN(n)) nextIdNumber = n + 1;
    }

    const newProblem = await Problem.create({
      problemID: `P-${nextIdNumber.toString().padStart(4, "0")}`,
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

    res.status(201).json({
      success: true,
      message: "Problem submitted. Pending admin review.",
      problemID: newProblem.problemID,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const joinProblem = async (req, res) => {
  try {
    const { id: problemId } = req.params;
    const studentId = req.studentId;
    const role = req.body?.role || "Contributor";

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

    const student = await Student.findById(studentId);
    if (student) {
      if (!student.projects.includes(project._id)) {
        student.projects.push(project._id);
      }
      const exists = student.projectWiseContribution.find(
        (p) => p.project.toString() === project._id.toString(),
      );
      if (!exists) {
        student.projectWiseContribution.push({
          project: project._id,
          contributionScore: 0,
          tasksCompleted: 0,
          role,
        });
      }
      await student.save();
    }

    res.json({
      success: true,
      message: "Successfully joined the project pipeline!",
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
          "problemID title category theme description tags ownerName organization contactInfo Phone department",
      })
      .populate({
        path: "contributors",
        select: "name email branch department",
      })
      .populate({
        path: "coordinators",
        select: "name email phone college branch department",
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

    res.json({ success: true, count: enriched.length, projects: enriched });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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

    res.json({ success: true, count: logs.length, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
      return res
        .status(400)
        .json({ success: false, message: "This task is not published yet." });
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
        message: "You must join this project before claiming its tasks.",
      });

    const student = await Student.findById(req.studentId).select("name");
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    const activeLogs = await Log.countDocuments({
      contributorID: req.studentId,
      task_status: { $in: ["assigned", "pending"] },
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
      note: `Task claimed by ${student.name}. Deadline: ${deadlineAt.toISOString()}`,
      by: req.studentId.toString(),
    });
    await log.save();

    await Student.findByIdAndUpdate(req.studentId, {
      $addToSet: { logs: log._id },
    });

    res.json({
      success: true,
      message: `Task initiated! You have ${log.deadlineDays} day(s) to complete it.`,
      log,
      deadlineAt,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const markLogComplete = async (req, res) => {
  try {
    const { githubPrLink, closureNote } = req.body;

    if (!githubPrLink)
      return res.status(400).json({
        success: false,
        message: "A GitHub PR or commit link is required to submit your work.",
      });

    const log = await Log.findOne({
      _id: req.params.logId,
      contributorID: req.studentId,
    });
    if (!log)
      return res.status(404).json({
        success: false,
        message: "Log not found or not assigned to you.",
      });

    if (log.task_status !== "assigned")
      return res.status(400).json({
        success: false,
        message:
          log.task_status === "pending"
            ? "You have already submitted this task. Awaiting admin review."
            : "Only assigned tasks can be submitted for review.",
      });

    log.task_status = "pending";
    log.githubPrLink = githubPrLink;
    if (closureNote) log.closureNote = closureNote;
    log.actions.push({
      actionType: "submitted_for_review",
      note: `Submitted by student. PR: ${githubPrLink}. Note: ${closureNote || "—"}`,
      by: req.studentId.toString(),
    });
    await log.save();

    res.json({
      success: true,
      message:
        "Work submitted successfully! Awaiting admin review and point award.",
      log,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD  —  GET /api/student/dashboard
// ═════════════════════════════════════════════════════════════════════════════

export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.studentId)
      .select("-password -resetPasswordOtp -resetPasswordExpires")
      .populate({
        path: "projects",
        select:
          "projectID problem projectProgressRate contributors coordinators logs is_blocked resourcesLink communityLink githubRepoLink liveHostedLink totalTasksCreated totalTasksCompleted totalPointsDistributed",
        populate: [
          {
            path: "problem",
            select:
              "problemID title category theme tags description ownerName organization contactInfo Phone department",
          },
          {
            // Populate contributors with enough detail for the contributor list UI
            path: "contributors",
            select: "name email branch department",
          },
          {
            // ── NEW: populate coordinators so the frontend can show name/email/phone ──
            path: "coordinators",
            select: "name email phone college branch department",
          },
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
    const totalScore = student.totalScore || 0;

    const completedLogs = logs.filter((l) => l.task_status === "completed");
    const assignedLogs = logs.filter(
      (l) => l.task_status === "assigned" || l.task_status === "pending",
    );
    const terminatedLogs = logs.filter((l) => l.task_status === "terminated");
    const totalPoints = completedLogs.reduce(
      (a, l) => a + (l.assignedTaskPoints || 0),
      0,
    );

    // ── Build enriched projects with per-student contribution stats ──────────
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
          // coordinators is already populated via mongoose above — included in spread
        };
      })
      .sort((a, b) => b.myScore - a.myScore);

    const projectIds = (student.projects || []).map((p) => p._id);

    // ── Open (claimable) logs for this student's projects ────────────────────
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

    // ── Global ranking ────────────────────────────────────────────────────────
    const allStudents = await Student.find({ isBlocked: false })
      .select("name totalScore totalTasksCompleted department")
      .lean();

    const ranked = allStudents
      .map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        department: s.department,
        totalScore: s.totalScore || 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    const myRank =
      ranked.findIndex((s) => s._id === req.studentId.toString()) + 1;
    const top10 = ranked.slice(0, 10);

    res.json({
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
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═════════════════════════════════════════════════════════════════════════════

export const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const students = await Student.find({ isBlocked: false })
      .select(
        "name email department college branch program totalScore totalTasksCompleted githubLink",
      )
      .sort({ totalScore: -1, totalTasksCompleted: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalStudents = await Student.countDocuments({ isBlocked: false });

    const now = new Date();
    const day = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
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
    if (topProjectAgg.length) {
      const proj = await Project.findById(topProjectAgg[0]._id).populate(
        "problem",
        "title theme category",
      );
      if (proj)
        topProject = {
          _id: proj._id,
          projectID: proj.projectID,
          problemTitle: proj.problem?.title,
          theme: proj.problem?.theme,
          weekPoints: topProjectAgg[0].weekPoints,
          weekTasks: topProjectAgg[0].tasks,
        };
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
    if (topCoordAgg.length && topCoordAgg[0]._id) {
      const admin = await Admin.findById(topCoordAgg[0]._id).select(
        "name email college department",
      );
      if (admin)
        topCoordinator = {
          _id: admin._id,
          name: admin.name,
          college: admin.college,
          weekPoints: topCoordAgg[0].weekPoints,
          weekTasks: topCoordAgg[0].tasks,
        };
    }

    res.json({
      success: true,
      leaderboard: students,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
      },
      topProject,
      topCoordinator,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// ONE-TIME SCORE SYNC  —  POST /api/student/sync-scores
// ═════════════════════════════════════════════════════════════════════════════

export const syncAllStudentScores = async (req, res) => {
  try {
    const students = await Student.find({}).select(
      "_id projectWiseContribution totalScore totalTasksCompleted",
    );

    let updated = 0;

    for (const student of students) {
      const totalScore = (student.projectWiseContribution || []).reduce(
        (sum, c) => sum + (c.contributionScore || 0),
        0,
      );
      const totalTasksCompleted = (
        student.projectWiseContribution || []
      ).reduce((sum, c) => sum + (c.tasksCompleted || 0), 0);

      if (
        student.totalScore !== totalScore ||
        student.totalTasksCompleted !== totalTasksCompleted
      ) {
        await Student.findByIdAndUpdate(student._id, {
          $set: { totalScore, totalTasksCompleted },
        });
        updated++;
      }
    }

    res.json({
      success: true,
      message: `Score sync complete. ${updated} student(s) updated out of ${students.length} total.`,
      updated,
      total: students.length,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const getPublishedNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isPublished: true }).sort({
      isPinned: -1,
      createdAt: -1,
    });
    res.json({ success: true, count: notifications.length, notifications });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

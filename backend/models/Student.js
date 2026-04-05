import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },

    usn: { type: String, trim: true, default: "" },
    semester: { type: String, trim: true, default: "" },

    department: { type: String, trim: true, default: "" },
    program: { type: String, trim: true, default: "" },
    branch: { type: String, trim: true, default: "" }, // ← ADDED
    college: { type: String, trim: true, default: "" },
    githubLink: { type: String, trim: true, default: "" }, // ← ADDED

    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],

    // Per-project contribution breakdown
    projectWiseContribution: [
      {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        contributionScore: { type: Number, default: 0 },
        tasksCompleted: { type: Number, default: 0 },
        role: { type: String, default: "Contributor" },
        description: { type: String, default: "" },
      },
    ],

    // Denormalised aggregates for O(1) leaderboard sort
    totalScore: { type: Number, default: 0 },
    totalTasksCompleted: { type: Number, default: 0 },

    resetPasswordOtp: { type: String },
    resetPasswordExpires: { type: Date },

    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
  },
  { timestamps: true },
);

studentSchema.index({ totalScore: -1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;

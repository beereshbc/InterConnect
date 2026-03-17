import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "", // Can store a Cloudinary/S3 URL here
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    githubLink: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    program: {
      type: String, // e.g., B.Tech, MCA
      trim: true,
    },
    branch: {
      type: String, // e.g., CSE, ISE, ECE
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },

    // 1. Array of Project References (For easy population)
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // Must exactly match the name of your Project model
      },
    ],

    // 2. Project-wise contribution tracking
    projectWiseContribution: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
        contributionScore: { type: Number, default: 0 },
        role: { type: String },
        description: { type: String },
      },
    ],
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // Activity Logs (Populated from a Log model)
    logs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Log",
      },
    ],
  },

  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

const Student = mongoose.model("Student", studentSchema);

export default Student;

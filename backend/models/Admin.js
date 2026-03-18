import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "", // Stores URL to profile picture
    },
    githubLink: {
      type: String,
      trim: true,
    },
    program: {
      type: String, // e.g., "B.Tech", "Staff Development"
    },
    college: {
      type: String,
      required: true,
    },
    branch: {
      type: String, // e.g., "CSE", "ISE"
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // --- Metrics & Activity Tracking ---
    // Reference to projects this admin is coordinating
    managedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    // Tracks how many logs/tasks this admin has initialized
    totalTaskCreated: {
      type: Number,
      default: 0,
    },

    // Can represent administrative points or points distributed to students
    totalPoints: {
      type: Number,
      default: 0,
    },

    // Role-based access control (optional but recommended)
    role: {
      type: String,
      enum: ["admin", "super-admin", "coordinator"],
      default: "admin",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

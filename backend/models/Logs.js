import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // Reference to a Problem/Task ID
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem", // Assuming you have a Problem model
      required: true,
    },

    githubIssueLink: {
      type: String,
      required: true,
      trim: true,
    },

    assignedTaskPoints: {
      type: Number,
      default: 0,
    },

    // The Student who is doing the work
    contributorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // The person (Admin/Lead) who assigned or coordinates the task
    task_coordinator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Or "Student" if peer-coordinated
      required: true,
    },

    // String version of the contributor name for quick display
    task_contributor: {
      type: String,
      required: true,
    },

    task_status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Captures created_at (log time) and updated_at
  },
);

const Log = mongoose.model("Log", logSchema);

export default Log;

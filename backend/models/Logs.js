import mongoose from "mongoose";

/**
 * Log Lifecycle:
 *   open → (student self-assigns) → assigned → (student submits) → pending → (admin closes) → completed
 *   open | assigned | pending → (admin terminates) → terminated
 *   terminated → (admin reopens) → open
 */

const actionSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: [
        "opened", // Admin created the log
        "published", // Admin published (made visible)
        "unpublished", // Admin unpublished (hidden)
        "self_assigned", // Student claimed the task
        "submitted_for_review", // Student marked complete, awaiting admin
        "completed", // Admin verified and closed
        "terminated", // Admin/system terminated
        "reopened", // Admin reopened a terminated log
        "updated", // Admin edited log details
      ],
      required: true,
    },
    note: { type: String, default: "" },
    by: { type: String, default: "" }, // userId or "system"
  },
  { _id: false, timestamps: true },
);

const logSchema = new mongoose.Schema(
  {
    taskTitle: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    githubIssueLink: { type: String, required: true, trim: true },
    githubPrLink: { type: String, trim: true, default: "" },
    closureNote: { type: String, default: "" },

    assignedTaskPoints: { type: Number, default: 10 },

    contributorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    task_contributor: { type: String, default: "" }, // Cached name for speed

    task_coordinator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    /**
     * Status machine:
     *   open → assigned → pending → completed
     *   open | assigned | pending → terminated
     *   terminated → open (reopen)
     */
    task_status: {
      type: String,
      enum: ["open", "assigned", "pending", "completed", "terminated"],
      default: "open",
    },

    isPublished: { type: Boolean, default: false },

    deadlineDays: { type: Number, default: 7, min: 1 },
    deadlineAt: { type: Date, default: null },
    assignedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },

    reopenCount: { type: Number, default: 0 },
    actions: { type: [actionSchema], default: [] },
  },
  { timestamps: true },
);

// Compound indexes for common query patterns
logSchema.index({ task_status: 1, deadlineAt: 1 });
logSchema.index({ projectId: 1, isPublished: 1, task_status: 1 });
logSchema.index({ contributorID: 1, task_status: 1 });
logSchema.index({ task_coordinator_id: 1, task_status: 1 });

const Log = mongoose.model("Log", logSchema);
export default Log;

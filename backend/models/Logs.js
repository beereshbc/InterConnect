import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: [
        "opened",
        "published",
        "unpublished",
        "self_assigned",
        "completed",
        "terminated",
        "reopened",
        "updated",
      ],
      required: true,
    },
    note: { type: String, default: "" },
    by: { type: String, default: "" },
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

    task_coordinator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // open → assigned → completed | terminated
    task_status: {
      type: String,
      enum: ["open", "assigned", "completed", "terminated"],
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

logSchema.index({ task_status: 1, deadlineAt: 1 });
logSchema.index({ projectId: 1, isPublished: 1, task_status: 1 });
logSchema.index({ contributorID: 1, task_status: 1 });

const Log = mongoose.model("Log", logSchema);
export default Log;

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectID: {
      type: String,
      unique: true,
      default: () => `PROJ-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
    coordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    topContributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],

    githubRepoLink: { type: String, required: true, trim: true },
    liveHostedLink: { type: String, trim: true, default: "" },
    resourcesLink: { type: String, trim: true, default: "" },
    communityLink: { type: String, trim: true, default: "" },
    projectDescription: { type: String, required: true },

    // Auto-recalculated on every log status change via syncProjectStats()
    projectProgressRate: { type: Number, default: 0, min: 0, max: 100 },
    totalTasksCreated: { type: Number, default: 0 },
    totalTasksCompleted: { type: Number, default: 0 },
    totalPointsDistributed: { type: Number, default: 0 },

    is_blocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectSchema.index({ logs: 1 });
projectSchema.index({ problem: 1 });
projectSchema.index({ contributors: 1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;

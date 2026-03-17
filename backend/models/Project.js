import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Custom Project ID
    projectID: {
      type: String,
      unique: true,
      default: () => `PROJ-${Math.floor(100000 + Math.random() * 900000)}`,
    },

    // Reference to the original Problem this project is solving
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    // Array of Student Contributors
    contributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // The core requirement: Storing 1000+ logs via references
    logs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Log",
      },
    ],

    githubRepoLink: {
      type: String,
      required: true,
      trim: true,
    },

    liveHostedLink: {
      type: String,
      trim: true,
    },

    // Array of Coordinators (Can be Admins or Senior Students)
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", // Assuming you have an Admin model
      },
    ],

    projectDescription: {
      type: String,
      required: true,
    },

    // Visual percentage (e.g., 75 for 75%)
    projectProgressRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Array of top performers for this specific project
    topContributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Tracks project creation and last update
  },
);

// Indexing logs for faster lookups since you expect high volume (1000+)
projectSchema.index({ logs: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;

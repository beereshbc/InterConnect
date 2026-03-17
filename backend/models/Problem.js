import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    // Custom Problem ID (e.g., PRB-1024)
    problemID: {
      type: String,
      unique: true,
      default: () => `PRB-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    theme: {
      type: String, // e.g., Sustainability, AI, FinTech
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Tracking the Students working on this specific problem
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // External Info (The client/company providing the problem)
    ownerName: {
      type: String,
      required: true,
    },

    organization: {
      type: String,
      required: true,
    },

    department: {
      type: String,
    },

    contactInfo: {
      type: String, // Email or Phone of the external owner
    },

    // The coordinator from the external organization
    problem_coordinator: {
      type: String,
      required: true,
    },
    is_published: {
      type: Boolean,
      default: false,
    },

    // Actions could track history or specific requirements
    actions: [
      {
        actionType: String,
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  {
    timestamps: true, // Tracks when the problem was posted and last updated
  },
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

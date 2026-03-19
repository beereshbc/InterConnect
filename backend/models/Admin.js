import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String, default: "" },
    githubLink: { type: String, trim: true },
    program: { type: String },
    college: { type: String, required: true },
    branch: { type: String },
    isBlocked: { type: Boolean, default: false },

    resetPasswordOtp: { type: String },
    resetPasswordExpires: { type: Date },

    managedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],

    // Incremented on createLog
    totalTaskCreated: { type: Number, default: 0 },

    // Incremented by assignedTaskPoints whenever a log they created is closed
    totalPoints: { type: Number, default: 0 },

    // Sum of all task points ever allocated (on create)
    totalPointsAllocated: { type: Number, default: 0 },

    role: {
      type: String,
      enum: ["admin", "super-admin", "coordinator"],
      default: "admin",
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

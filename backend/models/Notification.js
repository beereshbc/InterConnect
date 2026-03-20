import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "update", "alert", "success"],
      default: "info",
    },
    isPublished: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false }, // Prevents spamming on re-publish
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);

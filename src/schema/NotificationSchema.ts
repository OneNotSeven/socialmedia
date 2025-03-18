import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" }, // Post owner
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" },  // Commenter/Liker
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "contentdatas" },
  type: { type: String, enum: ["comment", "like"], required: true },
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const NotificationModels=mongoose.models.notificationdatas || mongoose.model("notificationdatas", NotificationSchema);

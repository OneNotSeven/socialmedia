import mongoose from "mongoose";
import { EcomSchema } from "./signupSchema";

const communityModel = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: EcomSchema, required: true },
    branchName: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: EcomSchema }],
    allowMessage: { type: Boolean, default: false },
    request: [{ 
        userId: mongoose.Schema.Types.ObjectId,
        name: String,
        profilePic: String,
        email: String,
        username: String
    }],
    blockUser: [{ type: mongoose.Schema.Types.ObjectId, ref: EcomSchema }],
    verified: { type: Boolean, default: false }
});

// **Middleware to ensure adminId is always in members**
communityModel.pre("save", function (next) {
    if (!this.members.includes(this.adminId)) {
        this.members.push(this.adminId);
    }
    next();
});


export const communitySchema = mongoose.models.appcommunitydatas || mongoose.model("appcommunitydatas", communityModel);

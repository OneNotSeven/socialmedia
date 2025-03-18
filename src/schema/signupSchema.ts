import mongoose from "mongoose";

const signupModel = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true }, // Unique auto-generated username
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: String,
    contact: Number,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "contentdatas" }],
    profilePic: String,
    coverPic: String,
    bio: String,
    website:String,
    profession: String,
    projects: [{
        projectname: String,
        projectlink: String,
        projectdesc:String,
    }],
    skills:[{skill:String}],
    sociallinks: [{
        platform: String,
        link: String,
    }],
    community: [{ type: Array }],
    isVerified:{type:Boolean,default:false}
});

// Function to generate a unique username
const generateUsername = async (name:any) => {
    const baseUsername = name.toLowerCase().replace(/\s+/g, ""); // Remove spaces
    let uniqueUsername;
    let isUnique = false;

    while (!isUnique) {
        const randomNum = Math.floor(10000 + Math.random() * 90000); // Generate 5-digit random number
        uniqueUsername = `@${baseUsername}${randomNum}`;
        
        // Check if username already exists
        const existingUser = await mongoose.models.appuserdatas.findOne({ username: uniqueUsername });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return uniqueUsername;
};

// Generate a unique username before saving
signupModel.pre("save", async function (next) {
    if (!this.username) {
        this.username = await generateUsername(this.name);
    }
    next();
});

export const EcomSchema = mongoose.models.appuserdatas || mongoose.model("appuserdatas", signupModel);

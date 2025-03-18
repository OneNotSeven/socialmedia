import mongoose from "mongoose"


const contentModel = new mongoose.Schema({
    
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" },
    text: String,
    hashtags: [{ type: Array }],
    image: String,
    video: String,
    likes: [{userId: { type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" } , date: { type: Date, default: Date.now }}],
    comments: [{userId: { type: mongoose.Schema.Types.ObjectId, ref: "appuserdatas" } ,text:String, date: { type: Date, default: Date.now }}],
    shares: [{type:Array}],
    private: { type:Boolean,default:false },
    friend:{type:Boolean,default:false}
    

    
},{ timestamps: true })

export const content=mongoose.models.contentdatas ||  mongoose.model("contentdatas",contentModel)
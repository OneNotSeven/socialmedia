import { EcomSchema } from "@/schema/signupSchema"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req:Request):Promise<NextResponse> {
    try {
        const editUpdate = await req.json()
        console.log("retee",editUpdate)
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        if (editUpdate.updateDetails.username) {
            
            const existingUser = await EcomSchema.findOne({ 
                username:editUpdate.updateDetails.username, 
                _id: { $ne: editUpdate.userId }  // Exclude the current user from the check
            });
            if (existingUser) {
                return NextResponse.json({error:"user", message: "Username already exists", success: false }, { status: 400 });
            }
        }
        
        
        const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $set: { ...editUpdate.updateDetails } })
        if (editUpdate) {
            const userInfo=await EcomSchema.find({_id:editUpdate.userId})
            return NextResponse.json({ data: userInfo, message: "success", success: true }, { status: 200 })
        }
        return NextResponse.json({message:"fail",success:false},{status:500})
        
    } catch (error) {
        return NextResponse.json({message:"failed",success:false},{status:500})
    }
   
}

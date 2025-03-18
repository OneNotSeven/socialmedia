import { EcomSchema } from "@/schema/signupSchema"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req:Request):Promise<NextResponse> {
    try {
        const editUpdate = await req.json()
        const { updatepoint }: any = await editUpdate
        console.log("retee", editUpdate)
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        if (updatepoint == "projects") {
           
            const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $push: { projects: editUpdate.updateDetails } })
        } else if(updatepoint=="skills") {
            const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $push: { skills: editUpdate.updateDetails } })
        } else if (updatepoint == "sociallinks") {
            const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $push: { sociallinks: editUpdate.updateDetails } })
        }
        
        
        if (editUpdate) {
            const userInfo=await EcomSchema.find({_id:editUpdate.userId})
            return NextResponse.json({ data: userInfo, message: "success", success: true }, { status: 200 })
        }
        return NextResponse.json({message:"fail",success:false},{status:500})
        
    } catch (error) {
        return NextResponse.json({message:"failed",success:false},{status:500})
    }
   
}


export async function DELETE(req:Request):Promise<NextResponse> {
    try {
        const editUpdate = await req.json()
        const { updatepoint }: any = await editUpdate
        console.log("del retee", editUpdate)
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        if (updatepoint == "projects") {
           
            const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $pull: { "projects": { _id: editUpdate.removeId } } })
        } else if(updatepoint=="skills") {
            const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $pull: { "skills": { _id: editUpdate.removeId } } })
        } else if (updatepoint == "sociallinks") {
            const editUpdated = await EcomSchema.updateOne({ _id: editUpdate.userId }, { $pull: { "sociallinks": { _id: editUpdate.removeId } } })
        }
        
        
        if (editUpdate) {
            const userInfo=await EcomSchema.find({_id:editUpdate.userId})
            return NextResponse.json({ data: userInfo, message: "success", success: true }, { status: 200 })
        }
        return NextResponse.json({message:"fail",success:false},{status:500})
        
    } catch (error) {
        return NextResponse.json({message:"failed",success:false},{status:500})
    }
   
}

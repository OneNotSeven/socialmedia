import { content } from "@/schema/content"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req: Request):Promise<NextResponse> {
    try {
        const { contentId } = await req.json()
    
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const gett = await content.find({ _id: contentId }).populate("comments.userId","_id name email username profilePic").exec()
    return NextResponse.json({data:gett,message:"gtting comment successfully",success:true},{status:200})
    } catch (error) {
        return NextResponse.json({message:"comment not found",success:false},{status:500})
    }
    
}
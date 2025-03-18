import { content } from "@/schema/content";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
   try {
       const { contentid } = await req.json()
       console.log("connnnntent",contentid)
       
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const contentRes = await content.find({ _id: contentid }).populate("adminId", "_id name email username profilePic isVerified").populate("comments.userId","_id name email isVerified username profilePic").exec()
    return NextResponse.json({data:contentRes,message:"get content successfully",success:true},{status:200})
   } catch (error) {
    return NextResponse.json({message:"comment error",success:false},{status:500})
   }
    
}
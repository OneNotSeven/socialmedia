import { content } from "@/schema/content";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
   try {
       const { userId, contentId, comment } = await req.json()
       
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const saveComment = await content.updateOne({ _id: contentId }, { $push: { comments: { userId: userId, text: comment } } })
    return NextResponse.json({message:"comment add successfully",success:true},{status:200})
   } catch (error) {
    return NextResponse.json({message:"comment error",success:false},{status:500})
   }
    
}
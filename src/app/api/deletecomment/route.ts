import { content } from "@/schema/content";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
   try {
       const { contentId, commentId } = await req.json()
       
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const saveComment = await content.updateOne({ _id: contentId }, { $pull: { comments: { _id: commentId } } })
    return NextResponse.json({message:"comment add successfully",success:true},{status:200})
   } catch (error) {
    return NextResponse.json({message:"comment error",success:false,errors:error},{status:500})
   }
    
}
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server"

export async function POST(req: Request): Promise<NextResponse>{
    const userId:string=await req.json()
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);
    const userInfo=await EcomSchema.find({_id:userId}).populate({
        path: "chatArray", // Populating followers (IDs -> full user details)
        model: "appuserdatas",
        select: "_id name bio username profilePic isVerified", // Select relevant fields
    }).select("-password")
    return NextResponse.json({message:"successful",success:true,data:userInfo},{status:200})
}

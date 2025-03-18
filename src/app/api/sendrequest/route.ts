import { communitySchema } from "@/schema/communitySchema";
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId, adminId } = await req.json()
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        if (!adminId && !userId) {
            return NextResponse.json({ message: "something went wrong", success: false }, {status:500})
        }
        const getUserInfo = await EcomSchema.find({ _id: userId })
        if (getUserInfo.length > 0) {
            const addRequest=await communitySchema.updateOne({_id:adminId},{$push:{request:{userId:userId,name:getUserInfo[0].name,email:getUserInfo[0].email,profilePic:getUserInfo[0].profilePic,username:getUserInfo[0].username}}})
        }
        return NextResponse.json({ message: "successfully request", success: true }, {status:200})
    } catch (error) {
        return NextResponse.json({ message: "something went wrong", success: false }, {status:500})
    }
    
}
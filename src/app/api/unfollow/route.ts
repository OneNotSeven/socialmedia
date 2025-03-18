import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId, authuser} = await req.json()
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        const following = await EcomSchema.updateOne({ _id: authuser }, { $pull: { following: userId } })
        const followers = await EcomSchema.updateOne({ _id: userId }, { $pull: { followers: authuser } })
        if (following && followers) {
            return NextResponse.json({message:"successfully followed",success:true},{status:200})
        }
        return NextResponse.json({message:"unknown error",success:false},{status:500})
    } catch (error) {
        return NextResponse.json({message:"error",success:false},{status:500})
    }
    
}
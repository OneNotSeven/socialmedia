import { communitySchema } from "@/schema/communitySchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { adminId, userId } = await req.json()
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    if (!adminId && userId) {
        return NextResponse.json({message:"accept denied",success:false},{status:500})
    }
        
            
        const updateRequest = await communitySchema.updateOne({ _id: adminId }, { $pull: { request: { userId: userId } } })
            
        
    return NextResponse.json({message:"deny successfull",success:true},{status:200})
        
    } catch (error) {
        return NextResponse.json({message:"denying something went wrong",success:false},{status:404})
    }
    
}
import { communitySchema } from "@/schema/communitySchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { communityId, userId } = await req.json()
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    if (!communityId && !userId) {
        return NextResponse.json({message:"accept denied",success:false},{status:500})
    }
      
            
            const leaveCommunity = await communitySchema.updateOne({ _id: communityId }, { $pull: { members: userId  } })
            
     
    return NextResponse.json({message:"community leave successfull",success:true},{status:200})
        
    } catch (error) {
        return NextResponse.json({message:"unknow error",success:false},{status:500})
    }
    
}
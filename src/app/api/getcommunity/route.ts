import { communitySchema } from "@/schema/communitySchema";
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId } = await req.json()
        console.log("final build community",userId)
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        const AllCommunity = await communitySchema.find({ adminId: userId }).populate(
            {
                path: "members",
                model: EcomSchema, // Ensure this model exists
                select: "username profilePic",
                options:{limit:3}
              })
        return NextResponse.json({ data: AllCommunity, message: "gettiong succesful", success: true }, { status: 200 })
        
    } catch (error) {
 return NextResponse.json({message:"something went wrong",success:false},{ status:500})       
    }
    
}
import { communitySchema } from "@/schema/communitySchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { communityId } = await req.json();
        console.log("final single community", communityId);
        
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);
        
        const SingleCommunity = await communitySchema
            .findById( communityId )
            .populate("adminId", "name username profilePic isVerified") // Populate admin details
            .populate("members", "_id name username isVerified profilePic bio"); // Populate members
        
        return NextResponse.json(
            { data: SingleCommunity, message: "getting successful", success: true },
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            { message: "something went wrong", success: false },
            { status: 500 }
        );
    }
}

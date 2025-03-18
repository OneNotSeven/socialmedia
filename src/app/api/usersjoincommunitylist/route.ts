
import mongoose from "mongoose";
import  { Types } from "mongoose";
import { NextResponse } from "next/server";
import { communitySchema } from "@/schema/communitySchema";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId }: { userId: string } = await req.json();

        // Ensure database connection
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);
        }

        // Convert userId to ObjectId
        const userObjectId = new Types.ObjectId(userId);
console.log("bobject iddmdnsjhddudgsdg",userId)
        // Find communities where user is a member but NOT the admin
        const communityList = await communitySchema.find({
            members:  userId, 
            adminId: { $ne: userId } 
        });

        return NextResponse.json({ success: true, data: communityList });
    } catch (error) {
        return NextResponse.json({ success: false, error: "error"}, { status: 500 });
    }
}

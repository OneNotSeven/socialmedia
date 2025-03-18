import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId } = await req.json();
        
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        // Find the current user to get their following list
        const currentUser = await EcomSchema.findById(userId).select("following");

        if (!currentUser) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        // MongoDB aggregation to fetch random users (excluding following + self)
        const suggestedUsers = await EcomSchema.aggregate([
            { $match: { _id: { $nin: [...currentUser.following,new mongoose.Types.ObjectId(userId) ] } } },
            { $sample: { size: 50 } }, // Fetch 10 random users (change size as needed)
            { $project: { password: 0 } } // Exclude password field
        ]);

        return NextResponse.json({ message: "Users fetched successfully", success: true, data: suggestedUsers }, { status: 200 });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Error fetching users", success: false }, { status: 500 });
    }
}

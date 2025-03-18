import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { content } from "@/schema/content";
import { EcomSchema } from "@/schema/signupSchema";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const  userId  = await req.json();
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        // Find user and check if it exists
        const user = await EcomSchema.findById(userId).select("following").lean();

        if (!user || !("following" in user) || !Array.isArray(user.following)) {
            return NextResponse.json({ message: "User not found or not following anyone", success: false }, { status: 404 });
        }

        // Explicitly type following as an array of ObjectId
        const followingIds: Types.ObjectId[] = user.following.map((follow: any) => new Types.ObjectId(follow));

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch today's posts from users they are following
        const contents = await content
            .find({ 
                adminId: { $in: followingIds },
                createdAt: { $gte: today, $lt: tomorrow } // Filter only today's posts
            })
            .populate("adminId", "_id name email username profilePic")
            .exec();

        return NextResponse.json({ data: contents, message: "Fetched today's content from following users", success: true }, { status: 200 });
    } catch (error) {
        console.error("Error fetching content:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}

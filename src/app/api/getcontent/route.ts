import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { content } from "@/schema/content";
import { EcomSchema } from "@/schema/signupSchema";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId, page = 1, limit = 10 } = await req.json();
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        // Get user following list
        const user: any = await EcomSchema.findById(userId).select("following").lean();
        const followingIds: Types.ObjectId[] = user?.following?.map((follow: string) => new Types.ObjectId(follow)) || [];

        // Get past 3 days' date range
        const pastThreeDays = new Date();
        pastThreeDays.setDate(pastThreeDays.getDate() - 3);
        pastThreeDays.setHours(0, 0, 0, 0);

        let contents: any = [];

        if (followingIds.length > 0) {
            // Fetch posts from followed users (paginated)
            contents = await content
                .find({
                    adminId: { $in: followingIds, $ne: userId }, // Exclude self
                   
                })
                .populate("adminId", "_id name email username profilePic isVerified")
                .sort({ createdAt: -1 }) // Get latest posts first
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(); // Convert to plain objects
        }

        // If feed is empty or not enough, fetch suggested posts
        if (contents.length < limit) {
            const suggestedContents = await content
                .find({ 
                    adminId: { $ne: userId }, // Exclude self
                    createdAt: { $gte: pastThreeDays } // Get posts from last 3 days
                }) 
                .populate("adminId", "_id name email username profilePic isVerified")
                .sort({ createdAt: -1 }) // Get latest posts first
                .skip((page - 1) * limit)
                .limit(limit - contents.length) // Fill remaining spots
                .lean();

            // Mark suggested posts
            suggestedContents.forEach(post => post.isSuggested = true);
            contents = [...contents, ...suggestedContents]
                .filter((value, index, self) => index === self.findIndex(t => t._id.toString() === value._id.toString())); // Remove duplicates
        }

        return NextResponse.json({
            data: contents,
            message: "Fetched user feed from past 3 days with infinite suggestions",
            success: true,
            page,
            limit,
            hasMore: contents.length === limit, // Ensures infinite scrolling experience
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching content:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}

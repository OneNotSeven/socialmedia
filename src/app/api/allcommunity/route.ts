import { communitySchema } from "@/schema/communitySchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId } = await req.json();
        console.log("Fetching available communities for:", userId);

        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        // Convert `userId` to ObjectId (to match schema reference)
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch communities with filters and randomize the result
        const availableCommunities = await communitySchema.aggregate([
            { $match: { 
                adminId: { $ne: userObjectId }, // Not the admin
                members: { $nin: [userObjectId] }, // Not a member
                "request.userId": { $ne: userObjectId } // No pending request
            }},
            { $sample: { size: 3 } }, // Get 10 random communities (adjust as needed)
            {
                $lookup: {
                    from: "ecomschemas", // Match the actual collection name for EcomSchema
                    localField: "members",
                    foreignField: "_id",
                    as: "membersData"
                }
            },
            {
                $project: {
                    branchName: 1,
                    profileImage: 1,
                    bio: 1,
                    members: { 
                        $slice: ["$membersData", 3] // Limit membersData to 3
                    }
                }
            }
        ]);

        return NextResponse.json(
            { data: availableCommunities, message: "Fetched successfully", success: true },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Error fetching communities:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}

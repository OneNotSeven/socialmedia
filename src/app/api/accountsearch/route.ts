import { communitySchema } from "@/schema/communitySchema";
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { query } = await req.json(); // Extract query from request body
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        if (!query || query.trim() === "") {
            return NextResponse.json({ message: "Query is required" }, { status: 400 });
        }

        // Search users in EcomModel
        const users = await EcomSchema.find({
            $or: [
                { username: { $regex: query, $options: "i" } }, // Case-insensitive search
                { name: { $regex: query, $options: "i" } }
            ]
        })
        .select("_id username isVerified profilePic name bio") // Select specific fields
        .limit(10); // Limit results

        // Search communities in CommunityModel
        const communities = await communitySchema.find({
            branchName: { $regex: query, $options: "i" }
        })
        .select("_id verified branchName bio")
        .limit(10);

        console.log("Users:", users);
        console.log("Communities:", communities);

        // Return combined results
        return NextResponse.json({ users, communities }, { status: 200 });

    } catch (error) {
        console.error("Search Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

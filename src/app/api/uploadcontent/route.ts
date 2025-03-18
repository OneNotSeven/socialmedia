import {content} from "@/schema/content"; // Ensure correct import
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface User {
    adminId: string;
    text: string;
    image?: string;
    video?: string;
    hashtags?: string[];
    likes?: string[];
    comments?: string[];
    shares?: string[];
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
       
        const body: User = await req.json();
        console.log("Received Body:", body);

       
        if (!process.env.NEXT_MONGO_CONNECT) {
            throw new Error("MongoDB connection string is missing");
        }
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        
        const data = new content(body);
        await data.save();

        if (data) {
            const userContent = await EcomSchema.updateOne( { _id: data.adminId },{ $push: { posts: data._id } })
            console.log("user posts",userContent)
        }
        console.log("Saved to Database:", data);

        return NextResponse.json({ message: "Successfully uploaded", success: true }, { status: 200 });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 400 });
    }
}



export async function DELETE(req: Request): Promise<NextResponse> {
    try {
       
        const {postId,userId }=await req.json()
        

       
        if (!process.env.NEXT_MONGO_CONNECT) {
            throw new Error("MongoDB connection string is missing");
        }
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        
        const data = await content.deleteOne({_id:postId});
        

        if (data) {
            const userContent = await EcomSchema.updateOne( { _id: userId },{ $pull: { posts: postId } })
           
        }
        console.log("delete from Database:", data);

        return NextResponse.json({ message: "Successfully deleted", success: true }, { status: 200 });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 400 });
    }
}

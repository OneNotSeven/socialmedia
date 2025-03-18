import { content } from "@/schema/content";
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// export async function POST(req: Request): Promise<NextResponse> {
//     try {
//         const username: string = await req.json()
//         const actualName = username.split("%40")
//         console.log("pdy",actualName)
//     await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
//         const userFind = await EcomSchema.find({ username: `@${actualName[1]}` }).populate("post","").exec()
//         console.log("user found",userFind)
//     if (userFind.length > 0) {
//         return NextResponse.json({data:userFind,message:"successfully getting user",success:true}, { status: 200 })
//     }
//     return NextResponse.json({ message: "dont find any user", success: false }, {status:404})
//     } catch (error) {
//         return NextResponse.json({ message: "dont find any user", success: false }, {status:500})
//     }
    
// }




export async function POST(req: Request): Promise<NextResponse> {
    try {
        const  username:string  = await req.json();

        // Extract actual username after '@'
        const actualName = username.split("%40")[1];

        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        // Find user and populate 'posts' (corrected field name)
        const userFind = await EcomSchema.findOne({ username: `@${actualName}` })
            .populate({
                path: "posts", // ✅ Corrected from 'post' to 'posts'
                model: content, // Make sure it matches your actual model name
                populate: {
                    path: "adminId",
                    model: "appuserdatas",
                    select: "_id name username profilePic isVerified", // Select relevant fields
                },
            }) .populate({
                path: "followers", // Populating followers (IDs -> full user details)
                model: "appuserdatas",
                select: "_id name bio username profilePic isVerified", // Select relevant fields
            })
            .populate({
                path: "following", // Populating following (IDs -> full user details)
                model: "appuserdatas",
                select: "_id name bio username profilePic isVerified",
            })
            .exec();

        if (userFind) {
            return NextResponse.json({ data: userFind, message: "Successfully retrieved user", success: true }, { status: 200 });
        }

        return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}


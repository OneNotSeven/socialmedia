import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req: Request):Promise<NextResponse> {
    try {
        const { myId, chatId }:any = await req.json(); // Extract data

        if (!myId || !chatId) {
            return NextResponse.json({ message: "User IDs are required" }, { status: 400 });
        }

        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
        if (chatId == myId) {
            return NextResponse.json({ message: "You can't chat with yourself" }, { status: 500 })
        }

        const user = await EcomSchema.findById(myId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        // Prevent duplicate chat entries
        if (!user.chatArray.includes(chatId) && myId !== chatId) {
            const pushed = await EcomSchema.updateOne({ _id: myId }, { $push: { chatArray: chatId } })
            const pushed2 = await EcomSchema.updateOne({ _id: chatId }, { $push: { chatArray: myId } })
            
           
            return NextResponse.json({ message: "Chat added successfully",sucess:true }, { status: 200 });
        }
        return NextResponse.json({ message: "Chat not added successfully",sucess:false }, { status: 500 });


    } catch (error) {
        return NextResponse.json({ message: "Server Error", error,success:false }, { status: 500 });
    }
}

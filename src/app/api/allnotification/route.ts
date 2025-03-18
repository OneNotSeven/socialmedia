import { NotificationModels } from "@/schema/NotificationSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId } = await req.json();
        await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

        // 7-day threshold
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch notifications and populate user & content details
        const allNotifications = await NotificationModels.find({ adminId: userId ,userId: { $ne: userId }})
            .populate("userId", "name username profilePic") // Fetch user's details
            .populate("contentId", "_id text") // Fetch only content `_id` & `text`
            .sort({ timestamp: -1 }); // Latest first

        // Categorize based on timestamp
        const newNotifications = allNotifications.filter(notif => notif.timestamp > sevenDaysAgo);
        const oldNotifications = allNotifications.filter(notif => notif.timestamp <= sevenDaysAgo);

        return NextResponse.json(
            { 
                newNotifications, 
                oldNotifications, 
                message: "Notifications fetched successfully", 
                success: true 
            }, 
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching notifications", success: false,error:error }, 
            { status: 500 }
        );
    }
}

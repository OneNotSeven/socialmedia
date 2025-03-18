import { NotificationModels } from "@/schema/NotificationSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: Request):Promise<NextResponse> {
    try {
      
     await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const { adminId, userId, contentId, type, text } = await req.json();

    if (!adminId || !userId || !contentId || !type) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newNotification =  new NotificationModels({
      adminId,
      userId,
      contentId,
      type,
      text,
      timestamp: new Date(),
    });

        await newNotification.save()
    return NextResponse.json({ success: true, message: "Notification saved", data: newNotification }, { status: 201 });
  } catch (error) {
    console.error("Error saving notification:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const adminId = req.nextUrl.searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json({ success: false, message: "adminId is required" }, { status: 400 });
    }

    const notifications = await NotificationModels.find({ adminId }).sort({ timestamp: -1 });

    return NextResponse.json({ success: true, data: notifications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}



export async function DELETE(req: Request):Promise<NextResponse> {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json({ success: false, message: "notificationId is required" }, { status: 400 });
    }

      const deletedNotification = await NotificationModels.find({userId: notificationId });

    if (!deletedNotification) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Notification removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

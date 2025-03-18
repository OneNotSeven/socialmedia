import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { EcomSchema } from "@/schema/signupSchema";
import { appBaseUrl } from "@/schema/appurl";
import nodemailer from "nodemailer";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email } = await req.json();
    
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);
    
    const schemaEmailVerify = await EcomSchema.find({ email });
    if (!schemaEmailVerify.length) {
      throw new Error("Email not found");
    }

    // Generate JWT token valid for 5 minutes
    const auth_token = jwt.sign(
      { userId: schemaEmailVerify[0]._id, email: schemaEmailVerify[0].email },
      process.env.NEXT_SECRET_TOKEN_KEY as string,
      { expiresIn: "1d" }
    );

    // Create the NextResponse object
    const response = NextResponse.json(
      { message: "verified", success: true },
      { status: 200 }
    );

    // Set authentication cookie
    response.cookies.set({
      name: "authtoken",
      value: auth_token,
      httpOnly: true,
      secure: true,
      path: "/",
    });

    // Generate password reset link
    const link = `${appBaseUrl}/forgetpassword/${auth_token}/${schemaEmailVerify[0]._id}`;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "theflutebro@gmail.com",
        pass: process.env.NEXT_EMAIL_PASS as string,
      },
    });

    // Email options
    const mailOptions = {
      from: '"Twins" <theflutebro@gmail.com>',
      to: schemaEmailVerify[0].email,
      subject: "Reset Password (Valid for 5 minutes)",
      text: `Click the link to reset your password: ${link}`,
    };

    // Send email
    await transporter.sendMail(mailOptions).catch((error:any) => {
      console.error("Email send error:", error);
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Email not found", success: false },
      { status: 500 }
    );
  }
}

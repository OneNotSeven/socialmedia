import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { EcomSchema } from "@/schema/signupSchema";

interface UserDetail {
  email: string;
  password: string;
}

export function GET() {
  return NextResponse.json({ message: "working", success: true }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const userdetail: UserDetail = await request.json();
    const email: string = userdetail.email;

    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

    const emailchecker = await EcomSchema.find({ email });

    if (emailchecker.length <= 0) {
      userdetail.password = bcrypt.hashSync(userdetail.password, 10);

      const data = new EcomSchema(userdetail);
      await data.save();

      const objectIdAsString = data._id.toString();

      const auth_token = jwt.sign(
        { userid: objectIdAsString },
        process.env.NEXT_SECRET_TOKEN_KEY as string
      );

      const response = NextResponse.json({ message: "connected", success: true }, { status: 200 });

      response.cookies.set("authtoken", auth_token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60, // 1 day in seconds
      });

      return response;
    } else {
      throw new Error("email already registered");
    }
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message, success: false }, { status: 201 });
  }
}

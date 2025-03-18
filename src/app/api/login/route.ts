import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { EcomSchema } from "@/schema/signupSchema";

interface CompData {
  email: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const comp_data: CompData = await request.json();

    // Connect to the database
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string);

    const email: string = comp_data.email;
    const comp = await EcomSchema.find({ email });

    if (comp.length === 0) {
      throw new Error("Email not found");
    }

    const objectId = comp[0]._id;
    const objectIdAsString = objectId.toString();

    const matched = bcrypt.compareSync(comp_data.password, comp[0].password);

    if (!matched) {
      throw new Error("Incorrect password");
    }

    const auth_token = jwt.sign(
      { userid: objectIdAsString },
      process.env.NEXT_SECRET_TOKEN_KEY as string
    );

    const response = NextResponse.json({ message: "successful", success: true }, { status: 200 });

    response.cookies.set("authtoken", auth_token, {
        maxAge: 24 * 60 * 60,
      httpOnly: true,
      secure: true,
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, success: false },
      { status: 401 }  // 401 for Unauthorized (better than 201 for failed login)
    );
  }
}

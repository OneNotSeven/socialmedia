import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function POST() {

    try {
        const cookiesInstance = await cookies()
    const token = cookiesInstance.get("authtoken")?.value
    // console.log("hgt:",token)
    const secretKey = process.env.NEXT_SECRET_TOKEN_KEY as string;
    var decoded = jwt.verify(token as string, secretKey) as JwtPayload;
    // console.log("tokengetter",decoded)


    return NextResponse.json({message:"connected",verifytoken:decoded,token:token,success:true},{status:200})
    } catch (error) {
        return NextResponse.json({message:"failed",success:false},{status:500})
    }
}
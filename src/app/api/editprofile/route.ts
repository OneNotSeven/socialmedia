
import { EcomSchema } from "@/schema/signupSchema"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(req:Request):Promise<NextResponse> {
    
    const { profileId } = await req.json()
    // console.log(profileId)
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    const payload = await EcomSchema.find({ _id: profileId })
    console.log("payload",payload)
    return NextResponse.json({message:payload,success:true},{status:200})
}
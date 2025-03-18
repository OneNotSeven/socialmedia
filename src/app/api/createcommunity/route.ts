import { communitySchema } from "@/schema/communitySchema";
import { EcomSchema } from "@/schema/signupSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    const body = await req.json()
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    if (!body.userId && !body.createDetails) {
        return NextResponse.json({message:"something went wrong",success:false}, {status:400 })
    }
    const creating = new communitySchema({ adminId: body.userId, ...body.createDetails })
    await creating.save()
    console.log("create community",creating)
    if (creating) {
        const updateuser=await EcomSchema.updateOne({ _id: body.userId }, { $push: { community: creating._id } });
    }
    return NextResponse.json({message:"create successfully",success:true},{status:200})
    
}

export async function DELETE(req: Request): Promise<NextResponse> {
    const { communityId } = await req.json()
    console.log("delete community id",communityId)
    await mongoose.connect(process.env.NEXT_MONGO_CONNECT as string)
    if (!communityId) {
        return NextResponse.json({message:"something went wrong",success:false}, {status:400 })
    }
    const deleting = await communitySchema.deleteOne({_id:communityId  })
   
    return NextResponse.json({message:"create successfully",success:true},{status:200})
    
}
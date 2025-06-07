import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req:NextRequest) {
    const session = await getServerSession();
    console.log("inside upvote router");
    
    //TODO: Replace this with id everywhere
    const user = await prismaClient.user.findFirst({
        where:{
            email : session?.user?.email ?? ""
        }
    });

    if(!user){
        return NextResponse.json({
            message : "Unauthenticated"
        },{
            status: 403
        })
    }
    console.log("authenticated");
    console.log(user.id);
    
    
    try {
        const data = UpvoteSchema.parse(await req.json())
        console.log("upvote route file: ",data);
        await prismaClient.upvote.create({
            data: {
                userId : user.id,
                streamId: data.streamId
            }
        });
        return NextResponse.json({
            message : "Done"
        })
    } catch (e) {
        return NextResponse.json({
            message : "Error while upvoting"
        },{
            status: 403
        })
        
    }
}
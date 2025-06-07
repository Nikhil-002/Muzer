import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
//@ts-ignore
import youtubesearchapi from "youtube-search-api"

var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req:NextRequest) {
    try {
        console.log("Entered Stream Rouote!!");
        // const output = await req.json();
        // console.log(output);
        const data = CreateStreamSchema.parse(await req.json())
        console.log(data);
        
        // console.log("Entered next Line!!");
        const isYT = data.url.match(YT_REGEX)
        // console.log(isYT);
        
        if(!isYT){ 
            // console.log("inside !YT");
            return NextResponse.json({
            message : "Error while adding a stream"
        },{
            status:411
        })    
        }
        const extractedId = data.url.split("?v=")[1]

        const res = await youtubesearchapi.GetVideoDetails(extractedId)
        console.log(res.title);
        console.log(res.thumbnail.thumbnails);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width : number},b : {width:  number}) => a.width < b.width ? -1 : 1)
        
        const stream = await prismaClient.stream.create({
            data : {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type : "Youtube",
                title : res.title ?? "Can't find video",
                smallImg : (thumbnails.length > 1 ? thumbnails[thumbnails.length -2].url : thumbnails[thumbnails.length-1].url) ?? "https://daily.jstor.org/wp-content/uploads/2023/01/good_times_with_bad_music_1050x700.jpg",
                BigImg : thumbnails[thumbnails.length -1].url ?? "https://daily.jstor.org/wp-content/uploads/2023/01/good_times_with_bad_music_1050x700.jpg"
            }
        })
        return NextResponse.json({
            message: "Added Stream",
            stream,
            hasUpvoted: false,
            upvotes: 0
        })
    } catch (e) {
        console.log(e);
        
        return NextResponse.json({
            message : "Error while adding a stream"
        },{
            status:411
        })
    }
    
}



export async function GET(req:NextRequest) {
    const createrId = req.nextUrl.searchParams.get("creatorId")
    console.log(createrId);
    
    const streams = await prismaClient.stream.findMany({
        where : {
            userId : createrId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}
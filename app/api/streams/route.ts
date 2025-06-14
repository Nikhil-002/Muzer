export const runtime = "nodejs";

import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

var YT_REGEX =/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  // /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    console.log("Entered Stream Rouote!!");
    // const output = await req.json();
    // console.log(output);
    const data = CreateStreamSchema.parse(await req.json());
    console.log(data);

    // console.log("Entered next Line!!");
const isYT = data.url.match(YT_REGEX);
if (!isYT || !isYT[1]) {
  return NextResponse.json(
    {
      message: "Invalid YouTube URL",
    },
    {
      status: 411,
    }
  );
}
const extractedId = isYT[1]; // works for all valid formats
    console.log(extractedId);
    let res;
    try{
      res = await youtubesearchapi.GetVideoDetails(extractedId);
      console.log(res);
      
    } 
    catch (err) {
  console.error("Error fetching video details:", err);
  return NextResponse.json({ message: "Failed to fetch video details" }, { status: 400 });
}
  if (!res) {
  console.error("No response from GetVideoDetails");
  return NextResponse.json({ message: "No video details found" }, { status: 400 });
}

const thumbnails = res?.thumbnail?.thumbnails ?? [];

// Sort only if you have more than 1
if (thumbnails.length > 1) {
  thumbnails.sort((a: { width: number }, b: { width: number }) =>
    a.width - b.width
  );
}

// Fallback image (used if thumbnails are empty or invalid)
const fallbackImg = "https://daily.jstor.org/wp-content/uploads/2023/01/good_times_with_bad_music_1050x700.jpg";

// Pick small and big images with fallback
const smallImg =
  thumbnails.length > 1
    ? thumbnails[thumbnails.length - 2]?.url ?? fallbackImg
    : thumbnails[0]?.url ?? fallbackImg;

const bigImg =
  thumbnails[thumbnails.length - 1]?.url ?? fallbackImg;

const stream = await prismaClient.stream.create({
  data: {
    userId: data.creatorId,
    url: data.url,
    extractedId,
    type: "Youtube",
    title: res?.title ?? "Can't find Title",
    smallImg,
    BigImg: bigImg,
  },
});

    return NextResponse.json({
      message: "Added Stream",
      stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  // console.log("my route file Id: ",session?.user?.email);

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "UnAuthenticated",
      },
      {
        status: 403,
      }
    );
  }
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  // console.log(creatorId);
  if (!creatorId) {
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }

  const [streams, ActiveStream] = await Promise.all([prismaClient.stream.findMany({
    where: {
      userId: creatorId,
      played: false
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
        userId: user.id,
        },
      },
    },
  }), prismaClient.currentStream.findFirst({
    where : {
      userId : user.id
    },
    include : {
      stream: true
    }
  })]);
  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
    })),
    ActiveStream
  });
}

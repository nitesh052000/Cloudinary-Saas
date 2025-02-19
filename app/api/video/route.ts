import { PrismaClient } from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request:NextRequest){
      
    try{
        const videos =   await prisma.video.findMany({
            orderBy :{createdAt:"desc"},
          })

          console.log("videos",videos);

          return NextResponse.json(videos)
    } catch(error){
        console.log("error",error);
        return NextResponse.json({
            status: 500,
            body: {
                error: "An error occurred while fetching videos"
            }
        })
    } finally {
        await prisma.$disconnect();
    }
}
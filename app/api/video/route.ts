import { PrismaClient } from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request:NextRequest){
      
    try{
        const videos =   await prisma.video.findMany({
            orderBy :{createdAt:"desc"},
          })

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
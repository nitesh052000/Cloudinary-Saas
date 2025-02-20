import { PrismaClient } from "@prisma/client";
import {  NextResponse } from "next/server";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Force dynamic API route (prevents static export issues)
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching videos" },
            { status: 500 }
        );
    }
}

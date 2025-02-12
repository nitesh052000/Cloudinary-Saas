import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client/extension';

import { v2 as cloudinary } from 'cloudinary';
import { NextRequest,NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Configuration
    cloudinary.config({ 
        cloud_name: 'dzidl5hzf', 
        api_key: '365124755136622', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });

interface cloudinaryUploadResult {
      public_id: string;
      bytes: number;
      duration?: number
      [key: string]: any;
}

export async function POST(request:NextRequest){
    const {userId} = auth();

    if(!userId){
        return NextResponse.json(new Error('Unauthorized'), {status:401})
    }
    // todo you can add more validation here
    try{

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const originalSize = formData.get("originalSize") as string | null;




        if(!file){
            return NextResponse.json(new Error('No file uploaded'), {status:400})
        }
        
        // with this you can upload anyting to cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
         
      const result =   await new Promise<cloudinaryUploadResult>(
            (resolve,reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type:"video",
                        folder:"video-uploads",
                        transformation: [
                            {quality:"auto",fetch_format:"mp4"},
                        ]
                    },
                    (error,result) => {
                        if(error){
                            reject(error);
                        }
                        else{
                            resolve(result as cloudinaryUploadResult);
                        }
                    }
                )
                uploadStream.end(buffer);
            }
        )

        const video = await prisma.video.create({
            data:{
                title,
                description,
                originalSize: originalSize,
                publicId: result.public_id,
                CompressedSize: String(result.bytes),
                duration: result.duration,
            }
        })

        return NextResponse.json(video)

    } catch(error){
        console.log("upload image error",error);
        return NextResponse.json(new Error('Error uploading image'), {status:500})
    } finally{
        prisma.$disconnect();
    }
}

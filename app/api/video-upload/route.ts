import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest,NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });

interface cloudinaryUploadResult {
      public_id: string;
      bytes: number;
      duration?: number
      [key: string]: unknown;
}

export async function POST(request:NextRequest){

    const authData = await auth();
    const {userId} = authData;

    if(!userId){
        return NextResponse.json(new Error('Unauthorized'), {status:401})
    }
    // todo you can add more validation here
    try{

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const origialSize = formData.get("origialSize") as string;


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
                        ],
                        
                    eager_async: true, // Process large videos asynchronously
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
                title: title ?? '',
                description,
                origialSize: origialSize,
                publicId: result.public_id,
                compressedSize: String(result.bytes),
                duration: result.duration ?? 0,
            }
        })
        return NextResponse.json(video);

    } catch(error){
        console.log("upload image error",error);
        return NextResponse.json(new Error('Error uploading image'), {status:500})
    } finally{
        prisma.$disconnect();
    }
}

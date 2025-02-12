import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest,NextResponse } from 'next/server';


// Configuration
    cloudinary.config({ 
        cloud_name: 'dzidl5hzf', 
        api_key: '365124755136622', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });

interface cloudinaryUploadResult {
      public_id: string;
      [key: string]: any;
}

export async function POST(request:NextRequest){
    const {userId} = auth();

    if(!userId){
        return NextResponse.json(new Error('Unauthorized'), {status:401})
    }

    try{
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if(!file){
            return NextResponse.json(new Error('No file uploaded'), {status:400})
        }
        
        // with this you can upload anyting to cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
         
      const result =   await new Promise<cloudinaryUploadResult>(
            (resolve,reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {folder:"next-cloudinary-uploads"},
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

        return NextResponse.json({
            publicId: result.public_id,

        },{
            status:200
        });

    } catch(error){
        console.log("upload video error",error);
        return NextResponse.json(new Error('Error uploading image'), {status:500})
    }
}


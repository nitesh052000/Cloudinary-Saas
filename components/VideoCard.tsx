import React, { useCallback, useEffect, useState } from 'react'
import { getCldImageUrl,getCldVideoUrl } from 'next-cloudinary'
import { filesize } from 'filesize';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';
import relativeTime from "dayjs/plugin/relativeTime";
import { Download, FileDown, FileUp } from 'lucide-react';
import { Video } from '@prisma/client';
dayjs.extend(relativeTime);

interface VideoCardProps {
    video: Video;
    onDownload :(url:string,title:string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({video,onDownload}) => {

  const [isHovered,setIsHovered] = useState(false);
  const [previewError,setPreviewError] = useState(false);

   const getThumbnailUrl = useCallback((publicId:string)=>{
               return getCldImageUrl({
                src:publicId,
                width:400,
                height:225,
                crop:"fill",
                gravity:"auto",
                format:"jpg",
                quality:"auto",
                assetType:"video"
               })
   },[])

   const getFullVideoUrl = useCallback((publicId:string)=>{
               return getCldVideoUrl({
                src:publicId,
                width:1920,
                height:1080,
                
               })
   },[])

   

   const getPreviewVideoUrl = useCallback((publicId:string)=>{
               return getCldVideoUrl({
                src:publicId,
                width:400,
                height:225,
                rawTransformations: ["e_preview:duration_10"], // Corrected syntax
               })
     },[])

     console.log("preview url",getPreviewVideoUrl(video.publicId));

    const formatSize = useCallback((size:number) => {
             return filesize(size)
    },[])

    const formatDuration = useCallback((seconds: number) => {
       const minutes = Math.floor(seconds/60);
       const remainingSeconds = Math.round(seconds%60);
       return `${minutes}:${remainingSeconds.toString().padStart(2,"0")}`; 
    },[]);

    const CompressionPercentage = Math.round((1 - Number(video?.compressedSize ?? 0) / Number(video?.origialSize ?? 1)) * 100)

    useEffect(()=>{
      setPreviewError(false);
    },[isHovered])

    const handlePreviewError = () => {
      setPreviewError(true);
    }

  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300'
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
       <figure className='aspect-video relative'>
        {isHovered ?(
          previewError ? (
           <div className='w-full h-full flex items-center justify-center bg-gray-200'>
            <p className=' text-red-500'>Preview not available</p>
           </div>
          ):(
              <video onError={handlePreviewError} className=' w-full h-full object-cover' autoPlay muted loop src={getPreviewVideoUrl(video.publicId)}>
              </video>
          )
        ):(
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={video.title} src={getThumbnailUrl(video.publicId)} 
           className='w-full h-full object-cover'
          />
        )}
        <div className='absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center'>
          <Clock  size={16} className="mr-1"/>
          {formatDuration(video.duration)}
        </div>
       </figure>
       <div className='card-body p-4'>
        <h2 className='card-title text-lg font-bold'>{video.title}</h2>
        <p className=' text-sm text-base-content opacity-70 mb-2'>{video.description}</p>
        <p className=' text-sm text-base-content opacity-70 mb-2'>Uploaded {dayjs(video.createdAt).fromNow()}</p>
       </div>
      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div className='flex items-center'>
          <FileUp size={18} className ="mr-2 ml-3 text-primary" />
          <div>
           <div className='font-semibold'>Original</div>
           <p>{formatSize(Number(video?.origialSize))}</p>
          </div>
        </div>
        <div className=' flex items-center'>
          <FileDown size={18} className ="mr-2 text-secondary" />
          <div>
           <h1 className=' font-semibold'>Compressed</h1>
           <p>{formatSize(Number(video?.compressedSize))}</p>
          </div>
        </div>
        </div>
        <div className='flex justify-between items-center mt-4 p-3'>
          <div className='text-sm font-semibold'>
            Compression:{" "}
            <span className=' text-accent'>{CompressionPercentage}%</span>
          </div>
          <button onClick={() => onDownload(getFullVideoUrl(video.publicId),video.title)} className=' btn btn-primary btn-sm'>
            <Download size={16}/>
          </button>
        </div>
    </div>
  )
}

export default VideoCard

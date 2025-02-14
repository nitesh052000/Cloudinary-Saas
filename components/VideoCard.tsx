import React, { useCallback, useState } from 'react'
import { getCldImageUrl,getCldVideoUrl } from 'next-cloudinary'
import { Url } from 'next/dist/shared/lib/router/router';

interface VideoCardProps {
    video: Video;
    onDownload :(Url:string,title:string) => void;
}

const VideoCard: React.FC<VideoCardProps>= ({video,onDownload}) => {

  const [isHovered,setIsHovered] = useState(false);
  const [previewError,setPreviewError] = useState(false);

   const getThumbnailUrl = useCallback((publicId:'string')=>{
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

   const getFullVideoUrl = useCallback((publicId:'string')=>{
               return getCldVideoUrl({
                src:publicId,
                width:1920,
                height:1080,
                
               })
   },[])

   const getFullVideoUrl = useCallback((publicId:'string')=>{
               return getCldVideoUrl({
                src:publicId,
                width:1920,
                height:1080,
                
               })
   },[])

   const getPreviewVideoUrl = useCallback((publicId:'string')=>{
               return getCldVideoUrl({
                src:publicId,
                width:400,
                height:225,
                rawTransformations:["e_preview: duration"]
                
               })
   },[])

  return (
    <div className=' card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300'>

      
    </div>
  )
}

export default VideoCard

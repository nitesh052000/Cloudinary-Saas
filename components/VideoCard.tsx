import React, { useCallback, useState } from 'react'
import { getCldImageUrl,getCldVideoUrl } from 'next-cloudinary'
import { Url } from 'next/dist/shared/lib/router/router';
import { filesize } from 'filesize';

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
                rawTransformations:["e_preview: duration_15:max_seg_9:min_seg_dur_1"]
                
               })
     },[])

    const formatSize = useCallback((size:number) => {
             return filesize(size)
    },[])



  return (
    <div className=' card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300'
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
       <figure className=' aspect-video relative'>
        {isHovered ?(
          previewError ? (
           <div className=' w-full h-full flex items-center justify-center bg-gray-200'>
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
        <div className=''>
          <Clock  size={16} className="mr-1"/>
          {formatDuration(video.duration)}
        </div>
       </figure>
      
    </div>
  )
}

export default VideoCard

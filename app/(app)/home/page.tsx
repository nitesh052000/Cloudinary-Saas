'use client'
import React, {useState,useEffect,useCallback} from 'react'
import axiso from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'


const Home = () => {

 const [videos,setVideos] = useState<Video[]>([]);
 const [isLoading,setLoading] = useState(true);
 


 const fetchVideos = useCallback(async() => {
        try{
          const response = await axiso.get("/api/video")

          console.log("response",response.data);
          if(Array.isArray(response.data)){
          setVideos(response?.data);
          } else{
            throw new Error("Unexpected response format");
          }
        } catch(error){
            console.log("error",error);
            alert("Failed to load Videos");

        } finally{
          setLoading(false);
        }
 },[])

 const handleDownload = () =>{
  
 }

 useEffect(()=>{
      fetchVideos();
 },[fetchVideos])

  return (
    <div className=' container mx-auto p-4'>
      <h1 className=' text-2xl font-bold mb-4'>Videos</h1>
      {videos.length===0 || isLoading ? (
        <div className='text-center text-lg text-gray-500'>No Videos available</div>
      ):(
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
           {
            videos.map((video)=>(
              <VideoCard key={video?.publicId} video={video} onDownload={handleDownload} />
            ))
           }
        </div>
      )}
    </div>
  )
}

export default Home

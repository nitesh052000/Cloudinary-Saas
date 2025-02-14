'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation';


const VideoUpload = () => {
 
  const [file,setFile] = useState<File | null>(null);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [isUploading,setIsUploading] = useState(false);

   const router = useRouter();
   console.log("router",router);

   const MAX_FILE_SIZE = 70*1024*1024;

   const handleSubmit = async(event: React.FormEvent) =>{

    event.preventDefault()

    if(!file) return;

    console.log("file",file);

    if(file.size > MAX_FILE_SIZE){
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file",file);
    formData.append("title",title);
    formData.append("description",description);
    formData.append("originalSize",file.size.toString());

    try{
      const response =  await axios.post("api/video-upload",formData);

      if(!response) throw new Error("Failed to upload image");

       
    } catch(error){
          console.log("error",error);
    } finally{
      setIsUploading(false);
    }     
   }


  return (
    <div className=' container mx-auto p-4'>
      <h1 className=' text-2xl font-bold mb-4'>Upload Video</h1>
      <form onSubmit={handleSubmit} className=' space-y-4'>
          <div>
            <label className='label'>
              <span className=' label-text'>Title</span>
            </label>
            <input className=' inout input-bordered w-full' type='text' value={title} onChange={(e)=>setTitle(e.target.value)} required></input>
          </div>
          <div>
            <label className='label'>
              <span className=' label-text'>Description</span>
            </label>
            <textarea className=' textarea textarea-bordered w-full' value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className='label'>
              <span className='label-text'>Video File</span>
            </label>
            <input className='file-input file-input-bordered w-full' required onChange={(e) => setFile(e.target.files?.[0] || null)} type='file' accept='video/*'></input>
          </div>
          <button type='submit' className='btn btn-primary' disabled={isUploading}>
            {isUploading?"uploading...":"Upload Video"}
          </button>
      </form>
    </div>
  )
}

export default VideoUpload

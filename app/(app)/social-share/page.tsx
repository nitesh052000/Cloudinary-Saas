"use client";
import React from 'react'
import { useEffect,useState,useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import axios from 'axios';

const socialFormats = {
  "Facebook Cover (205:78)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Intagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Intagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "LinkedIn Post (4:2)": {
    width: 1200,
    height: 627,
    aspectRatio: "4:2",
  },
}

type socialFormats = keyof typeof socialFormats;

const SocialShare = () => {

 const [uploadImage, setUploadImage] = useState<string | null>(null);
 const [isUploading, setIsUploading] = useState(false);
 const [selectedFormat,setSelectedFormat] = useState<socialFormats>("Intagram Square (1:1)"); 
 const [isTransforming, setIsTransforming] = useState(false);
 const imageRef = useRef<HTMLImageElement | null>(null);

 useEffect(()=>{
    if(uploadImage){
      setIsTransforming(true);
    }
 },[uploadImage,isTransforming])

 
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if(!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("file",file);
      try{
         const response = await axios.post("/api/image-upload",formData);
         console.log("response",response);

         if(!response) throw new Error("Failed to upload image");

          setUploadImage(response?.data?.publicId);
          
      } catch(err){
          console.log("error in uploading image frontned ",err);
          alert("Failed to upload image");
      } finally{
        setIsUploading(false);
      }

  }

  const handleDownload = () => {
  if (!imageRef || !imageRef.current) return;

  fetch(imageRef.current.src)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded-image.jpg"; // Change filename if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
    .catch(error => console.error("Error downloading the image:", error));
  };


  return (
    <div className=' container mx-auto p-4 mx-w-4xl bg-slate-800'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Social Media image Creator</h1>

      <div className='card'>
        <div className=' card-body'>
          <h2 className=' card-title mb-4'>Upload an Image</h2>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Choose an image file</span>
            </label>
            <input type='file' onChange={handleUpload} className='file-input file-input-bordered file-input-primary w-full' />
          </div>
          {isUploading && (
            <div className='mt-4'>
              <progress className="progress progress-primary w-56" value="0" max="100"></progress>
            </div>
          )}
          {uploadImage && (
             <div className='mt-6'>
              <h2 className=' card-title mb-4'>Select Socila Media Format</h2>
              <div className=' form-control'>
                <select className=' select select-bordered w-full' 
                value={selectedFormat}
                onChange={(e)=> setSelectedFormat(e.target.value as socialFormats)}
                >
                  {Object.keys(socialFormats).map((format,index) => (
                    <option key={index} value={format}>{format}</option>
                  ))}
                </select>
              </div>
              <div className='mt-6 relative'>
                <h3 className='text-lg font-semibold mb-2'>Preview</h3>
                <div className=' flex justify-center'>
                  {isTransforming && (
                    <div className=' absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10'>
                      <span className=' loading loading-spinner loading-lg'></span>
                    </div>
                  )}
                  <CldImage
                   width={socialFormats[selectedFormat].width}
                   height={socialFormats[selectedFormat].height}
                   src={uploadImage}
                   sizes="100vw"
                   alt="transformed image"
                   crop="fill"
                   aspectRatio={socialFormats[selectedFormat].aspectRatio}
                   gravity='auto'
                   ref={imageRef}
                   onLoad={()=> setIsTransforming(false)}
                  />
                </div>
              </div>
              <div className='card-actions justify-end mt-6'>  
                <button onClick={handleDownload} className='btn btn-primary'>Download for {selectedFormat}</button>
              </div>
            </div>            
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialShare;



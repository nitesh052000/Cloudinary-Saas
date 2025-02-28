"use client"
import {  useSignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function Page() {
  const {isLoaded,signUp,setActive} = useSignUp();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [code,setCode] = useState("");
  const [step,setStep] = useState("email");

  if(!isLoaded) return<div>....Loading</div>

  const handleSighUp = async(e:React.FormEvent) =>{
          e.preventDefault();
          try{
              await signUp.create({emailAddress:email,password});
              await signUp.prepareEmailAddressVerification();
              setStep("verification");
          } catch(err:any){
            console.log("error",err);
          }
  }

  const handleVerification = async(e: React.FormEvent) =>{
        e.preventDefault();
  try {
    const verificationResult = await signUp.attemptEmailAddressVerification({
      code,
    });

    if (verificationResult.status === "complete") {
      await setActive({ session: verificationResult.createdSessionId });
      console.log("User verified successfully!");
      // Redirect user or show success message
    } else {
      console.log("Verification pending:", verificationResult);
    }
  } catch (err: any) {
    console.error("Verification failed:", err.errors);
  }

  }

  return (
  <div className="min-h-screen flex justify-center items-center bg-gray-900">
    <div className="bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <h2 className=" text-2xl text-white font-semibold text-center">Welcome Back to Cloudinary Showcase</h2>
      {step == "email" ? (
        <form onSubmit={handleSighUp} className=" mt-8">
          <div className="mb-8 flex flex-col">
            <label className=" text-white text-md mb-1 text-left">Email/Username</label>
            <input className=" w-full px-3  py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-blue-500" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="mb-8 flex flex-col">
            <label className="text-md mb-1 text-left ">Password</label>
            <input className="w-full px-3  py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-blue-500" type="pasword" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <button className=" w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg" type="submit">Sign Up</button>
        </form>
        
      ):(
        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label>Verification Code</label>
            <input type="text" className="w-full px-3  py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-blue-500" value={code} onChange={(e)=>setCode(e.target.value)} required />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Verify Code</button>
        </form>
      )}

      <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-400 hover:underline">
            Sign In
          </a>
        </p>
    </div>
  </div>
   
  );
}

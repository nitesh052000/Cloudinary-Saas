'use client'

import React,{useState} from "react";
import Link from "next/link";
import { ImageIcon, LayoutDashboardIcon, LogOutIcon, MenuIcon, Share2Icon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const sidebarItems = [
    {href:"/home",label:"Home Page",icon:LayoutDashboardIcon},
    {href:"/social-share",label:"Social Share",icon:Share2Icon},
    {href:"/video-upload",label:"Video Upload",icon:UploadIcon},
]

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const router = useRouter();
    const {user} = useUser();
    const [SidebarOpen,setSidebarOpen] = useState(true);
    const {signOut} = useClerk();
    const pathname = usePathname();

    console.log("user",user);

    const handleLogoClick = () =>{
        router.push("/");
    }

    const handleSighOut = async() =>{
        await signOut();
        router.push("/sigh-in");
    }

  return (
     <div className=" drawer lg:drawer-open">
        <input id="sidebar-drawer" type="checkbox" className=" drawer-toggle" checked={SidebarOpen} onChange={() => setSidebarOpen(!SidebarOpen)} />
        <div className="drawer-content flex flex-col">
           {/* navbar */}
           <header className=" w-full bg-base-200">
             <div className=" navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className=" flex-none lg-hidden">
                    <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost drawer-button"><MenuIcon /></label>
                </div>
                <div className=" flex-grow">
                    <Link href="/">
                    <div onClick={handleLogoClick} className="btn btn-ghost normal-case text-2xl font-bold tracking-tight cursor-pointer">
                     Cloudinary Showcase
                     </div>
                    </Link>
                </div>
                <div className=" flex-none flex items-center space-x-4">
                    {user ? (
                        <>
                        <div className=" avatar">
                            <div className=" w-8 h-8">
                            <img className="w-8 h-8 rounded-full" src={user.imageUrl} alt={user.username} />
                            </div>
                        </div>
                        <div className=" text-sm truncate max-w-xs lg:msx-w-md">
                            {user.emailAddresses[0].emailAddress}
                        </div>
                        <button onClick={handleSighOut} className="btn btn-ghost btn-circle"><LogOutIcon className=" h-6 w-6" /></button>
                        </>
                    ):(
                        <Link href="/sign-in">
                        <button className="btn btn-ghost ">Sign In</button>
                        </Link>
                    )}
                </div>
             </div>
           </header>

           {/* // Page Content */}
          <main className=" flex-grow">
            <div className=" max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
                {children}
            </div>
            </main>           
        </div>
        <div className=" drawer-side">
            <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
            <aside className=" bg-base-200 w-64 h-full flex flex-col">
             <div className=" flex items-center justify-center py-4">
                <ImageIcon className=" w-10 h-10 text-primary"/>
             </div>
             <ul className="menu text-base-content w-full p-4 flex-grow">
               {sidebarItems.map((item) => (
                <li key={item.href} className="mb-2">
                    <Link className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                        pathname === item.href ? "bg-primary text-wite" : "hover:bg-base-300"
                    }`} href={item.href} onClick={() => setSidebarOpen(false)}>
                    <item.icon className=" w-6 h-6" />
                    <span className=" font-bold text-white">{item.label}</span>
                    </Link>
                </li>
               ))}
             </ul>
            </aside>
        </div>
     </div>
  );
}
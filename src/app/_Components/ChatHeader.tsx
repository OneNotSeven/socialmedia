"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Verified, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { chatSideInfo, getToken } from "@/controllers/controller";
import Link from "next/link";




const ChatHeader = ({ userId }: any) => {
  const [infoUser, setInfoUser] = useState<any[]>([]);
  
  useEffect(() => {
     const getContent = async () => {
      
      //  const userid = await getToken();
       if (userId) {
         const UserInfo = await chatSideInfo(userId);
         if (UserInfo.success === true) {
           setInfoUser(UserInfo.data);
         }
       }
      
      
     };
     getContent();
   }, []);

  

  return (
    <>
      {infoUser.length>0?(
        <header className=" text-gray-800 flex items-center sticky top-0 left-0 w-full z-10">
          {/* Back Button */}
          <Button variant="ghost" size="icon" className="sm:mr-2 mr-1">
            
            <Link href="/chats"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>

          {/* Community Avatar */}
          <Avatar className="sm:h-10 sm:w-10 w-5 h-5">
            <AvatarImage className="object-cover" src={infoUser[0].profilePic} alt="Contact" />
            <AvatarFallback>
              <Users />
            </AvatarFallback>
          </Avatar>

          {/* Community Name and Member Count */}
          <div className="sm:ml-3 ml-2 flex-grow">
            <div className="flex items-center gap-1">
              <span className="font-semibold sm:text-[16px] text-[14px] capitalize">{ infoUser[0]?.name}</span>
              {infoUser[0]?.isVerified && <Verified className="fill-blue-500 w-4 h-4 text-white" />}
            </div>
            
          </div>

          
           
          

          {/* Members Button with Modal */}
         

          {/* More Options Button */}
          
          
        </header>
      ):(
      
        // Skeleton Loading UI
        <header className="bg-slate-100 p-4 flex items-center sticky top-0 left-0 w-full z-10">
          <Skeleton className="w-10 h-10 rounded-full" /> {/* Avatar Placeholder */}
          <div className="ml-3 flex-grow">
            <Skeleton className="h-4 w-32 mb-1" /> {/* Community Name Placeholder */}
            <Skeleton className="h-3 w-20" /> {/* Members Count Placeholder */}
          </div>
          
        </header>
      )  
      }
    </>
  );
};

export default ChatHeader;

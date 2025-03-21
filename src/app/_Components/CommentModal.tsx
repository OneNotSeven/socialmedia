"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent,DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  sendingComment } from "@/controllers/controller";

import { ref, push } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import { appBaseUrl } from "@/schema/appurl";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


const CommentModal = ({
  contentId,
  userId,
  adminId,
  comment,
  onClose,
  contentData,
  updateCommentCount, 
  basicInfo
}: {
  contentId: string;
  userId: string;
    comment: any;
    contentData: any;
    adminId: string;
    basicInfo: any;
    onClose: () => void;
    updateCommentCount: (contentId:string,count: number) => void;
}) => {
  const [Refresh, setRefresh] = useState<boolean>(false);

  const [newComment, setNewComment] = useState("");
  const [loader, setloader] = useState<boolean>(false)
  

  

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
    setRefresh(false);
    setloader(true)
    try {
      
      const saveComment = await sendingComment(userId, contentId, newComment);
      if (saveComment.success === true) {
        updateCommentCount(contentId, comment + 1);
        setloader(false)
        setNewComment(""); 
        setRefresh(true);
        
        if (adminId !== userId) {
          
          const notificationRef = ref(realDatabase, `notifications/${adminId}`);
          push(notificationRef, {
            type: "comment",
            contentId,
            userId,  // The user who commented
            text: newComment,
            timestamp: Date.now(),
          });
          await fetch(`${appBaseUrl}/api/notifications`, {
            method: "POST",
            body: JSON.stringify({
              adminId,   // Post owner's ID
              userId,    // Commenter ID
              contentId,
              type: "comment",
              text: newComment,
              timestamp: new Date(),
            }),
            headers: { "Content-Type": "application/json" },
          });
        }
    
        // Also store in MongoDB for history tracking
      
      }
  
     
  
      setNewComment(""); 
    } catch (error) {
      console.log("something went wrong",error)
    } finally {
      setloader(false)
    }
  };

  const tweetContent = contentData.text;
  const [showFullTweet, setShowFullTweet] = useState(false);
  const isLongTweet = tweetContent.length > 100;

  return (
    <div className="p-3">

    <Dialog  open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <DialogContent className="max-w-lg sm:mx-auto  sm:grid flex flex-col sm:h-fit h-screen p-4 sm:rounded-lg">
      <DialogTitle>Reply</DialogTitle>

      {/* Fake Tweet Section (Original Tweet) */}
      <div className="flex gap-3 pb-3">
          <Avatar>
            
                <AvatarImage className="object-cover" src={contentData.adminId?.profilePic} alt="User Avatar" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1">
              <p className="font-semibold">{ contentData.adminId.name}</p>
              <p className="text-gray-600 text-sm"> · {formatDistanceToNow(new Date(contentData.createdAt), { addSuffix: true })}</p>
          </div>
          <div className="mt-1 text-gray-900 text-sm sm:text-base">
            <p className="text-sm">
              {showFullTweet || !isLongTweet ? tweetContent : tweetContent.slice(0, 100) + "..."}
            </p>
            {isLongTweet  && (
              <a href={`/post/${contentData._id}`}>
              <button
                className="text-blue-500 text-sm mt-1 hover:underline"
                
              >
                Show More
              </button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Reply Indicator Line */}
      <div className="flex mt-2">
        <div className="relative">
          <div className="absolute top-[-48px] left-5 h-[85px] border-[1.5px] rounded-full border-gray-200"></div>
        </div>
          <span className="text-sm text-gray-600 ml-12">{`Replying to ${contentData.adminId.username}`}</span>
      </div>

      {/* Reply Input Section */}
      <div className="flex items-start gap-3 mt-2">
      <Avatar>
            
            <AvatarImage className=" object-cover" src={basicInfo.ProfilePic || "/profile.jpg"} alt="User Avatar" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

        <div className="flex-1">
            <Textarea
              value={newComment}
            placeholder="Tweet your reply..."
            className="w-full p-2 border-none focus:ring-0 focus:outline-none text-sm sm:text-base"
            style={{ resize: "none" }}
            
              rows={3}
              onChange={(e)=>{setNewComment(e.target.value)}}
          />
        </div>
      </div>

      {/* Post Button */}
      <div className="flex justify-end mt-3">
        <Button onClick={handleCommentSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm sm:text-base">
            {loader ? <Loader  className="w-6 h-6 text-white animate-spin"/> : "Reply"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
    </div>
  );
};

export default CommentModal


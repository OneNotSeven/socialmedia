"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteComment, gettingComment, sendingComment } from "@/controllers/controller";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { ref, push, onValue } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import { appBaseUrl } from "@/schema/appurl";


const copy = ({
  contentId,
  userId,
  adminId,
  onClose,
  updateCommentCount, 
  basicInfo
}: {
  contentId: string;
  userId: string;
    comment: any[];
    adminId: string;
    basicInfo: any;
    onClose: () => void;
    updateCommentCount: (contentId:string,count: number) => void;
}) => {
  const [Refresh, setRefresh] = useState<boolean>(false);
  const [commentData, setcommentData] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [dloader, setdloader] = useState<boolean>(false);
  const [sloader, setsloader] = useState<boolean>(false);
  
  

  useEffect(() => {
    const getAllComment = async () => {
      const getC = await gettingComment(contentId);
      if (getC.success == true) {
        setcommentData(getC.data[0].comments);
      }
    };
    getAllComment();
  }, [Refresh, sloader]);

  

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
    setRefresh(false);
    const saveComment = await sendingComment(userId, contentId, newComment);
    if (saveComment.success === true) {
      updateCommentCount(contentId, commentData.length + 1);
      setRefresh(true);
      console.log("adminid:",adminId,"userid:",userId)
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

   

    setNewComment(""); // Clear input after submission
  };

  const deleteComments = async (commentId: any): Promise<void> => {
    setdloader(true);
    const deleting = await deleteComment(userId, contentId, commentId);
    if (deleting.success == true) {
      updateCommentCount(contentId, commentData.length - 1);
      setdloader(false);
      setsloader(true);
    }
  };
console.log("basic info",basicInfo)
  return (
    <Dialog 
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-md h-[94vh] mx-auto">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        {/* Comment Section */}
        {commentData.length > 0 ? (
          <div className="h-full overflow-y-auto space-y-3">
            {commentData.map((cmt:any, idx:number) => (
              <div key={idx} className="flex justify-between">
                <div className="flex items-start space-x-3 bg-gray-50 p-2 rounded-md">
                  <div className="w-10 h-10 bg-gray-300 overflow-hidden rounded-full">
                    <Image alt="profile image" src={cmt.userId?.profilePic} width={50} height={50} />
                  </div>
                  <div>
                    <p className="text-sm ">{cmt.userId?.username}</p>
                    <p className="text-sm text-gray-700">{cmt?.text}</p>
                  </div>
                </div>
                {userId === cmt.userId?._id && (
                  <Button
                    onClick={() => deleteComments(cmt._id)}
                    className="p-0 bg-transparent pr-4 flex justify-center items-center hover:bg-transparent shadow-none"
                  >
                    <XCircle className="text-gray-600 " />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">No comments yet</div>
        )}

        {/* Add Comment Input */}
        <div className="flex items-center gap-2 border-t pt-2">
          <Input
            placeholder="Write a comment..."
            className="flex-1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="bg-blue-500 text-white" onClick={handleCommentSubmit}>
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default copy


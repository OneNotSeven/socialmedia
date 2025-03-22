"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Heart, Loader, MessageCircle, MoreHorizontal, SendHorizontalIcon, Share, SmilePlus, Trash, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteComment, getcontent, sendingComment } from '@/controllers/controller';
import { formatDistanceToNow } from "date-fns";
import Image from 'next/image';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { appBaseUrl } from '@/schema/appurl';
import { ref, push, onValue } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });
import emojiData from "@emoji-mart/data";

const Postid = ({ postId, userId }: any) => {
  const [content, setcontent] = useState<string[]>([]);
  const [comments, setcomments] = useState<string[]>([]);
  const [contentId, setcontentId] = useState<string>("");
  const [postadmin, setpostadmin] = useState<string>("")
  const [newComment, setNewComment] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [loader, setloader] = useState<boolean>(false)
  const [loaderPost, setloaderPost] = useState<boolean>(false)
  const [support, setsupport] = useState<boolean>(false)
   const [showPicker, setShowPicker] = useState(false);

  const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    content?.forEach((item: any, idx: number) => {
      if (item.video && videoRefs.current[idx]) {
        videojs(videoRefs.current[idx] as HTMLDivElement, {
          controls: true,
          responsive: true,
          fluid: true,
        });
      }
    });
  }, [content]);

  useEffect(() => {
    const getcontentRes = async () => {
      const getres = await getcontent(postId);
      if (getres.success) {
        setcontent(getres.data);
        setcontentId(getres.data[0]._id);
        setcomments(getres.data[0].comments);
        setpostadmin(getres.data[0].adminId._id)
      }
    };
    getcontentRes();
  }, [postId, support]);
  
  const addEmoji = (emoji: any) => {
    setNewComment((prev) => prev + emoji.native);
    setShowPicker(false); // Hide picker after selection
  };
  const handleRemove = async () => {
    try {
      
      if (commentToDelete) {
        setloader(true)
        await deleteComment(userId, contentId, commentToDelete);
        setcomments(comments.filter((comment:any) => comment._id !== commentToDelete));
        setShowModal(false);
      }
    } catch (error) {
      
    } finally {
      setloader(false)
    }
  };

  const handlePostComment = async () => {
    try {
      setloaderPost(true)
      if (newComment.trim() !== "") {
        const res = await sendingComment(userId, contentId, newComment);
        if (res.success) {
          
          setsupport(!support)
          setNewComment("");
          if (postadmin !== userId) {
        
            const notificationRef = ref(realDatabase, `notifications/${postadmin}`);
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
                adminId:postadmin,   // Post owner's ID
                userId,    // Commenter ID
                contentId,
                type: "comment",
                text: newComment,
                timestamp: new Date(),
              }),
              headers: { "Content-Type": "application/json" },
            });
          }

          
        }
      }
    } catch (error) {
      
    } finally {
      setloaderPost(false)
    }
  };

  return (
    <>
      <div className='flex flex-col pb-20 mx-auto gap-3'>
        <div className="bg-white dark:bg-gray-800 mx-auto rounded-lg sm:w-[650px] w-full p-4">
          {content.map((items: any, idx: number) => (
            <div key={idx} className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage className=' object-cover' src={items?.adminId?.profilePic} alt="User Avatar" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{items.adminId.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">·</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(items.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
  {items.text.split(" ").map((word:any, index:number) =>
    word.startsWith("#") ? (
      <span key={index} className="text-blue-500">
        {word}{" "}
      </span>
    ) : (
      <span key={index}>{word} </span>
    )
  )}
</p>
                {items.image && (
                  <Image src={items.image} width={650} height={400} className="w-full rounded-lg" alt="Tweet Media" quality={100} priority />
                )}
                {items.video && (
                  <div className="sm:w-full w-[347px] rounded-lg overflow-hidden">
                    <video ref={(el: any) => { if (el) videoRefs.current[idx] = el; }} className="video-js vjs-theme-default w-full h-auto rounded-lg" controls preload="metadata">
                      <source src={items.video} type="video/mp4" />
                    </video>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          {content.length > 0 && <div className='flex gap-1 items-center'>
            <Button onClick={() => setShowPicker(!showPicker)} className='bg-transparent hover:bg-transparent shadow-none'><SmilePlus className='text-gray-500' /></Button>
            {showPicker && (
                        <div className="absolute sm:top-40 top-[38rem] left-1 sm:left-[500px] z-10 bg-white shadow-md rounded-lg">
                          <Picker data={emojiData} onEmojiSelect={addEmoji} />
                        </div>
                      )}
            <Input className="w-full p-6" placeholder='Post a reply' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <div className='p-3 bg-blue-600 rounded-md cursor-pointer' onClick={handlePostComment}>
              {loaderPost ? <Loader className='text-white w-6 h-6 animate-spin' /> : <SendHorizontalIcon className='text-white' />}
            </div>
          </div>}
          {comments.length > 0 && (
            <>
              <div className='font-semibold p-3 mt-6'>Comments {(comments.length)}</div>
              <div className='mt-6 sm:p-0 p-3 flex flex-col gap-6'>
                {comments.map((items: any, idx: number) => (
                  <div key={idx} className='flex justify-between items-center gap-1'>
                    <div className='flex items-center gap-1'>
                      <Avatar>
                        <AvatarImage className='object-cover' src={items.userId.profilePic} alt="User Avatar" />
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <div className='flex gap-1'>
                          <p>{items.userId.name}</p>
                          {items.userId.isVerified && <Verified className='fill-blue-500 text-white' />}
                          <span className='text-gray-500 text-sm'>{items.userId.username}</span>
                        </div>
                        <span className='text-gray-700 ml-1'>{items.text}</span>
                      </div>
                    </div>
                    {items.userId._id === userId && <span onClick={() => { setCommentToDelete(items._id); setShowModal(true); }} className='text-red-500 cursor-pointer text-sm'><Trash className='text-red-500 w-5 h-5'/></span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this comment?</p>
            <DialogFooter className='flex flex-col gap-3'>
             
              {loader ? <Button className='bg-red-500 text-white'>Deleting...</Button> : <Button onClick={handleRemove} className='bg-red-500 text-white'>Delete</Button>}
              <Button className='bg-slate-200 text-black' onClick={() => setShowModal(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Postid;

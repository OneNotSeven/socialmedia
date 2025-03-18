"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share, VerifiedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { BasicInfo, gettingContent, getToken, sendingLikes, UnLikes } from "@/controllers/controller";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import CommentModal from "./CommentModal";
import { ref, push} from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import { appBaseUrl } from "@/schema/appurl";
import TweetsSkeleton from "./TweetSkeleton";
import Link from "next/link";


const Tweets = () => {
  const [contentData, setContentData] = useState<any[]>([]);
const [likesSupporter, setlikesSupporter] = useState<boolean>(false)
  const [comments, setComments] = useState<number>();
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});
  const [sendData, setsendData] = useState<any>({})
  const [userId, setUserId] = useState<string>("");
  const [likesState, setLikesState] = useState<{ [key: string]: boolean }>({});
  
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string>("");
  const [basicInfo, setBasicInfo] = useState({ name: "", ProfilePic: "", username: "" });
  const [loading, setloading] = useState<boolean>(false)
  const [infoUser, setinfoUser] = useState<any[]>([])

  const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    try {
      setloading(true)
      const getContent = async () => {
        const userid = await getToken();
        if (userid) {
          const UserInfo = await BasicInfo(userid)
          if (UserInfo.success == true) {
            
            setinfoUser(UserInfo.data)
          }
        }
        setUserId(userid);
        const response = await gettingContent(userid);
        if (response.success === true) {
          setloading(false)
          setContentData(response.data);
        }
  
        // Initialize likes state
        const initialLikes: { [key: string]: boolean } = {};
        response.data.forEach((item: any) => {
          initialLikes[item._id] = item.likes.includes(userid);
        });
        setLikesState(initialLikes);
      };
      getContent();
    } catch (error) {
      console.log("something went wrong",error)
    } 
  }, []);

  useEffect(() => {
    contentData?.forEach((item, idx) => {
      if (item.video && videoRefs.current[idx]) {
        videojs(videoRefs.current[idx] as HTMLDivElement, {
          controls: true,
          responsive: true,
          fluid: true,
        });
      }
    });
  }, [contentData]);

  

  const handleLike = (postId: string,text:string,adminid:string) => {
    // Optimistic UI: Toggle like state instantly
    setLikesState((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    // Store pending like request
    

    // Debounced API request
    setTimeout(async () => {
      try {
        await sendingLikes(userId, postId);
      } catch (error) {
        console.error("Error liking post:", error);
        // Revert UI if API fails
        setLikesState((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
      }
      if (adminId !== userId) {
        
        const notificationRef = ref(realDatabase, `notifications/${adminid}`);
        push(notificationRef, {
          type: "like",
          postId,
          userId,  // The user who commented
          text: text,
          timestamp: Date.now(),
        });
        await fetch(`${appBaseUrl}/api/notifications`, {
          method: "POST",
          body: JSON.stringify({
            adminId:adminid,   // Post owner's ID
            userId:userId,    // Commenter ID
            contentId:postId,
            type: "like",
            text: text,
            timestamp: new Date(),
          }),
          headers: { "Content-Type": "application/json" },
        });
      }
    }, 500);
  };

  const updateCommentCount = (contentId: string, newCount: number) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [contentId]: newCount, // Correctly update the count for the specific post
    }));
  };

  const handleUnlike = async (postId: string) => {
    setLikesState((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
      try {
   
        const unlike = await UnLikes(userId, postId);
        if (unlike.success == true) {
          setlikesSupporter(!likesSupporter)
        }
      } catch (error) {
        console.error("Error unliking post:", error);
        setLikesState((prev) => ({
          ...prev,
          [postId]: true,
        }));
      }
    }

  console.log("last trial",infoUser)
  return (
    <>
      {isCommentModalOpen && selectedContentId && (
        <CommentModal
          onClose={() => setIsCommentModalOpen(false)}
          contentId={selectedContentId}
          comment={comments}
          userId={userId}
          adminId={adminId}
          basicInfo={basicInfo}
          contentData={ sendData}
          updateCommentCount={updateCommentCount} // Pass function
        />
      )}
  
      {loading? Array.from({ length: 3 }).map((_, i) => <TweetsSkeleton key={i} />):
        <>
        
        {contentData?.map((items: any, idx: number) => (
         <Link key={items._id} href={`post/${items._id}`} className="sm:hover:bg-slate-100 sm:w-fit w-full sm:mt-0 mt-3">
         
         <div  className="  dark:bg-gray-800 rounded-lg w-full sm:w-[640px] overflow-auto sm:p-4 p-0">
            {/* Suggested Post Label */}
            {items.isSuggested && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-slate-200 px-2 py-1 w-fit rounded-full">
                Suggested Post
              </p>
            )}
  
            <div className="flex items-start space-x-1 sm:space-x-3">
              <Avatar className="w-5 h-5">
                <AvatarImage className=" object-cover" src={items.adminId?.profilePic || "/profile.jpg"} alt="User Avatar" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
  
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <h2 className="text-sm font-semibold flex gap-1 items-center text-gray-900 dark:text-white truncate">
                    {items.adminId?.name}
                    {items.adminId?.isVerified && (
                      <VerifiedIcon className="w-5 h-5 text-white fill-blue-500" />
                    )}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {items.adminId?.username}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">·</span>
                  <span className="sm:text-sm text-[10px] text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(items.createdAt), { addSuffix: true })}
                  </span>
                </div>
  
                <p className="mt-1 text-gray-900 text-sm dark:text-white">
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
  
                {/* Media Section */}
                <div className="mt-2 sm:w-full w-[347px]  overflow-hidden rounded-lg">
                  {items.image && (
                    <Image
                      src={items.image}
                      width={650}
                      height={400}
                      className="w-full rounded-lg"
                      alt="Tweet Media"
                      quality={100}
                      priority
                    />
                  )}
  
                  {items.video && (
                    <div  onClick={(e) => { e.stopPropagation(), e.preventDefault() }} className="w-full rounded-lg overflow-hidden">
                      <video
                        ref={(el: any) => {
                          if (el) videoRefs.current[idx] = el;
                        }}
                        className="video-js vjs-theme-default w-full h-auto rounded-lg"
                          controls
                          preload="metadata"
                          autoPlay
                          muted
                          playsInline
                          onClick={(e) => { e.stopPropagation(), e.preventDefault() }}
                      >
                        <source src={items.video} type="video/mp4" />
                      </video>
                    </div>
                  )}
                </div>
  
                {/* Action Buttons */}
                <div className="mt-3 flex items-center justify-between max-w-md">
                  {/* Comment Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent link click
                        e.preventDefault(); // Prevent navigation
                      setSelectedContentId(items._id);
                      setAdminId(items.adminId._id);
                      setComments(items.comments.length);
                      setIsCommentModalOpen(true);
                      setsendData(items)
                      setBasicInfo({
                        name: infoUser[0]?.name,
                        ProfilePic: infoUser[0].profilePic,
                        username: infoUser[0].username,
                      });
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {commentCounts[items._id] ?? items.comments?.length ?? 0}
                  </Button>
  
                  {/* Like Button */}
                 

                    { items.likes.some((some:any)=>some.userId==userId)? (<Button
                                    variant="ghost"
                                    size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent link click
                        e.preventDefault(); // Prevent navigation
                                      // setSelectedContentId(items._id);
                                      // setAdminId(items.adminId._id);
                                      handleUnlike(items._id)
                                    }}
                                    className={`${
                                      likesState[items._id]?"text-gray-500 dark:text-gray-400" 
                                        : " text-red-500 dark:text-red-400"
                                         
                                    }  dark:hover:text-red-400 hover:text-red-500`}
                                  >
                                    <Heart className="h-5 w-5 mr-2" />
                                    <span className="text-xs">{items.likes.length - (likesState[items._id] ? 1 : 0)}</span>
                                  </Button>) :
                                    (<Button
                                    variant="ghost"
                                    size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent link click
                          e.preventDefault(); // Prevent navigation
                                      
                                      handleLike(items._id,items.text,items.adminId._id)
                                    }}
                                    className={`${
                                      likesState[items._id] || items.likes.some((some:any)=>some.userId==userId)
                                        ? "fill-red-500 text-red-500 dark:text-red-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }  dark:hover:text-red-400 hover:text-red-500`}
                                  >
                                    <Heart className="h-5 w-5 mr-2" />
                                    <span className="text-xs">{items.likes.length + (likesState[items._id] ? 1 : 0)}</span>
                                  </Button>)}
                    
  
                  {/* Share Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
            <hr />
         </Link> 
        ))}
        </> 
}
    </>
  );
};

export default Tweets;

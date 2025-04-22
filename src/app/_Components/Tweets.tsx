"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share, VerifiedIcon,Verified, Repeat, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card"
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
import { useRouter } from "next/navigation";


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
  const [isVertical, setIsVertical] = useState(false);
   const [bookMark, setbookMark] = useState<{ [key: string]: boolean }>({})

  const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [aspectRatio, setAspectRatio] = useState("16/9"); // Default to landscape

  const router=useRouter()

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
          initialLikes[item._id] = item.likes.some((like: any) => like.userId === userid);
        });
        setLikesState(initialLikes);
      }
  
      getContent();
    } catch (error) {
      console.log("something went wrong",error)
    } 
  }, []);

  useEffect(() => {
    contentData?.forEach((item, idx) => {
      if (item.video && videoRefs.current[idx]) {
        const video = videoRefs.current[idx];
        if (video) {
          const video = videoRefs.current[idx];
    if (video) {
      video.onloadedmetadata = () => {
        const { videoWidth, videoHeight }:any = video;
        setIsVertical(videoHeight > videoWidth);
      };
    }
        }
        videojs(videoRefs.current[idx] as HTMLDivElement, {
          controls: true,
          responsive: true,
          fluid: true,
        });
      }
    });
  }, [contentData]);

  const handleBookmark = (postId:string) => {
    setbookMark((prev) => ({
      ...prev,
      [postId]:!prev[postId]
  }))
}

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
        <div className="pb-12 w-full flex flex-col gap-3">
        
        {contentData?.map((items: any, idx: number) => (

        <Link key={items._id} href={`post/${items._id}`} className="sm:hover:bg-slate-100 sm:w-full w-full sm:mt-2 mt-3">


          

 {items.isSuggested && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-slate-200 px-2 py-1 w-fit rounded-full">
                Suggested Post
              </p>
            )}
          <ul key={idx} className="hover:shadow-md divide-y w-full transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={items.adminId?.profilePic || "/profile.jpg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
               <div onClick={(e)=>{ e.stopPropagation(); router.push(`/profiles/${items.adminId.username }`)}}>
               <div className="font-semibold text-sm flex gap-1 items-center">
                                            { items.adminId.name}
                      {items.adminId?.isVerified && <Verified className="fill-blue-500 text-white" />}
                      <span className="sm:text-sm text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                   {formatDistanceToNow(new Date(items.createdAt), { addSuffix: true })}
                 </span>
                </div>
                                  <div className="text-xs text-muted-foreground">{items.adminId.username }</div>
                  </div>
                  
            </div>
           
            <p className="text-sm mb-3">
  {items.text
    .slice(0, items.text.length > 100 ? 200 : items.text.length)
    .split(" ")
    .map((word: string, index: number) =>
      word.startsWith("#") ? (
        <span key={index} className="text-blue-500">{word} </span>
      ) : (
        <span key={index}>{word} </span>
      )
    )}
  {items.text.length > 100 && (
    <span className="text-blue-500">...show more</span>
  )}
</p>


            
            <div className="rounded-lg overflow-hidden mb-3">
                {items.image && (<Image
                  src={items.image}
                  alt="Post image"
                  width={400}
                  height={200}
                  className="w-full  object-contain"
                />)}
                 {items.video && (
                    <div  onClick={(e) => { e.stopPropagation(), e.preventDefault() }} className="w-full rounded-lg overflow-hidden">
                      <video
      ref={(el:any) => {
        if (el) videoRefs.current[idx] = el;
      }}
      className="video-js vjs-theme-default w-full rounded-lg"
      style={{
        aspectRatio: isVertical ? "9/16" : "16/9",
        maxHeight: isVertical ? "500px" : "auto", // Limit height for reels
        objectFit: "cover", // Ensures proper fit
      }}
      controls
      preload="metadata"
      autoPlay
      muted
      playsInline
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <source src={items.video} type="video/mp4" />
    </video>
                    </div>
                  )}
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <div className="flex items-center">
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
              </div>
              
              <div className="flex items-center">
              <Button
  variant="ghost"
  size="sm"
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();

    const alreadyLiked =
      likesState[items._id] !== undefined
        ? likesState[items._id]
        : items.likes.some((some: any) => some.userId == userId);

    if (alreadyLiked) {
      handleUnlike(items._id);
    } else {
      handleLike(items._id, items.text, items.adminId._id);
    }
  }}
>
  <Heart
    className={`${
      (likesState[items._id] !== undefined
        ? likesState[items._id]
        : items.likes.some((some: any) => some.userId == userId))
        ? "fill-red-500 text-red-500 dark:text-red-400"
        : "text-gray-500 dark:text-gray-400"
    } dark:hover:text-red-400 h-5 w-5 mr-2 hover:text-red-500`}
  />
  <span className="text-xs">
    {items.likes.length + (likesState[items._id] ? 1 : 0)}
                      </span>
                      
</Button>

                
                  </div>
                  
                  <div className="flex items-center">
                    <Button onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleBookmark(items._id)
                  }} className={`bg-transparent hover:bg-transparent text-gray-500 hover:text-blue-500  shadow-none `}><Repeat className={`${bookMark[items._id]?"fill-blue-500 text-blue-500":null}`} /></Button>
</div>
<div className="flex items-center">
                  <Button className="bg-transparent text-[10px] font-normal text-gray-500 hover:text-blue-500 shadow-none hover:bg-transparent"><BarChart2 className="h-5 w-5"/>202k</Button>

                </div>
              <div className="flex items-center">
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      
                      const postUrl = `${appBaseUrl}/post/${items._id}`;
                
                      if (navigator.share) {
                        // Web Share API (for mobile & modern browsers)
                        navigator.share({
                          title: "Check out this post!",
                          text: items.text,
                          url: postUrl,
                        }).catch((err) => console.error("Error sharing:", err));
                      } else {
                        // Fallback: Copy to clipboard
                        navigator.clipboard.writeText(postUrl);
                        alert("Post link copied to clipboard!");
                      }
                    }}
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Share className="h-5 w-5 mr-1" />
                  </Button>
               
              </div>
            </div>
          </CardContent>
        </ul>
          </Link>
        ))}
        </div> 
}
    </>
)
};

export default Tweets;

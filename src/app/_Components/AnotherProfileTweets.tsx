import React, { useEffect, useState, useRef } from "react";
import { Heart, HeartIcon, MessageCircle, MoreVertical, Share, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

import { BasicInfo, postDelete, sendingLikes, UnLikes } from "@/controllers/controller";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import CommentModal from "./CommentModal";
import { ref, push } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import { appBaseUrl } from "@/schema/appurl";
import Link from "next/link";

const AnotherProfileTweets = ({ data, userid,setdelrender }: { data:any,userid:any,setdelrender:React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [contentData, setContentData] = useState<any[]>([].reverse());
  const [sendData, setsendData] = useState<any>({})
   const [likesState, setLikesState] = useState<{ [key: string]: boolean }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});
      const [userId, setuserId] = useState<string>("")
      const [comments, setComments] = useState<number>();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newrender, setnewrender] = useState<boolean>(false)

  const [loader, setloader] = useState<boolean>(false)
      const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [adminId, setadminId] = useState<string>("")
  const [infoUser, setinfoUser] = useState<any[]>([])
  const [pendingLikes, setPendingLikes] = useState<{ [key: string]: boolean }>({});
    const [basicInfo, setbasicInfo] = useState({ name: "", ProfilePic: "", username: "", })
    const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    
  useEffect(() => {
    const userDataInfo = async() => {
    
      if (userid) {
               const UserInfo = await BasicInfo(userid)
               if (UserInfo.success == true) {
                 
                 setinfoUser(UserInfo.data)
               }
             }
    }
    userDataInfo()
       setContentData(data)
    setuserId(userid)
    
    const initialLikes: { [key: string]: boolean } = {};
        data.forEach((item: any) => {
          initialLikes[item._id] = item.likes.some((like: any) => like.userId === userid);
        });
        setLikesState(initialLikes);
      
   }, [userid,data])
  
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
  
  const updateCommentCount = (contentId: string, newCount: number) => {
    setCommentCounts((prevCounts) => ({
      ...prevCounts,
      [contentId]: newCount, // Correctly update the count for the specific post
    }));
  };

   const handleLike = (postId: string,text:string,adminid:string) => {
      // Optimistic UI: Toggle like state instantly
      setLikesState((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
  
      // Store pending like request
      setPendingLikes((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
  
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
        if (adminid !== userId) {
          
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
  
  const handleUnlike = async (postId: string) => {
    setLikesState((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    try {
      
      await UnLikes(userId, postId);
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert UI if API fails
      setLikesState((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    }
  }

  const deletepost = async (postId: string) => {
    try {
      setdelrender(false)
      setnewrender(false)
      setloader(true)
      const postdeleting = await postDelete(postId, userId)
      if (postdeleting.success == true) {
        setdelrender(true)   
        setnewrender(true)
      }
    } catch (error) {
      
    } finally {
      setloader(false)
    }
    
  }
   
  return (
    <>
    {isCommentModalOpen && selectedContentId && (
        <CommentModal
          
          onClose={() => setIsCommentModalOpen(false)}
          contentData={ sendData}
        contentId={selectedContentId} // Pass content ID to the modal
        comment={comments}
        userId={userId}
        adminId={adminId}
          basicInfo={basicInfo}
          updateCommentCount={updateCommentCount}
      />
    )}
      <div className='text-2xl font-semibold pb-3  text-gray-600'>All post</div>
      <div className="flex flex-col gap-2 w-full">

      {contentData.map((items: any, idx: number) => (
       
        <Link key={items._id} href={`/post/${items._id}`} className="sm:hover:bg-slate-100 sm:w-full w-full sm:mt-2 mt-3">


          

        {items.isSuggested && (
                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-slate-200 px-2 py-1 w-fit rounded-full">
                       Suggested Post
                     </p>
                   )}
                 <Card key={idx} className="hover:shadow-md w-full transition-shadow">
                 <CardContent className="p-4">
                   <div className="flex items-center mb-3">
                     <Avatar className="h-8 w-8 mr-2">
                       <AvatarImage className="object-cover w-full h-full" src={items.adminId?.profilePic || "/profile.jpg"} />
                       <AvatarFallback>U</AvatarFallback>
                     </Avatar>
                     <div className="w-full">
                  <div className="font-semibold text-sm flex items-center justify-between">
                    <div className="flex gap-1">

                                                   { items.adminId.name}
                             {items.adminId.isVerified && <Verified className="fill-blue-500 w-5 h-5 text-white" />}
                             <span className="sm:text-sm text-[10px] text-gray-500 dark:text-gray-400">.
                          {formatDistanceToNow(new Date(items.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                  <div>
                 <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVertical className="w-3 h-3 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {items.adminId._id !== userId && <DropdownMenuItem onClick={(e) => {e.preventDefault(),e.stopPropagation()}}>Report</DropdownMenuItem>}
                        {items.adminId._id === userId && <DropdownMenuItem onClick={(e) => { e.preventDefault(), e.stopPropagation(), deletepost(items._id) }} className="text-red-500">{loader ? "Deleting..." : "Delete"}</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                {items.image && (
                  
                  
                        <Image
                         src={items.image}
                         alt="Post image"
                         width={400}
                         height={200}
                         className="w-full  aspect-square object-contain"
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
                   <div className="flex items-center justify-between text-muted-foreground text-xs">
                     <div className="flex items-center">
                                       <Button
                           variant="ghost"
                           size="sm"
                           className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                           onClick={(e) => {
                                                  e.stopPropagation(); // Prevent link click
                                                  e.preventDefault(); // Prevent navigation
                                              setSelectedContentId(items._id); // Set content ID
                                              setadminId(items.adminId._id)
                                              setComments(items.comments.length);
                                              setsendData(items)
                                              setIsCommentModalOpen(true);
                                              setbasicInfo({name:infoUser[0].name,ProfilePic:infoUser[0].profilePic,username:infoUser[0].username})
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
                       {/* <span>32K</span> */}
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
               </Card>
                 </Link>
      
    ))}
      </div>
  </>
  )
}

export default AnotherProfileTweets

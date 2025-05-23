"use client"
import { chatside, followUser, gettingCommmunity, getToken, getUserProfile, sendRequest, unFollowUser } from '@/controllers/controller'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Loader,Loader2Icon,Settings, UserPlus2, Verified } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AnotherProfileTweets from './AnotherProfileTweets'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation'


const AnotherUserProfile = ({ username }: any) => {
  const router=useRouter()
  const [profile, setprofile] = useState<any>()
  const [loader, setloader] = useState<boolean>(false)
  const [userId, setuserId] = useState<string>()
  const [check, setcheck] = useState<boolean>(false)
  const [delrender, setdelrender] = useState<boolean>(false)
  const [messageLoader, setmessageLoader] = useState<boolean>(false)

     useEffect(() => {
    
        const getId = async () => {
            const userId = await getToken()
            setuserId(userId)
            const userProfile = await getUserProfile(username)
            if (userProfile.success == true) {
                console.log(userProfile.data)
                setprofile(userProfile.data)
            }
            
             
          
          
    
        }
        getId()
       
            
     }, [check,delrender])
  
  const handleUnfollow = async (userId: string, authuser: any):Promise<void> => {
    if (userId && authuser) {
      try {
        setloader(true)
        setcheck(false)
        
        const unfollowapi = await unFollowUser(userId, authuser)
        if (unfollowapi.success == true) {
          setcheck(true)
          setloader(false)
        }
        console.log("unfollow api",unfollowapi)
      } catch (error) {
        console.log("error",error)
      } finally {
        setloader(false)
        
      }
    
    }
    
  }
  
  const handleFollow = async (userId: string, authuser: any): Promise<void> => {
    if (userId && authuser) {
    try {
      setloader(true)
      setcheck(false)
      const followapi = await followUser(userId, authuser)
      if (followapi.success == true) {
        setloader(false)
        setcheck(true)
      }
      console.log("follow api",followapi)
    } catch (error) {
      
    } finally {
      setloader(false)
      
    }
     
    
    }
  }
    
  const handleMessageSave = async (chatId: string) => {
    try {
      setmessageLoader(true)
        
      const saveChatside = await chatside(userId, chatId)
      if (saveChatside.success == true) {
        setmessageLoader(false)
        router.push(`/chats/${chatId}`)
        
      } else {
        setmessageLoader(false)
        
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
      <>
          
      {profile ? < div className="max-w-2xl w-full sm:w-[650px] border-l-2 border-r-2 mx-auto p-2" >
        <div className="space-y-8 w-full">
          {/* Profile Header */}
          <div className="flex items-center justify-between sm:gap-8 gap-3">
            <div className="relative">
              <div className="relative sm:h-44 sm:w-44 w-24 h-24  overflow-hidden rounded-full">
                <Image
                  src={profile?.profilePic || "/profile.jpg"}
                  alt="Profile picture"
                  
                  width={200}
                  height={200}
                  className="object-cover"
                  priority
                />
              </div>
            
            </div>

            <div className="sm:flex-1 flex-col overflow-hidden sm:space-y-4 space-y-1">
              <div className="flex gap-4 items-center sm:justify-between">
                <div className='flex  w-full items-center'>
                  <h2 className="sm:text-xl text-xs font-semibold">{profile?.username}</h2>
                
                  {profile.isVerified && <Verified className="fill-blue-500 text-white ml-1" />}
                  {profile._id === userId && profile.isVerified==false && (<Badge className='w-fit bg-slate-100 text-gray-600 rounded-full ml-3  pl-2 pr-2 '   >
                    <a className='flex gap-1 items-center' href='/get-verified'>
                      <Verified className="h-4 fill-blue-500 text-white w-4" />
                      get verified
                    </a>
                  </Badge>)}
                </div>
                {/* <div className=" hidden items-center gap-2">
                  {userId !== profile._id ? (
                    profile?.followers.flat().some((items: any) => items._id === userId) ? (
                      <Button  onClick={() => handleUnfollow(profile._id, userId)} className="bg-gray-100 hover:bg-gray-100 text-gray-800">
                        {loader ? <Loader className='w-5 h-5 sm:text-[14px] text-[12px] text-blue-500 animate-spin' /> : "Unfollow"}
                      </Button>
                    ) : (
                      <Button onClick={() => handleFollow(profile._id, userId)} className="bg-blue-500">
                        {loader ? <Loader className='w-5 h-5 text-white animate-spin'  /> : "Follow"}
                      </Button>
                        
                    )
                  ) : (
                      <>
                       <a href="/profile/edit-profile"><Button className="bg-gray-500 sm:flex hidden ">Edit Profile</Button></a> 
                        
                      </>
                      
                  )}

                  <DropDown userId={profile._id} authuser={userId} />
                  <Button onClick={() => handleMessageSave(profile._id)} className='bg-slate-100 text-gray-800 hover:bg-slate-50'>{messageLoader ? <Loader className='animate-spin w-5 h-5' /> : "message"}</Button>
                  {profile._id === userId && profile.isVerified==false && (<Button variant="ghost" size="icon">
                    <a href='/get-verified'>
                    <Verified className="h-5 w-5" />
                    </a>
                  </Button>)}
                </div> */}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 sm:gap-8">
                <div className="text-center">
                  <span className="font-semibold">{profile.posts?.length}</span>
                  <span className="text-muted-foreground ml-1">posts</span>
                </div>
                <div className="text-center">
                  <FollowersModal title="Followers" list={profile.followers || []} userid={userId} />
                </div>
                <div className="text-center">
                  <FollowersModal title="Following" list={profile.following || []} userid={userId} />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1 text-[12px] sm:text-[14px]">
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="flex items-center gap-1">
                  {profile?.bio}
                </p>
                <Link
                  href="https://github.com/OneNotSeven"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile?.website}
                  {profile.website ? <span className="text-green-500">✓</span> : null}
                </Link>
                <div className='flex gap-2'>
                                  
                  {profile.skills.slice(0, 3).map((skill: any,idx:number) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {skill.skill}
              
                    </Badge>
                  ))}
                </div>
              </div>
              {/* for small & big device */}
          <div className="flex  mt-2 items-center gap-2">
                  {userId !== profile._id ? (
                    profile?.followers.flat().some((items: any) => items._id === userId) ? (
                      <Button size="sm"  onClick={() => handleUnfollow(profile._id, userId)} className="bg-gray-100 hover:bg-gray-100 text-gray-800">
                        {loader ? <Loader className='w-5 h-5 sm:text-[14px] text-[12px] text-blue-500 animate-spin' /> : "Unfollow"}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleFollow(profile._id, userId)} className="bg-blue-500">
                        {loader ? <Loader className='w-5 h-5 text-white animate-spin'  /> : "Follow"}
                      </Button>
                        
                    )
                  ) : (
                      <>
                        <a href="/profile/edit-profile"><Button size="sm" className="bg-white border-[1px] text-gray-800 shadow-none flex ">Edit Profile</Button></a> 
                        
                      </>
                      
                )}
                
                <Button size="sm" onClick={() => handleMessageSave(profile._id)} className='bg-slate-100 text-gray-800 hover:bg-slate-50'>{messageLoader ? <Loader className='animate-spin w-5 h-5' /> : "message"}</Button>
                <DropDown userId={profile._id} authuser={userId} />
               
                 
                </div>
            </div>
          </div>
        </div>
        <hr className='sm:mt-8 mt-4' />
        <div className='pt-5 pb-20'>
          
          <AnotherProfileTweets data={profile.posts} userid={userId} setdelrender={setdelrender} />
        </div>
      </div > : <div className='w-full h-screen flex justify-center items-center'>
        <Loader2Icon className='w-8 h-8 text-blue-500 animate-spin' />
      </div>}
        
     
      </>
  )
}

const DropDown = ({ userId,authuser}:any) => {
  const [communityData, setcommunityData] = useState<any>([])
  const [requestStatus, setRequestStatus] = useState<{ [key: string]: boolean }>({});
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({}); // Prevent multiple clicks
    
    const [check, setcheck] = useState<boolean>(false)
   
   useEffect(() => {
    const communityFunc = async () => { 
         
        try {
          const wholeCommunity = await gettingCommmunity(userId)
          setcommunityData(wholeCommunity?.data || []) // Ensure fallback if no data
          const initialRequestState = wholeCommunity.data.reduce((acc: any, community: any) => {
            acc[community._id] = community.request.some((req: { userId: string }) => req.userId === userId) || 
                                 community.members.includes(userId);
            return acc;
          }, {});
          
          
        } catch (error) {
          console.error("Error fetching community data:", error)
        } 
      }
      if (userId) {
    
        communityFunc()
  }
   }, [check])
    
    const sendRequestJoin = async (communityId: string) => {
       
      if (processing[communityId]) return; // Prevent multiple clicks

      setProcessing((prev) => ({ ...prev, [communityId]: true }));
      try {
        
        const sendDetails = await sendRequest(authuser, communityId)
                if (sendDetails.success == true) { 
                  setcheck(true)
                  setRequestStatus((prev) => ({ ...prev, [communityId]: true }));
                }
      } catch (error) {
        
      } finally {
        setProcessing((prev) => ({ ...prev, [communityId]: false }));
    }
      }
    
   
    return (
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='sm:text-[14px]  text-[12px]' variant="outline">
            <span className='sm:flex hidden'>Community</span>
            <UserPlus2 className='sm:hidden'/>
          <ChevronDown className="h-5 w-5 ml-0 sm:ml-2" />
        </Button>
        
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-96 h-56 overflow-auto">
        {communityData.length > 0 ? (
          communityData.map((items: any, idx: number) => (
              <DropdownMenuItem key={idx} className="flex items-start justify-between space-y-2 p-3">
                  <div className='flex flex-col'>
                      
              <Link href={`/view-community/${items._id}`} className="font-medium text-blue-600 hover:underline">
                {items.branchName}
              </Link>
              <p className="text-[12px]">{items.bio || "No bio available"}</p>
                  </div>
                  {authuser!==items.adminId&&
                      <div>
                          {(items.request.some((user: { userId: string }) => user.userId === authuser) || 
                    items.members.includes(authuser) ) || requestStatus[items._id]  ? (
                    <Button  
                      className="text-[12px] px-2 py-1 h-8 ring-1 ring-black bg-white text-gray-900"
                    >
                      Requested
                    </Button>
                  ) : (
                    <Button 
                        onClick={(e) => { e.stopPropagation(), sendRequestJoin(items._id) }}
                        disabled={processing[items._id]}
                                                                    className={`text-[12px] px-2 py-1 h-8 bg-blue-500 text-white `}
                                                                     
                    >
                                                                    {processing[items._id] ? "sending..." : "Request"}
                    </Button>
                  )}
                          
                      </div>
                }   
                      
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="p-3 text-gray-500">No communities found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
      )
}




const FollowersModal = ({ title, list}: { title: string; list: any[]; userid:any }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  

  // Filter list based on search query (case-insensitive)
  const filteredList = list.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-semibold sm:px-4 px-1 flex gap-1" onClick={() => setOpen(true)}>
          <span>{list?.length}</span>
          <span>{title}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:grid sm:h-fit flex flex-col h-screen">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="space-y-3">
          {filteredList.length > 0 ? (
            filteredList.map((user: any,idx:number) => (
              <div key={idx} className="flex items-center gap-3 border-b pb-2">
                <Avatar>
                  <AvatarImage src={user.profilePic || "/profile.jpg"} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex gap-1 items-center">
                  <Link href={`/profiles/${user.username}`} className="text-gray-800 text-[14px] font-semibold hover:underline">
                      {user.name}
                    </Link>
                    <Link href={`/profiles/${user.username}`} className="text-gray-800 text-[12px] hover:underline">
                      {user.username}
                    </Link>
                    {user.isVerified && <Verified className="fill-blue-500 text-white" />}
                  </div>
                  <div className="w-80 truncate">
                    <span className="text-xs">{user.bio}</span>
                  </div>
                </div>

                {/* <Button className='bg-blue-500 text-white text-[14px]'>Follow</Button> */}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No users found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};




export default AnotherUserProfile

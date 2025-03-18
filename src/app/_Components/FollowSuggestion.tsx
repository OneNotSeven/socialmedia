import React, { useEffect, useState } from 'react'
import { BadgeCheck, Loader, Users, Verified } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { followUser, suggestedAccounts, unFollowUser } from '@/controllers/controller'



const FollowSuggestion = ({ userid}:any) => {
    const [suggested, setsuggested] = useState<any[]>([]);
      const [loader, setloader] = useState<boolean>(true);
      const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({}); // Track follow state per user
  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({}); // Per user loading state
  
   useEffect(() => {
          const getAccounts = async () => {
              try {
                  setloader(true);
                  const accounts = await suggestedAccounts(userid);
                  if (accounts.success) {
                      setsuggested(accounts.data);
  
                      // Initialize follow status (Assume default is false)
                      const initialFollowState = accounts.data.reduce((acc: any, user: any) => {
                          acc[user._id] = false; // Default: Not following
                          return acc;
                      }, {});
                      setFollowStatus(initialFollowState);
                  }
              } catch (error) {
                  console.error("Error fetching suggested accounts", error);
              } finally {
                  setloader(false);
              }
          };
  
          if (userid) {
              getAccounts();
          }
   }, [userid]);
  
    const handleFollow = async (userId: string, authuser: any): Promise<void> => {
          if (!userId || !authuser) return;
  
          setLoadingState((prev) => ({ ...prev, [userId]: true })); // Start loading effect
  
          setTimeout(async () => {
              const followapi = await followUser(userId, authuser);
  
              if (followapi.success) {
                  setFollowStatus((prev) => ({ ...prev, [userId]: true })); // Set as followed
              } else {
                  console.error("Follow API error:", followapi);
              }
  
              setLoadingState((prev) => ({ ...prev, [userId]: false })); // Stop loading effect
          }, 3000); // 3-second delay
      };
  
      // 🛠 Unfollow Logic (Separate Function)
      const handleUnfollow = async (userId: string, authuser: any): Promise<void> => {
          if (!userId || !authuser) return;
  
          setLoadingState((prev) => ({ ...prev, [userId]: true })); // Start loading effect
  
          setTimeout(async () => {
              const unfollowapi = await unFollowUser(userId, authuser);
  
              if (unfollowapi.success) {
                  setFollowStatus((prev) => ({ ...prev, [userId]: false })); // Set as unfollowed
              } else {
                  console.error("Unfollow API error:", unfollowapi);
              }
  
              setLoadingState((prev) => ({ ...prev, [userId]: false })); // Stop loading effect
          }, 3000); // 3-second delay
      };
  
  return (
    <>
        {/* Who to Follow */}
        <Card>
              <CardHeader>
          <CardTitle className="flex items-center text-lg">
        
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Who to Follow
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2">
                <div className="space-y-4">
                  {suggested.slice(0,3).map((item) => (
                    <div key={item._id} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage className=' object-cover' src={item.profilePic || "/profile.jpg"} alt="profile" />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold flex items-center">
                            {item.name}
                            {item.isVerified && <Verified className='fill-blue-500 text-white' />}
                          </div>
                          <p className='text-[12px]'>{ item.username}</p>

                        </div>
                      </div>
                       {followStatus[item._id] ? (
                                                      <Button size="sm"
                                                          className="bg-gray-300 text-black rounded-full"
                                                          disabled={loadingState[item._id]} 
                                                          onClick={() => handleUnfollow(item._id, userid)}
                                                      >
                                                          {loadingState[item._id] ?  <Loader className='w-5 h-5 text-white animate-spin'/>: "Unfollow"}
                                                      </Button>
                                                  ) : (
                                                      <Button size="sm"
                                                          className="bg-blue-500 text-white rounded-full"
                                                          disabled={loadingState[item._id]} 
                                                          onClick={() => handleFollow(item._id, userid)}
                                                      >
                                                          {loadingState[item._id] ? <Loader className='w-5 h-5 text-white animate-spin'/> : "Follow"}
                                                      </Button>
                                                  )}
                      
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
               <a href='/suggested'> <Button variant="ghost" size="sm" className="w-full text-primary justify-center">
                  Show more
          </Button></a>
        
              </CardFooter>
      </Card>
    </>
    )
} 


export default FollowSuggestion


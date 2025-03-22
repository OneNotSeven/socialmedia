"use client"
import React, { useEffect, useState } from 'react'
import { UsersIcon } from "lucide-react"
import Requests from './Requests'
import { gettingCommmunity } from '@/controllers/controller'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CommunityList = ({ userId }: any) => {
  const [communityId, setcommunityId] = useState<string>("")
  const [check, setcheck] = useState<boolean>(false)
  const [request, setrequest] = useState<any>()
  const [verify, setverify] = useState<boolean>(false)
  const [communityData, setcommunityData] = useState<any>([])
  const [communityname, setcommunityname] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const communityFunc = async () => {
      try {
        const wholeCommunity = await gettingCommmunity(userId)
        if (wholeCommunity.success == true) {
          setcommunityData(wholeCommunity?.data || []) 
          setverify(true)
        }
        
      } catch (error) {
        console.error("Error fetching community data:", error)
      } finally {
        setcheck(false)
      }
    }
    if (userId) {
      communityFunc()
    }
  }, [userId, check])

  return (
    <>
      {communityData.length > 0 && <div className='flex'>
        <div className="min-h-screen w-[600px] sm:w-full text-gray-100">
          <div className="mx-auto max-w-6xl p-4">
            <div className="space-y-2">
              {communityData?.map((items: any, idx: number) => (
                <>
                  <div key={idx} onClick={() => { 
                    setrequest(items.request);
                    setcommunityId(items._id);
                    setcheck(true);
                    setcommunityname(items.branchName);
                    if (window.innerWidth <= 640) {
                      setIsModalOpen(true);
                    }
                  }}
                    
                    className="flex items-center rounded-lg p-2 sm:p-4 transition-colors hover:bg-[#e3e3e3]"
                  >
                    <div className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-gray-800 hover:bg-gray-200">
                      <UsersIcon className="h-5 w-5 text-gray-800" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className='w-[350px] sm:w-[354px] truncate'>
                        <h3 className="font-medium text-gray-800 flex gap-2 items-center truncate">{items.branchName}
                          <Badge className='bg-gray-200 text-[8px] text-black ring-1 ring-blue-300'>Community</Badge>
                        </h3>
                        <p className="text-[12px] text-gray-800 truncate">{items.bio}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-center text-sm text-gray-800">
                      <div className="flex">
                        {items.members.map((info: any, idx: number) => (
                          <Avatar key={idx} className='w-5 h-5'>
                            <AvatarImage className='object-cover' src={info?.profilePic} alt="User Avatar" />
                            <AvatarFallback>AB</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className='flex gap-1'><span className='text-[12px]'>{items.members.length}</span>
                        <span className='text-[12px] font-semibold'>Members</span></div>
                    </div>
                  </div>
                  <hr />
                </>
              ))}
            </div>
          </div>
        </div>

        {window.innerWidth > 640 ? (
          <Requests userId={userId} communityId={communityId} request={request} branchname={communityname} setcheck={setcheck} />
        ) : (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-md w-full p-4 overflow-y-auto h-screen sm:grid flex flex-col sm:max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Community Requests</DialogTitle>
              </DialogHeader>
              <Requests userId={userId} communityId={communityId} request={request} branchname={communityname} setcheck={setcheck} />
              <DialogFooter>
                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>}

      {verify && communityData && communityData.length === 0 && <div className='sm:w-full  sm:h-full sm:flex sm:items-center sm:pt-10 sm:justify-center'>
        <Image src="/icon1.svg" alt="Icon" width={500} height={500} />
      </div>}
    </>
  )
}

export default CommunityList;

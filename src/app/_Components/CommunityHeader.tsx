"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Loader, MoreVertical, Users, Verified, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { leaveCommunity } from "@/controllers/controller";
import { Badge } from "@/components/ui/badge";

const MembersModal = ({ members, isOpen, setIsOpen, adminId,userId,communityId }: any) => {
  const [search, setSearch] = useState("");
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [memberList, setMemberList] = useState<any[]>(members);

  const filteredMembers = memberList?.filter((member: any) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (memberId: string) => {
    try {
      setLoadingIds((prev) => [...prev, memberId]);
      console.log("Removing member:", memberId);
      const leave = await leaveCommunity(communityId, memberId)
      if (leave.success == true) {
        setMemberList((prev) => prev.filter((member) => member._id !== memberId));
        
      }
    } catch (error) {
      
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== memberId));
    }
    
  };
  console.log("Removing member:", memberList);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="font-semibold sm:text-[14px] text-[10px] bg-slate-200 hover:bg-slate-200 text-gray-800">
          members <ChevronDown />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:grid sm:h-fit flex flex-col h-screen">
        <DialogHeader>
          <DialogTitle>Community Members</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Search members..."
          className="w-full p-2 border rounded-md mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-3">
          {filteredMembers?.map((member: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-2 border-b">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.profilePic || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex">
                <Link href={`/profiles/${member.username}`}><span className="font-semibold text-sm capitalize">{member.name}</span></Link>
                {member.isVerified && <Verified className="fill-blue-500 text-white ml-1" />}
                { member._id === adminId && <Badge className="text-[10px] bg-green-200 font-semibold text-green-600 p-0 ml-4 px-3 shadow-none">Admin</Badge>}
                  </div>
                <p className="text-xs text-gray-600">{member.bio}</p>
              </div>
              {adminId===userId && (<div>
                {
                  member._id !== adminId && (<Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(member._id)}
                  >
                     {loadingIds.includes(member._id) ? (
                    <Loader className="text-red-500 w-5 h-5 animate-spin" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  </Button>)
                }</div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CommunityHeader = ({ content,userId }: any) => {
  console.log("content header", content);
  const [isOpen, setIsOpen] = useState(false);
  const [popOpen, setpopOpen] = useState(false)
  const [Loading, setLoading] = useState(false)

  const leave = async (communityId: string, memberId: string) => {
    try {
      setLoading(true)
      const leaveProcess = await leaveCommunity(communityId, memberId)
      if (leaveProcess.success == true) {
        setLoading(false)
      }
      
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  
  }

  return (
    <>
      {content ? (
        <header className="bg-slate-100 text-gray-800 p-4 flex items-center sticky top-0 left-0 w-full z-10">
          {/* Back Button */}
          <Button variant="ghost" size="icon" className="sm:mr-2 mr-1">
            <a href="/view-community"><ArrowLeft className="h-6 w-6" /></a>
          </Button>

          {/* Community Avatar */}
          <Avatar className="sm:h-10 sm:w-10 w-5 h-5">
            <AvatarImage className="object-cover" src="/placeholder.svg" alt="Contact" />
            <AvatarFallback>
              <Users />
            </AvatarFallback>
          </Avatar>

          {/* Community Name and Member Count */}
          <div className="sm:ml-3 ml-2 flex-grow">
            <div className="flex gap-1">
              <span className="font-semibold sm:text-[16px] text-[12px] capitalize">{content?.branchName}</span>
              {content?.verified && <Verified className="fill-blue-500 text-white" />}
            </div>
            <p className="text-[10px]">{content?.members?.length} members</p>
          </div>

          {/* Admin Info */}
          <div className="flex gap-2 sm:mr-10  mr-0 items-center">
            <div className="sm:w-10 sm:h-10 w-5 h-5 rounded-full overflow-hidden">
              <Image
                className="object-cover"
                alt="profile pic"
                width={100}
                height={100}
                src={content?.adminId?.profilePic || "/placeholder.svg"}
              />
            </div>
            <div className="flex flex-col ">
              <span className="sm:text-[14px] text-[10px] flex gap-1 items-center font-semibold capitalize">
                <Link href={`/profiles/${content?.adminId?.username}`}>{content?.adminId?.name}</Link>
                {content?.adminId?.isVerified && <Verified className="fill-blue-500 sm:w-5 sm:h-5 w-3 h-3 text-white" />}
              </span>
              <span className="sm:text-[12px] text-[8px] font-semibold">Admin</span>
            </div>
          </div>

          {/* Members Button with Modal */}
          <MembersModal members={content?.members} isOpen={isOpen} setIsOpen={setIsOpen} adminId={content?.adminId?._id} userId={userId} username={content?.adminId?.username } communityId={ content._id} />

          {/* More Options Button */}
          <Popover open={popOpen} onOpenChange={setpopOpen}>
            <PopoverTrigger asChild>
                <Button onClick={() => setpopOpen(true)} variant="ghost" size="icon">
                    <MoreVertical className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
                <p className="text-sm">Leave this community?</p>
                <div className="mt-3 flex justify-end gap-2">
                    <Button onClick={() => setpopOpen(false)} variant="outline">Cancel</Button>
                <Button onClick={() => { leave(content._id, userId) }} variant="destructive">{Loading ? "..." : "Leave"}</Button>
                </div>
            </PopoverContent>
          </Popover>
          
        </header>
      ) : (
        // Skeleton Loading UI
        <header className="bg-slate-100 p-4 flex items-center sticky top-0 left-0 w-full z-10">
          <Skeleton className="w-10 h-10 rounded-full" /> {/* Avatar Placeholder */}
          <div className="ml-3 flex-grow">
            <Skeleton className="h-4 w-32 mb-1" /> {/* Community Name Placeholder */}
            <Skeleton className="h-3 w-20" /> {/* Members Count Placeholder */}
          </div>
          <div className="flex gap-2 mr-10 items-center">
            <Skeleton className="w-10 h-10 rounded-full" /> {/* Admin Profile Pic */}
            <div className="flex flex-col">
              <Skeleton className="h-4 w-28 mb-1" /> {/* Admin Name Placeholder */}
              <Skeleton className="h-3 w-12" /> {/* "Admin" Text Placeholder */}
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default CommunityHeader;
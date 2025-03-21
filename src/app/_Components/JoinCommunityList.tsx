"use client";

import { Skeleton } from '@/components/ui/skeleton';
import { joinedcommunitylist } from '@/controllers/controller';
import { UsersIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const JoinCommunityList = ({ userid, paramsid }: any) => {
  console.log("Joined Secret ID:", userid);
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const communityList = await joinedcommunitylist(userid);
        if (communityList.success) {
          setList(communityList.data);
        }
      } catch (error) {
        console.error("Error fetching community list:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userid) {
      fetchCommunities();
    }
  }, [userid]); // Added dependency to refetch when `userid` changes

  

  return (
    <div className="min-h-screen w-96 text-gray-100 mx-auto max-w-96">
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center p-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="ml-4 flex-1">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No Joined community</p>
      ) : (
        <div className="sticky top-0 h-screen">
          <div className="min-h-screen text-gray-100">
            <div className="mx-auto max-w-96">
              <div className="space-y-2">
                {list.map((item: any, idx: number) => (
                  <a key={idx} href={`/view-community/${item._id}`}>
                    <div
                      className={`flex w-full items-center p-4 transition-colors hover:bg-[#e3e3e3] ${
                        item._id === paramsid ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-gray-800 hover:bg-gray-200">
                        <UsersIcon className="h-5 w-5 text-gray-800" />
                      </div>
                      <div className="ml-4 flex-1 w-[354px] truncate">
                        <h3 className="font-medium text-gray-800 truncate">{item.branchName}</h3>
                        <p className="text-sm text-gray-800 truncate">{item.bio}</p>
                      </div>
                    </div>
                    <hr />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinCommunityList;

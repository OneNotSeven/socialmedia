"use client"
import React, { useEffect, useState } from 'react'
import { colorSchema } from '../_Styles/style'
import { Button } from '@/components/ui/button'
import { gettingAllCommmunity, sendRequest } from '@/controllers/controller'
import { Loader, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import SearchComponents from './SearchComponent'

const CommunitySearch = ({ userId }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [communityData, setCommunityData] = useState<any>([]);
  const [requestStatus, setRequestStatus] = useState<{ [key: string]: boolean }>({}); // Track request per community
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({}); // Prevent multiple clicks

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const response = await gettingAllCommmunity(userId);
        if (response.success) {
          setCommunityData(response.data);

          // Initialize request status
          const initialRequestState = response.data.reduce((acc: any, community: any) => {
            acc[community._id] = community.request?.some((req: { userId: string }) => req.userId === userId) || 
                                 community.members.includes(userId);
            return acc;
          }, {});

          setRequestStatus(initialRequestState);
        }
      } catch (error) {
        console.error("Error fetching communities", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCommunities();
    }
  }, [userId]);

  // 🛠 Handle Sending Request
  const handleSendRequest = async (communityId: string) => {
    if (processing[communityId]) return; // Prevent multiple clicks

    setProcessing((prev) => ({ ...prev, [communityId]: true }));

    try {
      const response = await sendRequest(userId, communityId);
      if (response.success) {
        setRequestStatus((prev) => ({ ...prev, [communityId]: true }));
      }
    } catch (error) {
      console.error("Error sending request", error);
    } finally {
      setProcessing((prev) => ({ ...prev, [communityId]: false }));
    }
  };

  return (
    <>
      {loading ? <CommunitySearchSkeleton /> : (
        <>
          <div className="relative mt-6">
            <SearchComponents />
          </div>

          {communityData.length > 0 && <div className="w-full max-w-96 bg-gray-850 border-2 p-6 border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <div className='flex justify-between items-center'>
              <span className='font-semibold'>Community</span>
              
            </div>
            <hr className='mt-4' />

            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {communityData.map((item: any, idx: number) => (
                  <li key={idx} className="py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users />
                      </div>
                      <div className="flex-1 capitalize min-w-0 ms-4">
                        <p className={`text-sm ${colorSchema.color} font-medium truncate`}>
                          {item.branchName}
                        </p>
                        <p className={`text-sm ${colorSchema.lightColor} truncate`}>
                          {item.bio}
                        </p>
                      </div>

                      {requestStatus[item._id] ? (
                        <Button size="sm" className="text-[12px] bg-purple-400 text-gray-100" disabled>
                          Requested
                        </Button>
                      ) : (
                        <Button size="sm"
                          onClick={() => handleSendRequest(item._id)}
                          className="text-[12px] bg-white hover:bg-slate-100 text-gray-900"
                          disabled={processing[item._id]} // Disable button while processing
                        >
                          {processing[item._id] ?   <Loader className='w-5 h-5 text-black animate-spin'/> : "Request"}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>}
        </>
      )}
    </>
  );
};

const CommunitySearchSkeleton = () => {
  return (
    <div className="w-full max-w-96 bg-gray-850 border-2 p-6 border-gray-200 mt-6 rounded-lg dark:bg-gray-800 dark:border-gray-700 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="w-40 h-5 rounded-md" />
        <Skeleton className="w-16 h-4 rounded-md" />
      </div>
      <hr className="mt-4" />

      <div className="flow-root mt-3">
        <ul role="list" className="divide-y divide-gray-300 dark:divide-gray-700">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li key={idx} className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Skeleton className="text-gray-500 w-5 h-5 rounded-full" />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <Skeleton className="w-32 h-4 rounded-md" />
                  <Skeleton className="w-24 h-3 mt-1 rounded-md" />
                </div>
                <Skeleton className="w-20 h-8 rounded-md" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunitySearch;

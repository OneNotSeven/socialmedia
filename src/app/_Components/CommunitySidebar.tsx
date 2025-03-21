"use client"
import { gettingCommmunity, getToken } from '@/controllers/controller'
import { UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import JoinCommunityList from './JoinCommunityList'
import { useParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

const CommunitySidebar = () => {
  const params = useParams()
  const router = useRouter()
  

  const [change, setchange] = useState<boolean>(true)
  const [communityData, setcommunityData] = useState<any>([])
  const [userId, setuserId] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getId = async () => {
      const userId = await getToken()
      setuserId(userId)
    }
    getId()
  }, [])

  useEffect(() => {
    const communityFunc = async () => {
      try {
        setLoading(true)
        const wholeCommunity = await gettingCommmunity(userId)
        setcommunityData(wholeCommunity?.data || []) // Ensure fallback if no data
        
      } catch (error) {
        console.error("Error fetching community data:", error)
      } finally {
        setLoading(false)
      }
    }
    if (userId) {
      communityFunc()
    }
  }, [userId])

 

  return (
    <>
      <div className={`flex border-l-2 border-r-2 sticky sm:max-w-96 sm:w-96 w-full top-0 h-screen flex-col ${params.id ? 'sm:flex hidden' : 'flex'}`}>

        <div className='flex pt-4 pb-4 justify-around'>
          <div className={`font-semibold ${change ? "text-blue-600" : null}`} onClick={() => setchange(true)}>
            <span>Your Community</span>
          </div>
          <div className={`font-semibold ${change == false ? "text-blue-600 " : null}`} onClick={() => { setchange(false) }}>
            <span>Joined Community</span>
          </div>
        </div>
        {change &&
          <div className='w-96'>
          
            {loading ? (
              <div className="text-gray-100 mx-auto ">
                <div className="space-y-2">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="flex items-center p-4">
                      <Skeleton className="h-10 w-10 rounded-md" /> {/* Icon Placeholder */}
                      <div className="ml-4 flex-1">
                        <Skeleton className="h-5 w-40 mb-1" /> {/* Community Name Placeholder */}
                        <Skeleton className="h-4 w-60" /> {/* Bio Placeholder */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : communityData.length > 0 ? (
              <div className='sticky top-0'>
                {change && (
                  <div className=" text-gray-100">
                    <div className="mx-auto  ">
                      <div className="space-y-2">
                        {communityData?.map((items: any, idx: any) => (
                         <a  key={idx} href={`/view-community/${items._id}`}> <div >
                            <div
                              key={idx}
                              className={`flex w-full ${items._id == params.id ? "bg-gray-100" : null} items-center p-4 transition-colors hover:bg-[#e3e3e3]`}
                            >
                              <div className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-gray-800 hover:bg-gray-200">
                                <UsersIcon className="h-5 w-5 text-gray-800" />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className='w-[354px] truncate'>
                                  <h3 className="font-medium text-gray-800 truncate">{items.branchName}</h3>
                                  <p className="text-sm text-gray-800 truncate">{items.bio}</p>
                                </div>
                              </div>
                            </div>
                            <hr />
                          </div></a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-10">You don’t have any community</p>
            )}
      </div>
          }

        {change === false && <JoinCommunityList userid={userId} paramsid={params.id} />}
      </div>
    </>
  )
}

export default CommunitySidebar

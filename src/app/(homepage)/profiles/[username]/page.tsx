"use client"
import AnotherUserProfile from '@/app/_Components/AnotherUserProfile'
import FollowSuggestion from '@/app/_Components/FollowSuggestion'
import SearchComponents from '@/app/_Components/SearchComponent'
import WhatsHappening from '@/app/_Components/WhatsHappening'
import { getToken } from '@/controllers/controller'
import { LucideLoaderCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const page = ({ params }: any) => {
  const { username }: any = React.use(params) 
  const [userId, setuserId] = useState<string>("")
   
    
         useEffect(() => {
        
            const getId = async () => {
              const userid = await getToken()
             
              setuserId(userid)
              
        
            }
            getId()
           
                
         }, [])
  return (
    <>
      {userId ? <div className='flex  w-full gap-1'>

        <AnotherUserProfile username={username} />
        <div className="sm:flex hidden mt-4 flex-col pt-3 sticky top-0 mr-5 ml-[44px] gap-4 
                        max-h-screen overflow-y-auto scrollbar-hide">
          <SearchComponents />
          
          <FollowSuggestion userid={userId} />
          <WhatsHappening />
          <div className="text-[12px] mb-4 w-[366px]">
            <span>Terms & Condition</span>
            <span className="pl-2">Policy</span>
            <span className="pl-2">Services</span>
            <span className="pl-2">Accessibility</span>
            <span className="pl-2">About</span>
            <p>@2025 Twins created by Aman Jha</p>
          </div>
        </div>
      </div> : <div className='w-full h-screen flex items-center justify-center'>
      <LucideLoaderCircle className='text-blue-500 animate-spin'/>
      </div>}
      </>
  )
}

export default page

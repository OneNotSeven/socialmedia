"use client"
import React, { useEffect, useState } from 'react'
import CommunitySearch from '../_Components/CommunitySearch'
import Uploadcontent from '../_Components/Uploadcontent'
import WhatsHappening from '../_Components/WhatsHappening'
import { getToken } from '@/controllers/controller'
import FollowSuggestion from '../_Components/FollowSuggestion'
import Tweets from '../_Components/Tweets'
import Header from '../_Components/Header'

const Page = () => {
  
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
      {
        userId &&
        <>
          

      <div  className='flex flex-col max-w-[650px] w-[650px] border border-gray-200 p-4 border-l items-center'>

        {/* <Story /> */}
        <Header/>
        <Uploadcontent user={ userId}/>
        <Tweets/>
      </div>
     <div className="sm:flex hidden flex-col sticky top-0 mr-5 ml-[44px] gap-4 
                max-h-screen overflow-y-auto scrollbar-hide">
  {userId && <CommunitySearch userId={userId} />}
  <WhatsHappening />
  <FollowSuggestion userid={userId} />
  <div className="text-[12px] mb-4 w-[366px]">
    <span>Terms & Condition</span>
    <span className="pl-2">Policy</span>
    <span className="pl-2">Services</span>
    <span className="pl-2">Accessibility</span>
    <span className="pl-2">About</span>
    <p>@2025 Twins created by Aman Jha</p>
  </div>
</div>
          </>
     }
      
    </>
  )
}

export default Page

"use client"
import CommunitySearch from '@/app/_Components/CommunitySearch'
import Suggested from '@/app/_Components/Suggested'
import WhatsHappening from '@/app/_Components/WhatsHappening'
import { getToken } from '@/controllers/controller'
import React, { useEffect, useState } from 'react'

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
      
      <div className='max-w-[650px] w-[650px]'>
                <h1>
                    
                    <Suggested userid={ userId} />
          </h1>
            </div>
            <div className='flex flex-col gap-3 mb-4'>
                {userId && <CommunitySearch userId={userId} />}
                <WhatsHappening />
            </div>
      </>
  )
}

export default Page
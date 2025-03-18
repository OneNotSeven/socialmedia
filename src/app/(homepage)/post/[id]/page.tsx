"use client"
import FollowSuggestion from '@/app/_Components/FollowSuggestion'
import Postid from '@/app/_Components/Postid'
import WhatsHappening from '@/app/_Components/WhatsHappening'
import { getToken } from '@/controllers/controller'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const { id } = useParams()
  
  const [userId, setuserId] = useState<string>("")
  useEffect(() => {
    const getId = async() => {
      const userid = await getToken()
      setuserId(userid)
    }
    getId()
  }, [])
  
  console.log("new era begins",id)
  return (
    <>
      <div className='flex w-full gap-2 justify-between'>

        <Postid postId={id} userId={userId} />
        <div className='sm:flex flex-col hidden gap-3'>

        <WhatsHappening />  
          <FollowSuggestion userid={userId } /> 
        </div>

      </div>
    </>
  )
}

export default Page
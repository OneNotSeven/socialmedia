"use client"
import { appBaseUrl } from '@/schema/appurl'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [userData, setuserData] = useState<Array<[]>>()
    useEffect(() => {
        const fetchuser = async () => {
            const getuser = await fetch(`${appBaseUrl}/api/users`, {
                method:"GET"
            })
            const data = await getuser.json()
            setuserData(data.data)
            console.log(data)
          
        }
        fetchuser()
    }, [])
    
  return (
      <>
          <div>
              {
                  userData?.map((items:any,idx:number) => (
                      <div key={idx}>
                        <a href={`/chats/${items.id}`}> <span>{ items.name}</span></a> 
                      </div>
                  ))
              }
      </div>
      </>
  )
}

export default Page;
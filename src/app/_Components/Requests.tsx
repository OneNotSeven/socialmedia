"use client"
import React, { useEffect, useState } from 'react'
import { colorSchema } from '../_Styles/style'
import { Button } from '@/components/ui/button'
import { RequestDeatail } from '@/helpers/types'
import { AcceptRequest, deleteCommunity, DenyRequest } from '@/controllers/controller'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader, Trash2 } from 'lucide-react'



const Requests = ({communityId ,request,setcheck,branchname }: RequestDeatail) => {
    const [requestData, setrequest] = useState([])
    const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
    const [requestStatus, setRequestStatus] = useState<{ [key: string]: any }>({});
    const [processingDeny, setProcessingDeny] = useState<{ [key: string]: any }>({});
    const [loader, setloader] = useState<boolean>(false)
    const [Check, setCheck] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false);
      const [popOpen, setpopOpen] = useState(false)
    console.log("request", request)
    useEffect(() => {
      
        setrequest(request)
    }, [request,Check])

    
    const accept = async (userId: string) => {
        setProcessing((prev) => ({ ...prev, [userId]: true }));
        try {
            
            const acceptProcess = await AcceptRequest(userId, communityId)
            if (acceptProcess.success == true) {
                setRequestStatus((prev) => ({ ...prev, [userId]: true }));
                setcheck(true)
                // setCheck(true)
            }
        } catch (error) {
            
        } finally {
            setProcessing((prev) => ({ ...prev, [userId]: false }));
            
        }
        // console.log("acceptProcess", acceptProcess)
    }

    const deny = async (userId: string) => {
        setProcessingDeny((prev) => ({ ...prev, [userId]: true }));
        try {
            
            const denyProcess = await DenyRequest(userId, communityId)
            if (denyProcess.success == true) {
                setRequestStatus((prev:any) => ({ ...prev, [userId]: "denied" })); // Update status
                // setCheck(true)
                setcheck(true)
            }
        } catch (error) {
            
        } finally {
            setProcessingDeny((prev) => ({ ...prev, [userId]: false }));
        }
       
    }

    const communityDelete = async () => {
        try {
            setloader(true)
            const deleteProcess = await deleteCommunity(communityId)
            if(deleteProcess.success==true){
                setloader(false)
                setcheck(true)
                setCheck(true)
            }
           
        } catch (error) {
            
        } finally {
            setloader(false)
        }
    }
    
  return (
      <>
       { requestData && communityId &&  <div className="sm:w-full w-full p-2 bg-gray-850  mt-6 rounded-lg sm:p-2 ml-3 dark:bg-gray-800 dark:border-gray-700">
              <div className='w-full flex justify-between items-center'>
                  <span className='font-semibold '><span className='uppercase font-semibold text-purple-600'>{ branchname}</span></span>
                  <div className='flex gap-2'>
                      <Link href={`/view-community/${communityId}`}>
                  <Button size="sm" className='flex text-[12px] sm:text-[16px] items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-600'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>View community</Button>
                      </Link>
                      
                      
                      <Popover open={popOpen} onOpenChange={setpopOpen}>
            <PopoverTrigger asChild>
            <Button size="sm" className='flex items-center gap-2 bg-white ring-1 ring-red-500 hover:bg-gray-300 text-red-500 '><Trash2 className='text-red-500'/>Delete</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
                <p className="text-sm">Delete this community?</p>
                <div className="mt-3 flex justify-end gap-2">
                    <Button onClick={() => setpopOpen(false)} variant="outline">Cancel</Button>
                                  <Button onClick={() => communityDelete()} variant="destructive">{loader ? <Loader className='w-5 h-5 text-white animate-spin' /> : "Delete"}</Button>
                </div>
            </PopoverContent>
          </Popover>
                     
                  </div>
                  
              </div>
             
          <div className="flex items-center justify-between mb-4">
              
      <form className="flex items-center w-full mt-5 mx-auto">   
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  
                          </div>
                    
              <Input type="text" id="simple-search" className=" text-gray-900 text-sm rounded-lg  block w-full ps-10 p-2.5  " placeholder="Search branch name..." required />
          </div>
         
      </form>
                
              </div>
              <div className='flex justify-between mb-2'>
                      <span className='text-sm font-semibold'>All Requets</span>
                      <span className='text-sm font-semibold hover:text-blue-600 hover:underline cursor-pointer'>Accept all</span>
      </div>
       <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-400 dark:divide-gray-700">
                      { 
                          requestData.map((items:any, idx:number) => (
                            <li key={idx} className="pt-3 pb-3 sm:pt-4">
                            <div className="flex items-center ">
                                <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full object-cover" src={items?.profilePic || "/profile.jpg"} alt=" image"/>
                                </div>
                                <div className="flex-1 min-w-0 ms-4">
                                    <p className="text-sm font-medium  truncate ">
                                              { items.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate ">
                                        {items.username}
                                    </p>
                                      </div>
                                      <div className='flex gap-1'>
                                          
                                          {!requestStatus[items.userId] ? <Button onClick={() => deny(items.userId)} className={`bg-gray-100 ${colorSchema.color} flex gap-2 justify-center items-center  hover:bg-gray-200 `}> {processingDeny[items.userId] ? "Rejecting..." : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red">
                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                </svg>
                Reject
            </>
        )}</Button>:null}
                                          {requestStatus[items.userId] ? null : <Button onClick={() => accept(items.userId)} className={`bg-gray-100 text-gray-800 ${colorSchema.color} flex gap-2 hover:bg-gray-200 items-center justify-center`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg> {processing[items.userId] ? "Accepting..." : "Accept"}</Button>}
                                          {
                                              requestStatus[items.userId]===true && <Button  className={`bg-gray-100 text-gray-800 ${colorSchema.color} flex gap-2 hover:bg-gray-200 items-center justify-center`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg> Accepted</Button>
                                          }
                                          
                                               {
                                                requestStatus[items.userId]==="denied" && <Button  className={`bg-white ring-1 ring-red-400 text-red-500 flex gap-2 hover:bg-gray-200 items-center justify-center`}> Rejected</Button>
                                            }
                                          
                                          
                                      </div>
                              
                            </div>
                        </li>
                          ))
                      }
                  
              </ul>
         </div>
          </div>}
        
          {!requestData&&<div className='sm:w-full hidden  sm:h-full sm:flex sm:items-center sm:pt-10 sm:justify-center'>
                  <Image src="/icon2.svg" alt="Icon" width={500} height={500} /></div>}
      </>
  )
}

export default Requests

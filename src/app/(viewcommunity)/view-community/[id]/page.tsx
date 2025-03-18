"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { ref, push, onValue, query, limitToLast, off, set } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Paperclip,Send, ArrowDownCircle, SmilePlus } from "lucide-react"
import { handleUpload } from "@/helpers/firebaseUpload"
import { getToken, sendRequest, singlecommunity } from "@/controllers/controller"
import { realDatabase } from "@/lib/firebase"
import { EditPageInfo } from "@/helpers/Profile"
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });
import emojiData from "@emoji-mart/data";
import CommunityHeader from "@/app/_Components/CommunityHeader"
import ChatSkeleton from "@/app/_Components/ChatSkeleton"

interface Message {
  id: string
  senderId: string
  senderName: string
  username: string
  profilePic: string
  text?: string
  mediaUrl?: string
  mediaType?: string
  timestamp: number
}

export default function WhatsAppChat({ params }: any) {
    const { id }: any = React.use(params)   
  console.log("realtime id", id)
  const [header, setheader] = useState<any>()
     const [showPicker, setShowPicker] = useState(false);
  const [userId, setUserId] = useState<any>()
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState<boolean>(false)
  const [populateInfo, setPopulateInfo] = useState<any>()
  const [loop, setloop] = useState<boolean>(false)
  const [value, setValue] = useState("")
  const [loader, setloader] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const MESSAGES_LIMIT = 10 // Load only 10 messages at a time

  useEffect(() => {
    const getId = async () => {
      const userid = await getToken()
      setUserId(userid)
      await EditPageInfo(userid, setPopulateInfo)
    }
    getId()


    const messagesRef = query(ref(realDatabase, `chats/${id}/messages`), limitToLast(MESSAGES_LIMIT))

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const loadedMessages = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
        setMessages(loadedMessages)
      }
    })

    return () => off(messagesRef) // Unsubscribe when component unmounts
  }, [id])

  useEffect(() => {
   
      const singlecommunityFunc = async() => {
        const communityres = await singlecommunity(id)
        if (communityres.success == true) {
          setheader(communityres.data)
          console.log("community header data",communityres)
        }
      
      }
      singlecommunityFunc()
  }, [id])
  

  useEffect(() => {
    if (!id) return
  
    const messagesRef = query(ref(realDatabase, `chats/${id}/messages`), limitToLast(10))
  
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
     
      if (data) {
        const loadedMessages = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
        setMessages(loadedMessages)
      }
    })
  
    return () => off(messagesRef)
  }, [userId,id])

  const handleTyping = () => {
    if (!userId) return

    const typingRef = ref(realDatabase, `chats/${id}/typing/${userId}`)
    
    set(typingRef, true)

    setTimeout(() => {
      set(typingRef, false)
    }, 3000)
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return

    const messagesRef = ref(realDatabase, `chats/${id}/messages`)

    push(messagesRef, {
      senderId: userId,
      senderName: populateInfo?.name,
      username: populateInfo?.username,
      profilePic: populateInfo?.profilePic || "",
      text: value,
      timestamp: Date.now(),
    })

    setValue("")
  }
  const addEmoji = (emoji: any) => {
    setValue((prev) => prev + emoji.native);
    setShowPicker(false); // Hide picker after selection
  };
  const handleFileUpload = async (file: File) => {
    try {
      const mediaUrl = await handleUpload(file)
      const mediaType = file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "file"

      const messagesRef = ref(realDatabase, `chats/${id}/messages`)

      push(messagesRef, {
        senderId: userId,
        senderName: populateInfo?.name,
        username: populateInfo?.username,
          profilePic: populateInfo?.profilePic,
          fileName: file.name,
        mediaUrl,
        mediaType,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error("File upload failed", error)
    }
  }
  const sendingRequest = async () => {
    try {
      setloader(true)
      const reqRes = await sendRequest(userId, id)
      if (reqRes.success == true) {
        setloop(true)
        setloader(false)
      }
    } catch (error) {
      console.log("err",error)
    } finally {
      setloader(false)
    }
  
}
  return (
    <>
    
      {header ? <div className="flex flex-col w-full h-screen bg-gray-50">
        {/* Header */}
        <CommunityHeader content={header} userId={userId} />

        {/* Chat Area */}

        {(header?.members.some((member: any) => member._id == userId) || header?.adminId._id == userId) ? (<div ref={chatContainerRef} className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide p-4 space-y-4 mt-[60px] mb-[10px]">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg p-3 max-w-xs ${msg.senderId === userId ? "bg-green-500 text-white" : "bg-white text-gray-800"}`}>
                <p className="text-xs font-bold">{msg.senderName}</p>
                {msg.text && <p>{msg.text}</p>}

                {msg.mediaType === "image" && (
                  <div className="relative">
                    <img src={msg.mediaUrl.message} alt="Sent image" className="rounded-lg mt-2 max-w-24 max-h-24" />
                    <a href={msg.mediaUrl.message} download className="absolute bottom-[-2.75 rem] left-32 bg-black bg-opacity-50 p-1 rounded-full">
                      <ArrowDownCircle className="h-5 w-5 text-white" />
                    </a>
                  </div>
                )}

                {/* Show Video */}
                {msg.mediaType === "video" && (
                  <div className="relative">
                    <video controls className="rounded-lg mt-2 max-w-72">
                      <source src={msg.mediaUrl.message} type="video/mp4" />
                    </video>
                    <a href={msg.mediaUrl.message} download className="absolute bottom-[-2.75 rem] left-80 right-2 bg-white bg-opacity-50 p-1 rounded-full">
                      <ArrowDownCircle className="h-5 w-5 text-gray-900" />
                    </a>
                  </div>
                )}

                {/* Show Other Files */}
                {msg.mediaType === "file" && (
                  <div className="p-3 bg-gray-200 rounded-lg mt-2 flex items-center space-x-2">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                    <a href={msg.mediaUrl.message} download={msg.fileName} className="text-blue-600 flex gap-2 hover:underline">
                      {msg.fileName} <ArrowDownCircle className="h-5 w-5 text-gray-900 " />
                    </a>
                  </div>
                )}

                <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {typing && <p className="text-sm text-gray-500 italic px-4">User is typing...</p>}
          <div ref={messagesEndRef} />
        </div>) : (<div className="w-full flex flex-col items-center justify-center gap-3 h-screen"><div className=" font-semibold flex justify-center items-center">you are not a member</div>
            {header.request.some((some: any) => some.userId == userId) || loop ?< Button >Requested</Button>: < Button className="bg-blue-500 text-white hover:bg-blue-500" onClick={() => sendingRequest()}>{loader ? "sending..." : "Send Request"}</Button>}
          </div>
        
        )}
        {(header?.members.some((member: any) => member._id == userId) || header?.adminId._id == userId) && (<div className="flex items-center bg-white">
          {header?.allowMessage ||  header?.adminId._id == userId ? (<div className="w-full flex p-3 h-20 items-center">


            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => setShowPicker(!showPicker)}
            >
              <SmilePlus className="w-5 h-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-6 w-6 text-gray-500" /></Button>
            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="bg-white flex items-center space-x-2 sticky bottom-0 left-0 w-full z-10">
          
              {showPicker && (
                <div className="absolute bottom-12 left-0 z-10 bg-white shadow-md rounded-lg">
                  <Picker data={emojiData} onEmojiSelect={addEmoji} />
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
       
              <Input value={value} onChange={(e) => { setValue(e.target.value); handleTyping(); }} placeholder="Type a message" />
              <Button type="submit" size="icon"><Send className="h-5 w-5" /></Button>
            </form>
          </div>) : <div className="w-full flex justify-center items-center"><div>Only <span className="font-semibold">Admins</span> can send message</div></div>}
          
        </div>)}
      </div> :<ChatSkeleton/>}
    </>
  )
}

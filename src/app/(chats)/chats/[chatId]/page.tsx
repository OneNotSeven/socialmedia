"use client";

import React, { useState, useEffect, useRef } from "react";
import { ref, push, onValue, off } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import { handleUpload } from "@/helpers/firebaseUpload";
import { getToken } from "@/controllers/controller";
import { realDatabase } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });
import emojiData from "@emoji-mart/data";
import { EditPageInfo } from "@/helpers/Profile";
import ChatHeader from "@/app/_Components/ChatHeader";

interface Message {
  id: string;
  senderName: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  timestamp: number;
}

const DirectChat = () => {
  const { chatId } = useParams(); // 🔥 chatId = Receiver's MongoDB _id
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [populateInfo, setPopulateInfo] = useState<any>()
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //      const getId = async () => {
  //         const userid = await getToken()
  //         setUserId(userid)
  //         await EditPageInfo(userid, setPopulateInfo)
  //       }
  //       getId()
  // }, []);

  useEffect(() => {

    const getId = async () => {
      const userid = await getToken()
      setUserId(userid)
      await EditPageInfo(userid, setPopulateInfo)
    }
    getId()
    if (!userId || !chatId) return;

    if (userId === chatId) {
      alert("Invalid chat! You cannot chat with yourself.");
      router.push("/chats"); // Redirect back
      return;
    }

    // 🔥 Each user has their own chat path
    const senderChatRef = ref(realDatabase, `directChats/${userId}/${chatId}`);
    const unsubscribe = onValue(senderChatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setMessages(loadedMessages);
      }
    });

    return () => off(senderChatRef);
  }, [userId, chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !userId) return;

    const messageData = {
      senderName: populateInfo?.name,
      username: populateInfo?.username,
      profilePic: populateInfo?.profilePic || "",
      senderId: userId,
      text: value,
      timestamp: Date.now(),
      read: false,
    };

    // 🔥 Save message in sender's chat
    const senderRef = ref(realDatabase, `directChats/${userId}/${chatId}`);
    push(senderRef, messageData);

    // 🔥 Save message in receiver's chat
    const receiverRef = ref(realDatabase, `directChats/${chatId}/${userId}`);
    push(receiverRef, messageData);

    setValue("");
  };

  return (
    <div className="flex flex-col  w-full h-screen bg-gray-50">
      <div className="h-16 bg-white shadow flex items-center px-4">
        <ChatHeader userId={ chatId} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === userId ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}>
            <p className="text-xs font-bold">{msg?.senderName}</p>
              {msg.text && <p>{msg.text}</p>}
              <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setShowPicker(!showPicker)}>
          <SmilePlus className="w-5 h-5" />
        </Button>
        <form onSubmit={handleSendMessage} className="flex flex-1">
          {showPicker && (
            <div className="absolute bottom-16 left-4 bg-white shadow-md rounded-lg">
              <Picker data={emojiData} onEmojiSelect={(emoji: any) => setValue(value + emoji.native)} />
            </div>
          )}
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type a message..." />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DirectChat;

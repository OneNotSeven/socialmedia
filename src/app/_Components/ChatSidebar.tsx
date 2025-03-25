"use client";

import { chatSideInfo, getToken } from "@/controllers/controller";
import { ref, onValue, off, update } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DirectMessageSidebar = () => {
  const params = useParams();
  const router=useRouter()
  const [userId, setUserId] = useState<string | null>(null);
  const [infoUser, setInfoUser] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: boolean }>({});
  const [lastMessages, setLastMessages] = useState<{ [key: string]: { text: string; timestamp: number; senderId: string } }>({});

  // Fetch user details and chat list
  useEffect(() => {
    const getContent = async () => {
      setLoading(true);
      const userid = await getToken();
      if (userid) {
        const UserInfo = await chatSideInfo(userid);
        if (UserInfo.success === true) {
          setInfoUser(UserInfo.data[0].chatArray);
        }
      }
      setUserId(userid);
      setLoading(false);
    };
    getContent();
  }, []);

  // Fetch last messages & unread status
  useEffect(() => {
    if (!userId || infoUser.length === 0) return;

    const lastMessageTracker: { [key: string]: { text: string; timestamp: number; senderId: string } } = {};
    const unreadTracker: { [key: string]: boolean } = {};
    const unsubscribers: (() => void)[] = [];

    infoUser.forEach((user) => {
      const chatRef = ref(realDatabase, `directChats/${userId}/${user._id}`);

      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messages = Object.values(data);
          const latestMessage: any = messages[messages.length - 1];

          lastMessageTracker[user._id] = {
            text: latestMessage?.text || "No messages yet",
            timestamp: latestMessage?.timestamp || 0,
            senderId: latestMessage?.senderId || "",
          };

          if (latestMessage?.senderId !== userId) {
            const lastSeenTimestamp = localStorage.getItem(`lastSeen_${user._id}`);
            unreadTracker[user._id] = lastSeenTimestamp ? latestMessage.timestamp > Number(lastSeenTimestamp) : true;
          } else {
            unreadTracker[user._id] = false;
          }
        }

        // Update state only once after collecting data
        setLastMessages({ ...lastMessageTracker });
        setUnreadMessages({ ...unreadTracker });

        // Sort users by last message timestamp once
        setInfoUser((prevUsers) =>
          [...prevUsers].sort((a, b) => (lastMessageTracker[b._id]?.timestamp || 0) - (lastMessageTracker[a._id]?.timestamp || 0))
        );
      });

      unsubscribers.push(() => off(chatRef, "value", unsubscribe));
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [userId, JSON.stringify(infoUser)]); 


  // Mark message as read when user clicks
  const handleChatClick = (chatId: string) => {
    localStorage.setItem(`lastSeen_${chatId}`, Date.now().toString());
    setUnreadMessages((prev) => ({ ...prev, [chatId]: false }));
    
      if (!userId) return;
    
      const chatRef = ref(realDatabase, `directChats/${userId}/${chatId}`);
    
      onValue(chatRef, (snapshot) => {
        const chatData = snapshot.val();
        if (!chatData) return;
    
        Object.keys(chatData).forEach((msgId) => {
          if (chatData[msgId].read === false && chatData[msgId].senderId !== userId) {
            const messageRef = ref(realDatabase, `directChats/${userId}/${chatId}/${msgId}`);
            update(messageRef, { read: true }); // ✅ Mark messages as read
          }
        });
      }, { onlyOnce: true }); // ✅ Ensures it updates once when clicked

      router.push(`/chats/${chatId}`); // ✅ Navigate to chat
  
  };

  return (
    <div className={`flex border-l-2 border-r-2 sticky sm:max-w-96 sm:w-96 w-full top-0 h-screen flex-col ${params.chatId ? "sm:flex hidden" : "flex"}`}>
      <div className="flex pt-4 pb-4 justify-center font-semibold text-blue-600">
        <span>Direct Messages</span>
      </div>
      <div className="sm:w-96 w-full">
        {loading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex items-center p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>
            ))}
          </div>
        ) : infoUser.length > 0 ? (
          <div className="space-y-2">
            {infoUser.map((user: any, idx: number) => (
              <Link key={idx} href={`/chats/${user._id}`} onClick={() => handleChatClick(user._id)}>
                <div className={`flex items-center p-4 transition-colors hover:bg-[#e3e3e3] ${user._id == params.id ? "bg-gray-100" : ""}`}>
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user?.profilePic || "/profile.jpg"} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  <div className="ml-4 flex-1 truncate relative">
                    <h3 className="font-medium text-gray-800 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessages[user._id]?.senderId === userId ? "You: " : `${user.name}: `}
                      {lastMessages[user._id]?.text || "No messages yet"}
                    </p>
                    {unreadMessages[user._id] && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>}
                  </div>
                </div>
                <hr />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No recent chats</p>
        )}
      </div>
    </div>
  );
};

export default DirectMessageSidebar;

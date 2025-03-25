"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Home, Search, User, Users, Verified, HelpCircle, SearchIcon, HomeIcon, MoreHorizontalIcon, Send } from "lucide-react";
import { ref, onValue, update, off } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import { BasicInfo, getToken, LogOut } from "@/controllers/controller";
import NotificationSlider from "./NotificationSlider";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = ({ check }: any) => {
  const router = useRouter()
  const params = useParams() as Record<string, string>
  const pathname = usePathname();
  const [loader, setloader] = useState<boolean>(false)
  const [showLogout, setShowLogout] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [hasNewComment, setHasNewComment] = useState<boolean>(false);
  const [hasNewLike, setHasNewLike] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [infoUser, setinfoUser] = useState<any[]>([])
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  

  useEffect(() => {
    setCollapsed(check);
  }, [check]);

  useEffect(() => {
    const getUserId = async () => {
      const fetchedUserId = await getToken();
      if (fetchedUserId) {
        
                const UserInfo = await BasicInfo(fetchedUserId)
                if (UserInfo.success == true) {
                  
                  setinfoUser(UserInfo.data)
                }
              }

      if (fetchedUserId) {
        setUserId(fetchedUserId);
        listenForNotifications(fetchedUserId);
        listenForUnreadMessages(fetchedUserId);
      }
    };
    getUserId();
  }, []);
  

  // Listen for notifications (separate unread status for comments and likes)
  const listenForNotifications = (authUserId: string) => {
    const userNotificationsRef = ref(realDatabase, `notifications/${authUserId}`);

    onValue(userNotificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const notificationsData = snapshot.val();
        
        // Check if there's an unread comment notification
        const hasUnreadComment = Object.values(notificationsData).some(
          (notif: any) => notif.type === "comment" && !notif.isRead
        );

        // Check if there's an unread like notification
        const hasUnreadLike = Object.values(notificationsData).some(
          (notif: any) => notif.type === "like" && !notif.isRead
        );

        setHasNewComment(hasUnreadComment);
        setHasNewLike(hasUnreadLike);
      } else {
        setHasNewComment(false);
        setHasNewLike(false);
      }
    });
  };

  // Mark all notifications as read
  const markNotificationsAsRead = async () => {
    if (!userId) return;
    const userNotificationsRef = ref(realDatabase, `notifications/${userId}`);

    onValue(userNotificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        Object.entries(snapshot.val()).forEach(([notificationId, notification]: any) => {
          if (!notification.isRead) {
            update(ref(realDatabase, `notifications/${userId}/${notificationId}`), {
              isRead: true,
            });
          }
        });

        setHasNewComment(false);
        setHasNewLike(false);
      }
    }, { onlyOnce: true });
  };

  const handler = () => {
    markNotificationsAsRead();
    setCollapsed((prev) => !prev);
    setIsSliderOpen((prev) => !prev);
  };

  const logout = async () => {
    try {
      setloader(true)
      const loggingOut = await LogOut()
      if (loggingOut.success == true) {
        setShowLogout(false);
        router.push("/login")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloader(false)
    }
  }

  const listenForUnreadMessages = (authUserId: string) => {
    const userChatsRef = ref(realDatabase, `directChats/${authUserId}`);
  
    const unsubscribe = onValue(userChatsRef, (snapshot) => {
      const chatData = snapshot.val();
      console.log("🔥 Fetched Chat Data:", chatData); // 🔍 Debug log
  
      if (!chatData) {
        setUnreadMessages(0);
        return;
      }
  
      let totalUnread = 0;
      Object.entries(chatData).forEach(([chatId, chat]: any) => {
        console.log(`📨 Chat with ${chatId}:`, chat); // 🔍 Debug log
  
        const unreadCount = Object.values(chat).filter(
          (msg: any) => msg?.read === false && msg.senderId !== authUserId
        ).length;
  
       
        totalUnread += unreadCount;
      });
  
     
      setUnreadMessages(totalUnread);
    });
  
    return () => off(userChatsRef);
  };

 

  return (
    <>
      <div className="sticky hidden h-screen top-0 sm:flex">
        <div className={`h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-72"}`}>
          <div className="h-[72px] flex items-center px-2">
            {!collapsed && <span className="text-3xl pl-3 font-bold"><span className="font-[Pacifico]">Twins</span></span>}
          </div>

          <aside id="logo-sidebar" className="h-full flex flex-col  overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <div>

            <ul className={`space-y-2 mt-2 pl-2 font-medium ${check ? "pl-4" : ""}`}>

              <Link href="/">

              <li className="cursor-pointer" >
                <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Home />
                  {!collapsed && <span className="ms-3">Home</span>}
                </div>
              </li>
              </Link>
              <Link href="/explore">

              <li className="cursor-pointer" >
                <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Search />
                  {!collapsed && <span className="ms-3">Explore</span>}
                </div>
              </li>
              </Link>

            
              <li className="cursor-pointer" onClick={handler}>
                <p className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <Bell />
                 
                  {hasNewComment && (
                    <span className="absolute top-1 right-3 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  
                  {hasNewLike && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                  {!collapsed && <span className="ms-3">Notifications</span>}
                </p>
                </li>
                <Link href="/chats">
                <li className="cursor-pointer" >
                  
                  <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Send />
                      <div className="flex justify-between w-full">
                        
                    {!collapsed && <span className="ms-3">Direct Message</span>}
                    {unreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadMessages}
              </span>
            )}
                      </div>
                </div>
              </li>
                </Link>

              <Link href={`/profiles/${infoUser[0]?.username}`}>
              
              <li className="cursor-pointer" >
                <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User />
                  {!collapsed && <span className="ms-3">Profile</span>}
                </div>
              </li>
              </Link>
            </ul>

            <ul className={`pt-4 mt-4 pl-2 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 ${check ? "pl-4" : ""}`}>
              <li>
                <a href="/get-verified" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                  <Verified />
                  {!collapsed && <span className="ms-3">Verified</span>}
                </a>
              </li>
              <li>
                <Link href="/build-community" className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Users />
                  {!collapsed && <span className="ms-3">Build Community</span>}
                </Link>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                  <HelpCircle />
                  {!collapsed && <span className="ms-3">Help</span>}
                </a>
              </li>
            </ul>
            </div>
            {infoUser && infoUser[0]?.username && (
      <div className={`w-full mt-36 bg-slate-100 rounded-lg flex items-center ${collapsed?"justify-center":null} gap-3 p-3 relative`}>
        {/* Avatar */}
        <Avatar>
          <AvatarImage className="object-cover" src={infoUser[0]?.profilePic || "/profile.jpg"} />
          <AvatarFallback>{infoUser[0]?.username?.charAt(1).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* User Info */}
                {!collapsed && <div className="flex flex-col flex-grow">
                  <p className="font-semibold">{infoUser[0]?.name}</p>
                  <p className="text-[12px] text-gray-400">{infoUser[0]?.username}</p>
                </div>}

        {/* Three Dots Button */}
                {!collapsed &&
                  <div className="relative">
                    <button onClick={() => setShowLogout(!showLogout)}>
                      <MoreHorizontalIcon className="cursor-pointer" />
                    
                    </button>

                    {/* Logout Popup */}
                    {showLogout && (
                      <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md p-2 z-50">
                        <button
                          onClick={() => {
                            // Add logout logic here
                            logout()
                  
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
                        >
                          {loader ? "Logout..." : "Logout"}
                        </button>
                      </div>
                    )}
                  </div>}
      </div>
    )}
          </aside>
        </div>
      </div>

      {/* 🔔 Notification Slider Component */}
      {isSliderOpen && (
        <NotificationSlider onClose={() => { setIsSliderOpen(false); setCollapsed(false); }} userId={userId} />
      )}

      <div className={`w-full sm:hidden h-16 flex items-center justify-center  fixed bottom-0 bg-white shadow-lg z-50 ${pathname==`/view-community/${params.chatId}` || pathname==`/chats/${params.id}` ? 'hidden' : 'flex'}`}>
        <div className="flex w-full">
          <div className="flex justify-evenly w-full items-center h-12 rounded-t-md gap-2">
            <Link href="/">

            <div ><HomeIcon className={`text-gray-700 ${pathname=="/"?'text-indigo-600':null}`}/></div>
            </Link>
            <Link href="/build-community">

            <div > <Users className={`text-gray-700 ${pathname=="/build-community"?'text-indigo-600':null}`} /></div>
            </Link>
            <Link href="/explore">
            <div ><SearchIcon className={`text-gray-700 ${pathname=="/explore"?'text-indigo-600':null}`}/></div>
            </Link>
            <div className="relative" onClick={handler}>
            {hasNewLike && (
                    <span className="absolute top-0 left-5 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
            <div ><Bell className={`text-gray-700 ${isSliderOpen?'text-indigo-600':null}`}/></div>
            </div>
            <Link href={`/profiles/${infoUser[0]?.username}`}>
              <div >
                {/* <User className={`text-gray-700 ${pathname == params ? 'text-indigo-600' : null}`} /> */}
                <div className={`relative  w-6 h-6 ${pathname == `/profiles/${infoUser[0]?.username}` ? 'ring-indigo-600 ring-2' : null}  overflow-hidden rounded-full`}>
                                <Image
                                  src={infoUser[0]?.profilePic || "/profile.jpg"}
                                  alt="Profile picture"
                                  
                                  width={200}
                    height={200}
                    quality={100}
                                  className="object-cover"
                                  priority
                  />
            
                              </div>
              </div>
            </Link>
</div>
        </div>
      </div>
      <div className={`sm:hidden absolute top-2 right-3 ${pathname==`/` ? 'flex' : 'hidden'}`}>
      <Link href="/chats" className="cursor-pointer">
                
                  
                  <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Send />
                    
                 
                </div>
                {unreadMessages > 0 && (
              <span className="bg-red-500 absolute top-1 right-[-8px] text-white text-xs px-2 py-1 rounded-full">
                {unreadMessages}
              </span>
            )}
                </Link>
      </div>
    </>
  );
};

export default Sidebar;

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Home, Search, User, Users, Verified, HelpCircle, SearchIcon, HomeIcon } from "lucide-react";
import { ref, onValue, update } from "firebase/database";
import { realDatabase } from "@/lib/firebase";
import { BasicInfo, getToken } from "@/controllers/controller";
import NotificationSlider from "./NotificationSlider";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Sidebar = ({ check }: any) => {
  const router = useRouter()
  const params = useParams() as Record<string, string>
  const pathname = usePathname();
  
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [hasNewComment, setHasNewComment] = useState<boolean>(false);
  const [hasNewLike, setHasNewLike] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [infoUser, setinfoUser] = useState<any[]>([])

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

  return (
    <>
      <div className="sticky hidden h-screen top-0 sm:flex">
        <div className={`h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-72"}`}>
          <div className="h-[72px] flex items-center px-2">
            {!collapsed && <span className="text-3xl pl-3 font-bold"><span className="font-[Pacifico]">Twins</span></span>}
          </div>

          <aside id="logo-sidebar" className="h-full overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <ul className={`space-y-2 mt-2 pl-2 font-medium ${check ? "pl-4" : ""}`}>

              <a href="/">

              <li className="cursor-pointer" >
                <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Home />
                  {!collapsed && <span className="ms-3">Home</span>}
                </div>
              </li>
              </a>
              <a href="/explore">

              <li className="cursor-pointer" >
                <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Search />
                  {!collapsed && <span className="ms-3">Explore</span>}
                </div>
              </li>
              </a>

            
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

              <a href={`/profiles/${infoUser[0]?.username}`}>
              
              <li className="cursor-pointer" >
                <div className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User />
                  {!collapsed && <span className="ms-3">Profile</span>}
                </div>
              </li>
              </a>
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
          </aside>
        </div>
      </div>

      {/* 🔔 Notification Slider Component */}
      {isSliderOpen && (
        <NotificationSlider onClose={() => { setIsSliderOpen(false); setCollapsed(false); }} userId={userId} />
      )}

      <div className={`w-full sm:hidden h-16 flex items-center justify-center  fixed bottom-0 bg-white shadow-lg z-50 ${pathname==`/view-community/${params.id}` ? 'hidden' : 'flex'}`}>
        <div className="flex w-full">
          <div className="flex justify-evenly w-full items-center h-12 rounded-t-md gap-2">
            <a href="/">

            <div ><HomeIcon className={`text-gray-700 ${pathname=="/"?'text-indigo-600':null}`}/></div>
            </a>
            <a href="/build-community">

            <div > <Users className={`text-gray-700 ${pathname=="/build-community"?'text-indigo-600':null}`} /></div>
            </a>
            <a href="/explore">
            <div ><SearchIcon className={`text-gray-700 ${pathname=="/explore"?'text-indigo-600':null}`}/></div>
            </a>
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
    </>
  );
};

export default Sidebar;

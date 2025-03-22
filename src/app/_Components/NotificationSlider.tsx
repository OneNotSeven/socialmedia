import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gettingNotification } from "@/controllers/controller";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface NotificationSliderProps {
  onClose: () => void;
  userId: string;
}

const NotificationSlider = ({ onClose, userId }: NotificationSliderProps) => {
  const [newNotifications, setNewNotifications] = useState([]);
  const [oldNotifications, setOldNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await gettingNotification(userId);
        if (response?.success) {
          setNewNotifications(response.newNotifications);
          setOldNotifications(response.oldNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userId]);

  const truncateText = (text: string, maxLength = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...Show More` : text;
  };


  return (
    <div className="fixed sm:left-[72px] left-0 sm:w-fit w-full inset-0 z-50 flex h-screen justify-end">
      {/* Background Overlay */}
      <div className="absolute inset-0 w-fit bg-opacity-50" onClick={onClose} />

      {/* Sliding Notification Panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative sm:w-96 w-full h-full bg-white shadow-sm rounded-md border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto h-screen pb-36 p-4">
          {loading ? (
            <div className="text-gray-500 w-full flex text-center gap-2 mt-10">
              <div className="w-10 h-10">
            <Skeleton className="w-full h-full rounded-md" />
              </div>
              <div className="flex flex-col gap-1">

              <div className="w-80 h-4">
            <Skeleton className="w-full h-full rounded-md" />
                </div>
                <div className="w-80 h-4">
            <Skeleton className="w-full h-full rounded-md" />
              </div>
              </div>
            </div>
          ) : newNotifications.length === 0 && oldNotifications.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No new notifications</p>
          ) : (
            <>
              {/* New Notifications */}
              {newNotifications.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    New
                  </h3>
                  {newNotifications.map((notif:any, index:number) => (
                    <div key={index} className="flex items-center p-2 border-b dark:border-gray-700">
                      {/* User Profile Pic */}
                      <img
                        src={notif.userId?.profilePic || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full mr-3"
                      />

                      <div className="flex-1">
                        <p className="text-sm">
                          <a href={`profiles/${notif.userId?.username}`}><span className="font-semibold">{notif.userId?.name}</span></a>{" "}
                          <a href={`profiles/${notif.userId?.username}`}> <span className="text-blue-500 cursor-pointer text-sm">{notif.userId?.username}</span></a>{" "}
                          {notif.type === "like" ? "liked" : "commented on"} your tweet.
                        </p>
                        {notif.contentId && (
                         <Link href={`/post/${notif.contentId._id}`}>
                            
                         <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              "{truncateText(notif.contentId.text)}"
                            </p>
                          </div>
                         </Link> 
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Old Notifications */}
              {oldNotifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Older
                  </h3>
                  {oldNotifications.map((notif:any, index:number) => (
                    <div key={index} className="flex items-center p-2 border-b dark:border-gray-700">
                      {/* User Profile Pic */}
                      <img
                        src={notif.userId?.profilePic || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full mr-3"
                      />

                      <div className="flex-1">
                        <p className="text-sm">
                        <a href={`profiles/${notif.userId?.username}`}><span className="font-semibold">{notif.userId?.name}</span></a>{" "}
                        <a href={`profiles/${notif.userId?.username}`}> <span className="text-blue-500 cursor-pointer text-sm">{notif.userId?.username}</span></a>{" "}
                          {notif.type === "like" ? "liked" : "commented on"} your tweet.
                        </p>
                        {notif.contentId && (
                          <a href={`post/${notif.contentId._id}`}><div className="mt-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                          &quot;{truncateText(notif.contentId.text)}&quot;
                          </p>
                        </div></a>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSlider;

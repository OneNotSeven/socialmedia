import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { followUser,  suggestedAccounts, unFollowUser } from '@/controllers/controller'; // Import unfollow API
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Loader, Verified } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Suggested = ({ userid }: any) => {
    const [suggested, setsuggested] = useState<any[]>([]);
    const [loader, setloader] = useState<boolean>(true);
    const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({}); // Track follow state per user
    const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({}); // Per user loading state

    useEffect(() => {
        const getAccounts = async () => {
            try {
                setloader(true);
                const accounts = await suggestedAccounts(userid);
                if (accounts.success) {
                    setsuggested(accounts.data);

                    // Initialize follow status (Assume default is false)
                    const initialFollowState = accounts.data.reduce((acc: any, user: any) => {
                        acc[user._id] = false; // Default: Not following
                        return acc;
                    }, {});
                    setFollowStatus(initialFollowState);
                }
            } catch (error) {
                console.error("Error fetching suggested accounts", error);
            } finally {
                setloader(false);
            }
        };

        if (userid) {
            getAccounts();
        }
    }, [userid]);

    // 🛠 Follow Logic
    const handleFollow = async (userId: string, authuser: any): Promise<void> => {
        if (!userId || !authuser) return;

        setLoadingState((prev) => ({ ...prev, [userId]: true })); // Start loading effect

        setTimeout(async () => {
            const followapi = await followUser(userId, authuser);

            if (followapi.success) {
                setFollowStatus((prev) => ({ ...prev, [userId]: true })); // Set as followed
            } else {
                console.error("Follow API error:", followapi);
            }

            setLoadingState((prev) => ({ ...prev, [userId]: false })); // Stop loading effect
        }, 3000); // 3-second delay
    };

    // 🛠 Unfollow Logic (Separate Function)
    const handleUnfollow = async (userId: string, authuser: any): Promise<void> => {
        if (!userId || !authuser) return;

        setLoadingState((prev) => ({ ...prev, [userId]: true })); // Start loading effect

        setTimeout(async () => {
            const unfollowapi = await unFollowUser(userId, authuser);

            if (unfollowapi.success) {
                setFollowStatus((prev) => ({ ...prev, [userId]: false })); // Set as unfollowed
            } else {
                console.error("Unfollow API error:", unfollowapi);
            }

            setLoadingState((prev) => ({ ...prev, [userId]: false })); // Stop loading effect
        }, 3000); // 3-second delay
    };

    return (
        <>
            <div className="mt-4">
                <h1 className="font-semibold text-xl">Suggested Accounts</h1>
            </div>

            {loader ? (
                <div className="mt-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="w-40 h-4 rounded-md" />
                                <Skeleton className="w-32 h-3 rounded-md" />
                            </div>
                            <Skeleton className="w-20 h-8 rounded-md" />
                        </div>
                    ))}
                </div>
            ) : suggested.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No any suggestion</p>
            ) : (
                <div className="mt-4">
                    {suggested.map((item) => (
                        <div
                            key={item._id}
                            className="p-3 flex justify-between items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                        >
                            <div className="flex gap-3 items-center">
                                <Avatar className='flex items-center justify-center'>
                                    <AvatarImage className=' object-cover' src={item.profilePic || "/profile.jpg"} alt="User Avatar" />
                                    <AvatarFallback className='flex items-center '>{item.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-1">
                                       <a  href={ `/profiles/${item.username}`}><p className="text-sm font-medium">{item.name}</p></a> 
                                        {item.isVerified && <Verified className="fill-blue-500 text-white" />}
                                        <p className="text-xs text-gray-500">{item.username || ""}</p>
                                    </div>
                                    <p className="text-gray-800 text-sm">{item.bio}</p>
                                </div>
                            </div>

                            {followStatus[item._id] ? (
                                <Button
                                    className="bg-gray-300 text-black"
                                    disabled={loadingState[item._id]} 
                                    onClick={() => handleUnfollow(item._id, userid)}
                                >
                                    {loadingState[item._id] ?  <Loader className='w-5 h-5 text-white animate-spin'/> : "Unfollow"}
                                </Button>
                            ) : (
                                <Button
                                    className="bg-blue-500 text-white"
                                    disabled={loadingState[item._id]} 
                                    onClick={() => handleFollow(item._id, userid)}
                                >
                                    {loadingState[item._id] ?  <Loader className='w-5 h-5 text-white animate-spin'/> : "Follow"}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Suggested;

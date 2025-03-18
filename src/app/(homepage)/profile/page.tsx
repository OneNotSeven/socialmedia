"use client"
import { Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EditPageInfo } from "@/helpers/Profile"
import { useEffect, useState } from "react"
import { getToken } from "@/controllers/controller"

export default function ProfileCard() {
 
  const [populateInfo, setpopulateInfo] = useState<any>()
   
  useEffect(() => {
    const getId = async () => {
      const userid = await getToken();
     
      await EditPageInfo(userid, setpopulateInfo); // Correctly pass the setter function
    };
 
    getId();
  }, []);
  console.log("main rpofi", populateInfo)
  return (
<>
    {populateInfo&&< div className = "max-w-2xl mx-auto p-4" >
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between gap-8">
          <div className="relative">
            <div className="relative h-44 w-44  overflow-hidden rounded-full">
              <Image
                src={populateInfo?.profilePic || ""}
                alt="Profile picture"
                fill
                className="object-cover"
                priority
              />
            </div>
            
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex gap-4 items-center justify-between">
                <h2 className="text-xl font-semibold">{ populateInfo?.username}</h2>
              <div className="flex items-center gap-2">
                <Button variant="secondary">Edit Profile</Button>
                <Button variant="secondary">View archive</Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <span className="font-semibold">9</span>
                <span className="text-muted-foreground ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">61</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">61</span>
                <span className="text-muted-foreground ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
                <h3 className="font-semibold">{ populateInfo.name}</h3>
              <p className="flex items-center gap-1">
                  { populateInfo?.bio}
              </p>
              <Link
                href="https://github.com/OneNotSeven"
                className="text-blue-600 hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                  { populateInfo?.website}
                  {populateInfo.website ? <span className="text-green-500">✓</span> : null}
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div > }
      </>
  )
}


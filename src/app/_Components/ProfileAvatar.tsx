"use client"
import { updateProfile } from "@/controllers/controller";
import { handleUpload } from "@/helpers/firebaseUpload";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";

const ProfileAvatar = ({ profileInfo, userId }: any) => {
    console.log("avatar",profileInfo)
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const [userid, setuserid] = useState(userId)
    const [loading, setloading] = useState<boolean>(false)
    const [imageSrc, setImageSrc] = useState<string>("")
    
    useEffect(() => {
     setImageSrc(profileInfo||"")
    }, [profileInfo])
    

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      try {
          if (event.target.files?.length) {
            setloading(true)
            const file = event.target.files[0];
            const imageRes = await handleUpload(file);
              if (imageRes) {
                  
                  const changeProcess = await updateProfile(userId, { profilePic: imageRes.message })
                  setImageSrc(imageRes.message)
                  console.log("pic",changeProcess)
            }
          }
        
    } catch (error) {
        
      } finally {
          setloading(false)
    }
  };
console.log("avatar state",imageSrc)
  const changeSaved = () => {
    setImageSrc(""); // Clears the profile picture
  };
  return (
      <>
          { <div className="flex relative flex-row  space-y-5 sm:flex-row sm:space-y-0 ">
              <div className='object-cover relative w-40 h-40 rounded-full overflow-hidden border-2 border-indigo-300 ring-offset-2 dark:ring-indigo-500'>
                                          
                  <img className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                      src={imageSrc || "/profile.jpg"} />
                  {loading == true ? <div role="status" className="w-full h-full flex justify-center items-center bg-slate-500 opacity-80 absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                      <span className="sr-only">Loading...</span>
                  </div> : null}
              </div>

              <div className="flex flex-col justify-center space-y-5 sm:ml-8">
                  <button type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 ">
                      Change picture
                  </button>
                  <input type='file' className='inputimage hidden'
                      ref={fileInputRef}
          
                      accept="image/*"
                      onChange={uploadImage} />
                  {/* <button type="button" onClick={changeSaved}
                      className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 ">
                      Delete picture
                  </button> */}
                     
                                     
              </div>
          </div>}
      </>
  )
}

export default ProfileAvatar
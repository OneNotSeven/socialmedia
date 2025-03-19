"use client"
import EditInput from '@/app/_Components/EditInput'
import ProfileAvatar from '@/app/_Components/ProfileAvatar'
// import Project from '@/app/_Components/Project'
import Skill from '@/app/_Components/Skill'
import SocialLinks from '@/app/_Components/SocialLinks'
import {  getToken } from '@/controllers/controller'
import { EditPageInfo } from '@/helpers/Profile'
import { Link, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'


const Page = () => {
 
  const [userId, setuserId] = useState<string>("")
  const [populateInfo, setpopulateInfo] = useState<any>()
  const [profile, setprofile] = useState<boolean>(true)
  const [skills, setskills] = useState<boolean>(false)
  // const [project, setproject] = useState<boolean>(false)
  const [social, setsocial] = useState<boolean>(false)
  
  useEffect(() => {
    const getId = async () => {
      const userid = await getToken();
      setuserId(userid); // Set the userId to state
      await EditPageInfo(userid, setpopulateInfo); // Correctly pass the setter function
    };

    getId();
  }, []);
  
       
 
  
  console.log("get the detail",populateInfo)
  return (
    <>
      {populateInfo && <div className='flex flex-col w-full'>
     

        <div className="bg-white w-full flex flex-col gap-5 pb-5  px-1 sm:px-6 lg:px-6 md:flex-row text-[#161931]">
          <main className="w-full min-h-screen py-1">
            <div className="p-2 md:p-4">
              <div className="w-full sm:px-6 pb-8 mt-8 sm:rounded-lg">
                <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
                <div className='flex flex-col sm:flex-row gap-6'>
                  <div className="gap-6 sm:w-[60%] mt-8">
                    <ProfileAvatar profileInfo={populateInfo?.profilePic} userId={userId} />
                    <div className='flex sm:flex-col sm:mt-10 mt-3 gap-5 items-center flex-row '>
                      
                    <div onClick={() => {
                      setprofile(true)
                      setskills(false)
                      // setproject(false)
                      setsocial(false)
                    }} className="py-2 sm:px-5 items-center sm:w-[250px] flex gap-1 text-base  text-gray-600 ">
                      <User size={18} />
                      <span>Personal Info</span>
                    </div>

                    <div onClick={() => {
                      setprofile(false)
                      setskills(true)
                      // setproject(false)
                      setsocial(false)
                    }} className="py-2 sm:px-5 items-center sm:w-[250px] flex gap-1 mt-1 text-base text-gray-600 ">
                      <Settings size={18} />
                      <span>Skills</span>
                    </div>
                  
                    {/* <div onClick={() => {
                      setprofile(false)
                      setskills(false)
                      setproject(true)
                      setsocial(false)
                    }} className="py-2 px-5 items-center w-[250px] flex gap-3 mt-1 text-base  text-gray-600 ">
                      <Folder size={18} />
                      <span>Project</span>
                    </div> */}
                  
                    <div onClick={() => {
                      setprofile(false)
                      setskills(false)
                      // setproject(false)
                      setsocial(true)
                    }} className="py-2 sm:px-5 items-center sm:w-[250px] flex gap-1 mt-1 text-base  text-gray-600 ">
                      <Link size={18} />
                      <span>Social links</span>
                    </div>
</div>
                  </div>
                  {profile && <EditInput profileInfo={populateInfo} userId={userId} />}
                  {skills && <Skill profileInfo={populateInfo} userId={userId}   />}
                  {/* {project && <Project profileInfo={populateInfo} userId={userId} />} */}
                  {social && <SocialLinks profileInfo={populateInfo} userId={userId}  />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>}
      </>
  )
}

export default Page;

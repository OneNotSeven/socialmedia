"use client"
import { Input } from '@/components/ui/input'
import { updateProfile } from '@/controllers/controller'
import { Profile } from '@/helpers/types'
import { validateProfile } from '@/schema/yupschema'
import { useFormik } from 'formik'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'



const EditInput = ({ profileInfo,userId }:any
) => {
  const [populateDetails, setpopulateDetails] = useState<Profile>(profileInfo)
  const [userExist, setuserExist] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)
   
    
    useEffect(() => {
        if (profileInfo) {
          setpopulateDetails(profileInfo);
        }
      }, [profileInfo]);
    
    const initialValues = {
        name: "",
      
        profession: "",
        website: "",
        username:"",
        bio: "",
       
      };
    
      const { errors, touched, handleBlur, handleChange, values } = useFormik({
        initialValues,
        validationSchema: validateProfile,
        onSubmit: () => {},
      });
   
    
  const changesSaved = async () => {
    try {
      delete errors.username
      delete errors.name
      
      if (Object.keys(errors).length === 0 && populateDetails.username !== "" && populateDetails.username !== "") {
        setloading(true)
        const realValues= Object.fromEntries(
          Object.entries(values).filter(([_, value]) => value.trim() !== "")
        )
        const changeProcess = await updateProfile(userId, realValues)
        if (changeProcess.success == false && changeProcess.error == "user") {
          setuserExist(changeProcess.message)
          
         
        }
        
      }
    } catch (error) {
      console.log("something went wrong")
      
    } finally {
      setloading(false)
    }
  
    if (populateDetails.username != "") {
      
    } 
  }
  
   
  return (
      <>
      {populateDetails && <div className=" sm:w-[90%] w-full text-[#202142]">

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Personal Info</h2>
        <div
          className="flex flex-col w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
          <div className="w-full">
            <label htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your name</label>
            <Input max={10} type="text" name='name' id="first_name" value={populateDetails?.name}
              className=" w-full p-2.5 "
              placeholder="Your first name"
              onChange={(e) => {
                handleChange
                            
                setpopulateDetails({ ...populateDetails, name: e.target.value });
                values.name = e.target.value
                              
              }}
              onBlur={handleBlur} />
            {errors.name && populateDetails?.name === "" && touched.name ? <p className="text-red-400 text-sm">{errors.name}</p> : null}
            
          </div>

    
        </div>
        <div className="mb-2 sm:mb-6">
          <label htmlFor="username"
            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
            username</label>
          <Input type="text" id="username" name='username' value={populateDetails?.username}
            className="w-full p-2.5 "
            placeholder="@username" onChange={(e) => {
              handleChange
            
              setpopulateDetails({ ...populateDetails, username: e.target.value });
              values.username = e.target.value
              
            }}
            onBlur={handleBlur} />
          {errors.username && populateDetails?.username === "" && touched.username ? <p className="text-red-400 text-sm">{errors.username}</p> : null}
          {userExist ? <p className="text-red-400 text-sm">{userExist}</p> : null}
        </div>
        <div className="mb-2 sm:mb-6">
          <label htmlFor="email"
            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your
            email</label>
          <Input type="email" id="email" readOnly name='email' value={populateDetails?.email}
            className=" w-full p-2.5 "
            placeholder="your.email@mail.com" />

        </div>

        <div className="mb-2 sm:mb-6">
          <label htmlFor="profession"
            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Profession</label>
          <Input type="text" id="profession" name='profession' value={populateDetails?.profession}
            className=" w-full p-2.5 "
            placeholder="your profession" onChange={(e) => {
              handleChange
            
              setpopulateDetails({ ...populateDetails, profession: e.target.value });
              values.profession = e.target.value
              
            }}
            onBlur={handleBlur} />
          {errors.profession && touched.profession ? <p className="text-red-400 text-sm">{errors.profession}</p> : null}
        </div>
        <div className="mb-2 sm:mb-6">
          <label htmlFor="profession"
            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">website link</label>
          <Input type="text" id="profession" name='website' value={populateDetails?.website}
            className=" w-full p-2.5 "
            placeholder="your profession" onChange={(e) => {
              handleChange
            
              setpopulateDetails({ ...populateDetails, website: e.target.value });
              values.website = e.target.value
              
            }}
            onBlur={handleBlur} />
          {errors.website && touched.website ? <p className="text-red-400 text-sm">{errors.website}</p> : null}
                  
        </div>

        <div className="mb-6">
          <label htmlFor="message"
            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Bio</label>
          <textarea id="message" name='bio' value={populateDetails?.bio}
            className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 "
            placeholder="Write your bio here..." onChange={(e) => {
              handleChange
            
              setpopulateDetails({ ...populateDetails, bio: e.target.value });
              values.bio = e.target.value
              
            }}
            onBlur={handleBlur}
          ></textarea>
          {errors.bio && touched.bio ? <p className="text-red-400 text-sm">{errors.bio}</p> : null}
        </div>

        <div className="flex justify-center items-center">
          <button onClick={changesSaved}
            className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
            {loading == true ?
              <Loader className='w-5 h-5 animate-spin'/>
              : <span>save</span>}
          </button>
        </div>

      </div>}
      </>
  )
}

export default EditInput

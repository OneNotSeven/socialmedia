"use client"
import React, { useEffect, useState } from 'react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RemoveAnotherProfile, updateAnotherProfile } from '@/controllers/controller'
import { MoreHorizontal } from 'lucide-react'


const Skill = ({ profileInfo, userId }:any) => {
    const [skills, setSkills] = useState<any>([])
 const [newSkill, setnewSkill] = useState("")
  const [loading, setloading] = useState<boolean>(false)
  
 
  
 useEffect(() => {
   
 
 setSkills(profileInfo.skills)
   
 }, [])
 
  
  const changesSaved = async() => {
    try {
          
      if (newSkill!="") {
        setloading(true)
        
        const changeProcess = await updateAnotherProfile(userId, {skill: newSkill } ,"skills")
        if (changeProcess.success == true) {
          setSkills(changeProcess.data[0].skills)
        }
      
        
      }
    } catch (error) {
      console.log("something went wrong")
      
    } finally {
      setloading(false)
    }
  
   
  }

  const removeSaved = async (removeID:string) => {
    try {
      setloading(true)
      setSkills((prevSkills: any[]) => prevSkills.filter((skill) => skill._id !== removeID));
      const removeProcess=await RemoveAnotherProfile(userId,removeID,"skills")
    } catch (error) {
      
    } finally {
      setloading(false)
    }
    
  }
  console.log("main skill", skills)
  console.log("info skills",profileInfo)
 
  return (
      <>
       <section id="skills" className="mb-8 w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Skills</h2>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input value={newSkill} onChange={(e) => setnewSkill(e.target.value)} placeholder="Add a skill" />
            {loading ? <Button><MoreHorizontal /></Button> : <Button onClick={changesSaved}>Add</Button>}
        </div>
          {skills.length > 0 && <div className="flex flex-wrap gap-2">
            {skills.map((skill: any) => (
              <Badge key={skill._id} variant="secondary" className="text-sm">
                {skill.skill}
                <button
                  onClick={() => removeSaved(skill._id)}
                  className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>}
      </div>
    </section>
      </>
  )
}

export default Skill
"use client";

import React, { useEffect, useState } from "react";
import { colorSchema } from "../_Styles/style";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

  
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { createCommunity, getToken } from "@/controllers/controller";
import CommunityList from "./CommunityList";
import { ArrowRight, Loader2 } from "lucide-react";

const BuildCommunity = () => {
  const [value, setValue] = useState<string>("");
  const [bio, setbio] = useState<string>("")
  const [userId, setuserId] = useState<string>("")
  const [isChecked, setisChecked] = useState<boolean>(false)
  const [loader, setloader] = useState<boolean>(false)

  useEffect(() => {

    const getId = async () => {
      const userId = await getToken()
      setuserId(userId)
      

    }
    getId()
   
        
  }, [])
 
  const communitySaved = async () => {
try {
  setloader(true)
  const saving = await createCommunity(userId, { branchName: value, bio: bio, allowMessage: isChecked })

} catch (error) {
  console.log("something went wrong",error)
} finally {
  setloader(false)
}
    
}
  const handlechange = (value:boolean) => {
    setisChecked(value)
  }

     
  return (
      <>
      <div className="flex  sm:items-center justify-around w-full sm:w-[70%] mt-8">
               <div className="sm:flex justify-between hidden w-full h-fit  items-center gap-2">
                      
                      <h1 className={`${colorSchema.color} text-xl sm:block hidden font-semibold`}>
                        Community
                      </h1>
                        </div>          
            <Dialog>
              {/* Trigger to open the dialog */}
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-500 text-white text-sm hover:bg-blue-400"><svg className="w-4 h-4" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>create community</Button>
              </DialogTrigger>
      
              {/* Dialog Content */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Build community</DialogTitle>
                  <DialogDescription>
                   build your own community and make circle around the globe.
                  </DialogDescription>
                                </DialogHeader>
            <div>
            <span className= {`text-sm font-semibold ${colorSchema.color}`}>Name</span>
                <Input
                  placeholder="enter your branch name"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
            />
            </div>           
            <div>
              <span className= {`text-sm pb-1 font-semibold ${colorSchema.color}`}>Bio</span>
            <Input
                  placeholder="enter your bio"
                  value={bio}
                  onChange={(e) =>setbio(e.target.value) }
                                />
            </div>
                                <div className="flex justify-between items-center  ">
                                    
                               <span className={`text-sm font-semibold ${colorSchema.color}`} >Allow message for everyone</span> <Switch onCheckedChange={handlechange}/>
                                </div>
                                <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>why it is?</AccordionTrigger>
          <AccordionContent>
            This is for connect developer around the globe and learn tech together.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
                <DialogFooter>
              <Button onClick={communitySaved}>{loader ?<Loader2 className="text-white" />: "Save"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      <div className="sm:w-full w-[50%] flex justify-end items-center">
       <a href="/view-community" className="cursor-pointer hover:underline text-blue-500 capitalize"><p className="flex gap-1 text-sm">view all community <ArrowRight/></p></a> 
      </div>
      </div>
      <div>

        <CommunityList userId={ userId} />
      </div>
      </>
  )
}

export default BuildCommunity

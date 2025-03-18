import { getProfileInfo } from "@/controllers/controller"
import { Profile } from "./types"



export async function EditPageInfo(userid:string,setpopulateInfo: React.Dispatch<React.SetStateAction<Profile>>):Promise<void>{
      
              const profileData=await getProfileInfo(userid)
                 const objPopulate={...profileData.message[0]}
                 setpopulateInfo(objPopulate)
           }
             
 
               
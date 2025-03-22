import { Community, Update } from "@/helpers/types"
import { appBaseUrl } from "@/schema/appurl"

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getToken():Promise<any> {
    try {
            const jwtverify = async () => {
                const verifydone= await fetch(`${appBaseUrl}/api/tokengetter`, {
                 method: "Post"
                })
                 const responseVerify = await verifydone.json()
                 return responseVerify
              }
          const myiduser = jwtverify().then((response) => {
         
           
                return response.verifytoken.userid;
          })
        return myiduser
              
              
            } catch (error) {
              console.warn("something went wrong...edit",error)
            }
    
}

export const getProfileInfo = async (profileId: any): Promise<any> => {
  console.log("jan pehchan",profileId)
  const Populateres = await fetch(`${appBaseUrl}/api/editprofile`, {
    method: "Post",
    body: JSON.stringify({ profileId })
  });
  
  const populateResDone = await Populateres.json()
  return populateResDone
}

export const postDelete = async (postId:string,userId:string):Promise<any> => {
  const deleteres = await fetch(`${appBaseUrl}/api/uploadcontent`, {
    method: "DELETE",
    body: JSON.stringify({ postId,userId })
  });
  const deleteResDone = await deleteres.json()
  return deleteResDone
}

export const updateProfile = async (userId:string,updateDetails:Update):Promise<any> => {
  const updateProfile = await fetch(`${appBaseUrl}/api/updateprofile`, {
    method: "Post",
    body:JSON.stringify({userId,updateDetails})
  })
  const updateProfileDone = await updateProfile.json()
  return updateProfileDone
}

export const updateAnotherProfile = async (userId:string,updateDetails:Update,updatepoint:string):Promise<any> => {
  const updateProfile = await fetch(`${appBaseUrl}/api/updateanotherpro`, {
    method: "Post",
    body:JSON.stringify({userId,updateDetails,updatepoint})
  })
  const updateProfileDone = await updateProfile.json()
  return updateProfileDone
}

export const RemoveAnotherProfile = async (userId:string,removeId:string,updatepoint:string):Promise<any> => {
  const updateProfile = await fetch(`${appBaseUrl}/api/updateanotherpro`, {
    method: "DELETE",
    body:JSON.stringify({userId,removeId,updatepoint})
  })
  const updateProfileDone = await updateProfile.json()
  return updateProfileDone
}

export const createCommunity = async (userId: string, createDetails: Community): Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/createcommunity`, {
    method: "Post",
    body: JSON.stringify({ userId, createDetails })
  })
  const creationDone = await community.json()
  return creationDone
}

export const deleteCommunity = async (communityId:string): Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/createcommunity`, {
    method: "DELETE",
    body: JSON.stringify({ communityId })
  })
  const creationDone = await community.json()
  return creationDone
}

export const sendRequest = async (userId: string,adminId:string): Promise<any>=>{
  const send = await fetch(`${appBaseUrl}/api/sendrequest`, {
    method: "Post",
    body: JSON.stringify({userId,adminId})
  })
  const getRes = await send.json()
  return getRes
}

export const AcceptRequest = async (userId: string,adminId:string): Promise<any>=>{
  const accepting = await fetch(`${appBaseUrl}/api/acceptrequest`, {
    method: "Post",
    body: JSON.stringify({userId,adminId})
  })
  const acceptDone = await accepting.json()
  return acceptDone
}

export const DenyRequest = async (userId: string,adminId:string): Promise<any>=>{
  const denying = await fetch(`${appBaseUrl}/api/denyrequest`, {
    method: "Post",
    body: JSON.stringify({userId,adminId})
  })
  const deny = await denying.json()
  return deny
}

export const gettingCommmunity = async (userId: string): Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/getcommunity`, {
    method: "Post",
    body:JSON.stringify({userId})
  })
  const sendCommunity = await community.json()
  return sendCommunity
}

export const gettingAllCommmunity = async (userId: string): Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/allcommunity`, {
    method: "Post",
    body:JSON.stringify({userId})
  })
  const sendCommunity = await community.json()
  return sendCommunity
}

export const getUserProfile = async (username:string):Promise<any> => {
  const user = await fetch(`${appBaseUrl}/api/getprofile`, {
    method: "Post",
    body:JSON.stringify(username)
  })
  const returnUser=await user.json()
return returnUser
}

export const followUser = async(userId: string, authuser: string): Promise<any> => {
  const follow = await fetch(`${appBaseUrl}/api/follow`, {
    method: "Post",
    body: JSON.stringify({ userId, authuser})
  })
  const followRes = await follow.json()
  return followRes
}

export const unFollowUser = async(userId: string, authuser: string): Promise<any> => {
  const unfollow = await fetch(`${appBaseUrl}/api/unfollow`, {
    method: "Post",
    body: JSON.stringify({ userId, authuser})
  })
  const followRes = await unfollow.json()
  return followRes
}

export const gettingContent = async(userId:string): Promise<any> => {
  const content = await fetch(`${appBaseUrl}/api/getcontent`, {
    method: "POST",
    body: JSON.stringify({ userId })
   
  })
  const contentRes = await content.json()
  return contentRes
}

export const gettingUserContent = async(username:string): Promise<any> => {
  const content = await fetch(`${appBaseUrl}/api/getusercontent`, {
    method: "POST",
    body:JSON.stringify(username)
   
  })
  const contentRes = await content.json()
  return contentRes
}


export const sendingComment = async (userId:string, contentId:string, comment:string): Promise<any> => {
  const comments = await fetch(`${appBaseUrl}/api/sendcomment`, {
    method: "Post",
    body: JSON.stringify({ userId,contentId,comment})
  })
  const commentRes = await comments.json()
  return commentRes
  
  
}


export const deleteComment = async (userId:string, contentId:string,commentId:string): Promise<any> => {
  const comments = await fetch(`${appBaseUrl}/api/deletecomment`, {
    method: "Post",
    body: JSON.stringify({ userId,contentId,commentId})
  })
  const commentRes = await comments.json()
  return commentRes
  
  
}

export const gettingComment = async (contentId:string): Promise<any> => {
  const comments = await fetch(`${appBaseUrl}/api/getcomment`, {
    method: "Post",
    body: JSON.stringify({contentId})
  })
  const commentRes = await comments.json()
  return commentRes
  
  
}

export const gettingNotification = async (userId: string): Promise<any> => {
  const Notify = await fetch(`${appBaseUrl}/api/allnotification`, {
    method: "Post",
    body:JSON.stringify({userId})
  })
  const NotifyRes = await Notify.json()
  return NotifyRes
}

export const singlecommunity = async (communityId: string): Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/singlecommunity`, {
    method: "Post",
    body:JSON.stringify({communityId})
  })
  const communityRes = await community.json()
  return communityRes
}

export const leaveCommunity = async (communityId: string, userId: string):Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/leavecommunity`, {
    method: "Post",
    body: JSON.stringify({communityId, userId})
  })
  const communityRes = await community.json()
  return communityRes
}

export const joinedcommunitylist = async (userId: string): Promise<any> => {
  const community = await fetch(`${appBaseUrl}/api/usersjoincommunitylist`, {
    method: "Post",
    body:JSON.stringify({userId})
  })
  const communityRes = await community.json()
  return communityRes
}

export const sendingLikes = async (userId:string, contentId:any): Promise<any> => {
  const Likes = await fetch(`${appBaseUrl}/api/like`, {
    method: "Post",
    body: JSON.stringify({ userId,contentId})
  })
  const likeRes = await Likes.json()
  return likeRes
  
  
}

export const UnLikes = async (userId:string, contentId:any): Promise<any> => {
  const Likes = await fetch(`${appBaseUrl}/api/like`, {
    method: "DELETE",
    body: JSON.stringify({ userId,contentId})
  })
  const likeRes = await Likes.json()
  return likeRes
  
  
}

export const getcontent = async (contentid: string) => {
  const getcontent = await fetch(`${appBaseUrl}/api/postid`, {
    method: "Post",
    body: JSON.stringify({contentid})
  })
  const getContentRes = await getcontent.json()
  return getContentRes
  
}

export const BasicInfo = async (userId: string): Promise<any> => {
  const getcontent = await fetch(`${appBaseUrl}/api/users`, {
    method: "Post",
    body: JSON.stringify(userId)
  })
  const getContentRes = await getcontent.json()
  return getContentRes
  
}

// Search for accounts based on query
export const searchAccounts = async (query: string) => {
  try {
    const users = await fetch(`${appBaseUrl}/api/accountsearch`, {
      method: "Post",
      body:JSON.stringify({query})
    })
    const usersRes = await users.json()
    console.log("searcg indec]x",usersRes)
    return usersRes;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return { data: [], success: false };
  }
};

export const suggestedAccounts = async (userId: string) => {
  
    const users = await fetch(`${appBaseUrl}/api/suggested`, {
      method: "Post",
      body:JSON.stringify({userId})
    })
    const usersRes = await users.json()
    console.log("suggested user",usersRes)
    return usersRes;
  
};



// Search for communities based on query
export const searchCommunities = async (query: string) => {
  try {
    const users = await fetch(`${appBaseUrl}/api/accountsearch`, {
      method: "Post",
      body:JSON.stringify({query})
    })
const usersRes=await users.json()
    return { data: usersRes, success: true };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return { data: [], success: false };
  }
};

export const LogOut = async() => {
  const users = await fetch(`${appBaseUrl}/api/logout`, {
    method: "Post",
  })
  const usersres = await users.json()
  return usersres
}

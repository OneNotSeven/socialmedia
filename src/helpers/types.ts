export interface Profile{
    name: string;
    username?: string;
    email: string;
    image?: string;
    bio?: string;
    website?: string;
    profession?: string;
}
  
export interface Update{
  profilePic?: string;
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  website?: string;
  profession?: string;
  projectname?: string;
  projectlink?: string;
  projectdesc?: string;
  skill?: string;
  platform?: string;
  link?:string
}

export interface Community{
  
  branchName: string;
  bio: string;
  allowMessage:boolean

}

export interface RequestDeatail{
  userId: string;
  communityId: any;
  request: any;
  branchname: string;
  setcheck: React.Dispatch<React.SetStateAction<boolean>>;
}
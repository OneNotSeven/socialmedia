import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users, Hash, Verified } from "lucide-react";
import { debounce } from "lodash";
import Link from "next/link";
import { searchAccounts } from "@/controllers/controller";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const SearchComponents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      const accounts:any = await searchAccounts(query);
  console.log("main accounts value",accounts)
      if (!accounts || typeof accounts !== "object") {
        console.error("Invalid search response:", accounts);
        return [];
      }
  
      const users = Array.isArray(accounts.users) ? accounts.users.map((user: any) => ({
        name: user.name,
        username:user.username,
        description: user.bio || "No bio available",
        profilePic: user.profilePic,
        isVerified:user.isVerified,
        url: `/profiles/${user.username}`,
        type: "user",
      })) : [];
  
      const communities = Array.isArray(accounts.communities) ? accounts.communities.map((comm: any) => ({
        name: comm.branchName,
        description: comm.bio || "No description available",
        url: `/view-community/${comm._id}`,
        isVerified:comm.isVerified,
        type: "community",
      })) : [];

  const arrayResult=[...users,...communities]
      return arrayResult;
  
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };
  

  // Debounced API call
  const fetchResults = useCallback(
  debounce(async (query: string) => {
    if (query.trim().length > 0) {
      try {
        const response = await handleSearch(query); // Await the response
        console.log("Response from handleSearch:", response); // Debugging

        if (Array.isArray(response)) {
          setResults(response);
          setShowDropdown(response.length > 0);
          return response; // Return the result explicitly
        } else {
          console.error("Invalid response received:", response);
          setResults([]);
          setShowDropdown(false);
          return [];
        }
      } catch (error) {
        console.error("Error in fetchResults:", error);
        setResults([]);
        setShowDropdown(false);
        return [];
      }
    } else {
      setResults([]);
      setShowDropdown(false);
      return [];
    }
  }, 400),
  []
);


  useEffect(() => {
    fetchResults(searchTerm);
    setShowDropdown(searchTerm.trim().length > 0);
  }, [searchTerm, fetchResults]);

  // Handle keyboard navigation
 
console.log("check my result",results)
  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10 h-12 rounded-full bg-muted"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
 // Improved blur handling
        />
      </div>

      {showDropdown && results?.length > 0 && (
       <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 max-h-72 overflow-auto z-50">

          {results.map((item, index) => (
            <a key={index} href={item.url} >
              <div
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 `}
               
              >
                {item.type === "user" ?   <Avatar>
        
            <AvatarImage src={item.profilePic || "/profile.jpg"} alt="User Avatar" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar> : <Users className="w-6 h-6" />}
                <div>
                  <div className="flex gap-1 items-center">

                    <p className="text-sm font-medium">{item.name}</p>
                    {item.isVerified && <Verified className="fill-blue-500 text-white" />}
                  </div>
                  <p className="text-xs text-gray-500">{item.username || ""}</p>
                </div>
                {item.type == "community" && <Badge className=" text-[8px] bg-green-300 text-green-500 "># Community</Badge>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponents;

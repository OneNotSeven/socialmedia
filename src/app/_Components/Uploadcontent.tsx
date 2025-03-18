"use client";

import React, { useRef, useState } from "react";
import { AlertCircle, Check, Paperclip, Send, SmilePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import Picker to prevent SSR issues
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });
import emojiData from "@emoji-mart/data";
import { handleUpload } from "@/helpers/firebaseUpload";
import { appBaseUrl } from "@/schema/appurl";

interface LoaderProps {
  loading: boolean;
  uploadstate: boolean;
  error:boolean
}

const Uploadcontent = ({ user }: any) => {
  const [error, seterror] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [downloadUrl, setdownloadUrl] = useState<string>()
  const [text, setText] = useState("");
  const [loading, setloading] = useState<boolean>(false)
  const [initial, setinitial] = useState(false)
  const [uploadState, setuploadState] = useState<boolean>(false)
  
 
  const [showPicker, setShowPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
const [hashtags, sethashtags] = useState<string[]>([])

  const addEmoji = (emoji: any) => {
    setText((prev) => prev + emoji.native);
    setShowPicker(false); // Hide picker after selection
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/mov"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only images and videos (PNG, JPG, JPEG, MP4, MOV) are allowed!");
        return;
      }
      setSelectedFile(file);

      // Generate preview URL
      const fileURL = URL.createObjectURL(file);
      setPreviewURL(fileURL);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const textChange = (text:string) => {
    setText(text);
    const extractedHashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];

    sethashtags(extractedHashtags);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const firebaseUpload = async () => {
    if (!selectedFile) return alert("Please select a file first!");
      const data = await handleUpload(selectedFile);
    setdownloadUrl(data.message)
    return data.message
    console.log("Firebase Upload Data:", data);
    };
    
  const dataUploading = async () => {
    try {
      if ( !text) {
        throw new Error("write something")

    }
      setinitial(true)
      setloading(true)
      setuploadState(false)
      let downloadurl: any = ""
      let type = {}
      
      if (selectedFile && text) {
      
        downloadurl=await firebaseUpload()
       
        if (selectedFile?.type.startsWith("image")) {
            type={image:downloadurl}
        } else {
            type={video:downloadurl}
      }
      }
        
       
      
    
          const uploadData = await fetch(`${appBaseUrl}/api/uploadcontent`, {
              method: 'POST',
              body: JSON.stringify({ adminId: user,text:text,...type,hashtags})
          })
      const finalres = await uploadData.json()
      if (finalres.success == true) {
        setuploadState(true)
       
        setText("")
       clearFile()
        setdownloadUrl("")
        
      }
    
    } catch (error) {
      seterror(true)
      console.log("Error Uploading Data:", error);
    
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 pb-9 mt-6 relative">
          {/* Text Input Area */}
          <h1 className="font-semibold text-3xl">What&apos;s on your mind?</h1>
      <div className="w-[95%] h-[88px] flex gap-2 bg-gray-100 rounded-sm px-4 mx-4 py-2">
        <textarea
          value={text}
          onChange={(e) => textChange(e.target.value) }
          placeholder="Post a thought..."
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
        />
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, video/mp4, video/mov"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview Section */}
      {previewURL && (
        <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300">
          {selectedFile?.type.startsWith("image") ? (
            <img src={previewURL} alt="Selected" className="w-full h-full object-cover" />
          ) : (
            <video src={previewURL} className="w-full h-full object-cover" />
          )}
          <button
            onClick={clearFile}
            className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 items-center">
        <Button onClick={handleIconClick} variant="ghost" size="icon" className="text-gray-500">
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Emoji Picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => setShowPicker(!showPicker)}
          >
            <SmilePlus className="w-5 h-5" />
          </Button>

          {showPicker && (
            <div className="absolute bottom-12 left-0 z-10 bg-white shadow-md rounded-lg">
              <Picker data={emojiData} onEmojiSelect={addEmoji} />
            </div>
          )}
        </div>

        <Button disabled={loading} onClick={dataUploading} className="bg-indigo-600 text-white rounded-xl">Post
          <Send className="w-4 h-4" />
        </Button>
        {initial && <div className="sm:w-[400px] w-full flex gap-3 rounded-md ring-1 ring-purple-400 py-3 items-center p-3 bg-gray-200 h-8">
          <LoaderComponent loading={loading} uploadstate={uploadState } error={error} />
      
        </div>}
      </div>
    </div>
  );
};

const LoaderComponent = ({loading,uploadstate,error}:LoaderProps) => {
  return (
    <>
    <div className="flex items-center justify-center h-screen">
      <motion.div
        className="w-5 h-5 flex items-center justify-center rounded-lg "
       
        
      >
        {loading===true&&uploadstate === false&& error==false ? (<Loader2 className="w-10 h-10 text-blue-500 animate-spin " />) : null }
        {uploadstate === true ? (<Check className="w-10 h-10 text-green-600 " />) : null}
    {uploadstate===false && error===true ?(  <AlertCircle className="w-10 h-10 text-red-800 transition-none " />) :null}
      </motion.div>
    </div>
     <motion.div
     className="h-1 bg-blue-500 rounded-full"
     initial={{ width: "0%" }}
     animate={{ width: "90%" }}
     transition={{ duration: 2, ease: "easeInOut" }}
      ></motion.div>
      </>
  );
};



export default Uploadcontent;



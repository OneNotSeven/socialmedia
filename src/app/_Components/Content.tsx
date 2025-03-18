import { MoreHorizontal, Paperclip, Send, Share2, SmilePlus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import CommentModal from "./CommentModal"

const Content = () =>{
  
  return (
    <main className="flex-1 w-full mx-auto p-6">
     

      <div className="space-y-6">
        <div style={{boxShadow:"0px 1px 6px -1px #d8d6d6"}} className="bg-white rounded-xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <Image src="/placeholder.svg" alt="Profile picture" width={40} height={40} className="rounded-full" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">X_AE_A-13</h3>
                  <p className="text-sm text-gray-500">Product Designer, slothUI</p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
              <p className="mt-2 text-gray-600">
                Habitant morbi tristique senectus et netus et. Suspendisse sed nisi lacus sed viverra. Dolor morbi non
                arcu risus quis varius.{" "}
                <span className="text-indigo-600">#amazing #great #lifetime #iux #machinelearning</span>
              </p>
              <div className="mt-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ui%20web-yaZaYVpskY6hKV1H31WubJYkCDUkeQ.png"
                  alt="Post image"
                  width={600}
                  height={400}
                  className="rounded-xl w-full"
                />
              </div>
              <div className="flex items-center gap-6 mt-4">
                <button className="flex items-center gap-1 text-gray-500">
                <Star className="w-5 h-5"/>
                  <span>12</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path></svg>
                  <span>25</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500">
               <Share2 className="w-5 h-5"/>
                  <span>187</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 ml-auto">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path></svg>
                  <span>8</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Image src="/placeholder.svg" alt="Profile picture" width={32} height={32} className="rounded-full" />
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Write your comment..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm"
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <SmilePlus className="w-5 h-5" />
                </Button>
                <Button size="icon" className="bg-indigo-600 text-white rounded-full">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
export default Content


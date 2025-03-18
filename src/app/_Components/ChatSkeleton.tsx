import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const ChatSkeleton = () => {
    return (
    
        <div className="flex flex-col w-full h-screen bg-gray-50">
          {/* Header Skeleton */}
          <div className="p-4 border-b bg-white flex items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="ml-4 w-32 h-6" />
          </div>
          
          {/* Chat Area Skeleton */}
          <div className="flex-grow w-full overflow-y-auto p-4 space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className="rounded-lg p-3 max-w-xs bg-white shadow">
                  <Skeleton className="w-24 h-4 mb-2" />
                  <Skeleton className="w-40 h-6" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Skeleton */}
          <div className="p-4 border-t bg-white flex items-center space-x-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="flex-grow h-10 rounded-md" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      );
}

export default ChatSkeleton
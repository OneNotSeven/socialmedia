import { Skeleton } from "@/components/ui/skeleton";

const TweetsSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full sm:w-[650px] mx-auto p-4">
      {/* Profile Section */}
      <div className="flex items-start space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-16 h-3 mt-1 rounded" />
        </div>
      </div>

      {/* Text Content */}
      <Skeleton className="w-full h-4 mt-3 rounded" />
      <Skeleton className="w-3/4 h-4 mt-2 rounded" />
      
      {/* Media (Image/Video) */}
      <Skeleton className="w-full h-48 mt-3 rounded-lg" />
      
      {/* Action Buttons */}
      <div className="mt-3 flex items-center justify-between max-w-md">
        <Skeleton className="w-12 h-5 rounded" />
        <Skeleton className="w-12 h-5 rounded" />
        <Skeleton className="w-12 h-5 rounded" />
      </div>
    </div>
  );
};

export default TweetsSkeleton;

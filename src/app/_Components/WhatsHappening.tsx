import { TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"



interface TrendingTopic {
  category: string
  title: string
  posts?: number
  isLive?: boolean
}





const WhatsHappening = () => {
  
  const trendingTopics = [
    { id: 1, hashtag: "TechNews", posts: "125K", category: "Technology" },
    { id: 2, hashtag: "WorldCup", posts: "450K", category: "Sports" },
    { id: 3, hashtag: "ClimateAction", posts: "89K", category: "Environment" },
    // { id: 4, hashtag: "MondayMotivation", posts: "56K", category: "Lifestyle" },
    // { id: 5, hashtag: "CookingTips", posts: "32K", category: "Food" },
  ]
    return (
      <div className="space-y-6 sm:block hidden max-w-96 w-96">
      {/* Trending Topics */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center text-lg">
            
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Trending Topics
          </CardTitle>
          <CardDescription>See what people are talking about</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div className="space-y-4">
            {trendingTopics.map((topic) => (
              <div key={topic.id} className="flex items-start justify-between pb-3 border-b last:border-0">
                <div>
                  <div className="text-xs text-muted-foreground">{topic.category}</div>
                  <div className="font-semibold">#{topic.hashtag}</div>
                  <div className="text-xs text-muted-foreground">{topic.posts} posts</div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <span className="sr-only">More options</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
          </CardContent>
          
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full text-primary justify-center">
            Show more
          </Button>
        </CardFooter>
      </Card>

    
        
      
    </div>
      )
}

export default WhatsHappening


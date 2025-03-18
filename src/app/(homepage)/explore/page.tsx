"use client"

import { useState } from "react"
import {
  Search,
  TrendingUp,
  Video,
  Calendar,
  FlameIcon as Fire,
  MapPin,
  Users,
  Star,
  ChevronRight,
  Bell,
  Verified,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import SearchComponents from "@/app/_Components/SearchComponent"

export default function ExplorePage() {
  

  // Mock trending topics data
  const trendingTopics = [
    { id: 1, hashtag: "TechNews", posts: "125K", category: "Technology" },
    { id: 2, hashtag: "WorldCup", posts: "450K", category: "Sports" },
    { id: 3, hashtag: "ClimateAction", posts: "89K", category: "Environment" },
    { id: 4, hashtag: "MondayMotivation", posts: "56K", category: "Lifestyle" },
    { id: 5, hashtag: "CookingTips", posts: "32K", category: "Food" },
  ]

  // Mock suggested accounts
  const suggestedAccounts = [
    {
      id: 1,
      name: "Tech Insider",
      handle: "@techinsider",
      followers: "2.5M",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      category: "Technology",
    },
    {
      id: 2,
      name: "Global News",
      handle: "@globalnews",
      followers: "4.2M",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      category: "News",
    },
    {
      id: 3,
      name: "Sports Center",
      handle: "@sportscenter",
      followers: "8.7M",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      category: "Sports",
    },
    {
      id: 4,
      name: "Food Network",
      handle: "@foodnetwork",
      followers: "3.1M",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      category: "Food",
    },
  ]

  // Mock news highlights
  const newsHighlights = [
    {
      id: 1,
      title: "New AI breakthrough changes how we think about technology",
      source: "Tech Today",
      time: "2 hours ago",
      image: "https://i.pinimg.com/736x/95/fe/7a/95fe7a6efd8ed2054a5552dda2d78731.jpg",
      category: "Technology",
    },
    {
      id: 2,
      title: "Global climate summit reaches historic agreement",
      source: "World News",
      time: "5 hours ago",
      image: "https://i.pinimg.com/736x/e5/93/d6/e593d6a514a43cc255001dcd25cbecb2.jpg",
      category: "Environment",
    },
    {
      id: 3,
      title: "Championship finals set after dramatic semifinal matches",
      source: "Sports Network",
      time: "1 hour ago",
      image: "https://i.pinimg.com/736x/18/10/5b/18105b4185b5043e0be9d03bd334a117.jpg",
      category: "Sports",
    },
  ]

  // Mock trending videos
  const trendingVideos = [
    {
      id: 1,
      title: "Amazing drone footage captures rare natural phenomenon",
      views: "2.4M",
      duration: "3:42",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 2,
      title: "Chef reveals secret recipe that went viral overnight",
      views: "1.8M",
      duration: "5:16",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 3,
      title: "Behind the scenes of the most anticipated movie of the year",
      views: "3.2M",
      duration: "8:05",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  // Mock upcoming events
  const upcomingEvents = [
    { id: 1, name: "Tech Conference 2023", date: "Nov 15-18", location: "San Francisco, CA", interested: "45K" },
    { id: 2, name: "Music Festival", date: "Dec 3-5", location: "Austin, TX", interested: "78K" },
    { id: 3, name: "Global Summit", date: "Nov 28-30", location: "New York, NY", interested: "32K" },
  ]

  // Mock who to follow
  const whoToFollow = [
    {
      id: 1,
      name: "Jane Cooper",
      handle: "@janecooper",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Digital Artist & Content Creator",
    },
    {
      id: 2,
      name: "Alex Morgan",
      handle: "@alexmorgan",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Entrepreneur & Tech Investor",
    },
    {
      id: 3,
      name: "Devon Lane",
      handle: "@devonlane",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Travel Photographer & Blogger",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
         <SearchComponents/>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="mb-8 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <Image
          src="https://i.pinimg.com/736x/3a/8c/2c/3a8c2c718afa7d9359e997755ce0388a.jpg"
          alt="Featured banner"
          width={1200}
          height={300}
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
          <Badge className="w-fit mb-2 bg-primary/90 hover:bg-primary/80">Trending Now</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Discover whats happening in the world</h2>
          <p className="text-white/90 mb-4 max-w-md">Join the conversation and stay updated with the latest trends</p>
          <Button className="w-fit">Explore Now</Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="foryou" className="mb-8">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="foryou">For you</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
        </TabsList>

        <TabsContent value="foryou">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - News Highlights */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-bold flex items-center mb-4">
                <Fire className="mr-2 h-5 w-5 text-primary" />
                Top Stories For You
              </h3>

              {newsHighlights.map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
                    <Badge className="absolute top-3 left-3">{news.category}</Badge>
                  </div>
                  <CardContent className="pt-4">
                    <h4 className="text-lg font-semibold mb-2">{news.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{news.source}</span>
                      <span className="mx-2">•</span>
                      <span>{news.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Trending Videos Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold flex items-center mb-4">
                  <Video className="mr-2 h-5 w-5 text-primary" />
                  Trending Videos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingVideos.map((video) => (
                    <div key={video.id} className="group cursor-pointer">
                      <div className="relative rounded-lg overflow-hidden mb-2">
                        <Image
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          width={320}
                          height={180}
                          className="w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-1"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-medium line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-muted-foreground">{video.views} views</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Trending & Accounts */}
            <div className="space-y-6">
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

              {/* Who to Follow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Who to Follow
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="space-y-4">
                    {whoToFollow.map((person) => (
                      <div key={person.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={person.avatar} alt={person.name} />
                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold flex items-center">
                              {person.name}
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
                                className="ml-1 text-primary"
                              >
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                              </svg>
                            </div>
                            <div className="text-xs text-muted-foreground">{person.handle}</div>
                          </div>
                        </div>
                        <Button size="sm" className="rounded-full">
                          Follow
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

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="pb-3 border-b last:border-0">
                        <div className="font-semibold">{event.name}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date}
                          <span className="mx-1">•</span>
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{event.interested} interested</span>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Interested
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full text-primary justify-center">
                    View all events
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Trending Content */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-bold flex items-center mb-4">
                <Fire className="mr-2 h-5 w-5 text-primary" />
                What&apos;s Happening Now
              </h3>

              {/* Trending Banner */}
              <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white">Trending Worldwide</Badge>
                    <span className="ml-auto text-white/80 text-sm">2.5M posts</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">#WorldEnvironmentDay</h3>
                  <p className="text-white/90 mb-4">Join the global conversation about protecting our planet</p>
                  <Button variant="secondary">Join the conversation</Button>
                </CardContent>
              </Card>

              {/* Trending Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[{name:"Aman Jha",username:"@aman_jha",verified:true,url:"https://i.pinimg.com/474x/21/aa/b1/21aab13733124a5aaac65531a5f99e78.jpg"}, {name:"Dare devil",username:"@mr_devil007",verified:true,url:"https://i.pinimg.com/736x/c7/d4/42/c7d442afd9d7b53e72cf9be7a59abd92.jpg"}, {name:"Youtube India",username:"@youtubeindia",verified:true,url:"https://i.pinimg.com/736x/b4/1b/5b/b41b5b10898599ff9ec8657f392bb931.jpg"}, {name:"Abhishek Yadav",username:"@killerboy009",verified:true,url:"https://i.pinimg.com/474x/28/83/87/2883872452a1832cc819dd0534e5729e.jpg"}].map((items,idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm flex items-center">
                                                      { items.name}
                            <Verified className="fill-blue-500 text-white"/>
                          </div>
                                                  <div className="text-xs text-muted-foreground">{items.username }</div>
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        This is a trending post about the latest topic that everyone is talking about! #TrendingNow
                        #Viral
                      </p>
                      <div className="rounded-lg overflow-hidden mb-3">
                        <Image
                          src={items.url}
                          alt="Post image"
                          width={400}
                          height={200}
                          className="w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground text-xs">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                          <span>4.2K</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3"></path>
                          </svg>
                          <span>1.8K</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <span>32K</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                          </svg>
                          <span>Share</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - Suggested Accounts */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Star className="mr-2 h-5 w-5 text-primary" />
                    Suggested Accounts
                  </CardTitle>
                  <CardDescription>Popular accounts you might like</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="space-y-4">
                    {suggestedAccounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={account.avatar} alt={account.name} />
                            <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold flex items-center">
                              {account.name}
                              {account.verified && (
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
                                  className="ml-1 text-primary"
                                >
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{account.handle}</div>
                            <div className="text-xs text-muted-foreground">{account.followers} followers</div>
                          </div>
                        </div>
                        <Button size="sm" className="rounded-full">
                          Follow
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

              {/* Promoted Content */}
              <Card className="overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src="https://i.pinimg.com/736x/3e/bb/41/3ebb416aed77f3809fbb864a8c49e89c.jpggh j"
                    alt="Promoted content"
                    fill
                    className="object-cover object-center"
                  />
                  <Badge className="absolute top-3 left-3 bg-black/50 hover:bg-black/60">Promoted</Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Discover the latest trends in tech</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Stay ahead of the curve with our premium subscription
                  </p>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>

              {/* Topics to Follow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topics to Follow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="py-2 px-3 rounded-full hover:bg-primary/10 cursor-pointer">
                      <Bell className="h-3 w-3 mr-1" />
                      Technology
                    </Badge>
                    <Badge variant="outline" className="py-2 px-3 rounded-full hover:bg-primary/10 cursor-pointer">
                      <Bell className="h-3 w-3 mr-1" />
                      Politics
                    </Badge>
                    <Badge variant="outline" className="py-2 px-3 rounded-full hover:bg-primary/10 cursor-pointer">
                      <Bell className="h-3 w-3 mr-1" />
                      Sports
                    </Badge>
                    <Badge variant="outline" className="py-2 px-3 rounded-full hover:bg-primary/10 cursor-pointer">
                      <Bell className="h-3 w-3 mr-1" />
                      Entertainment
                    </Badge>
                    <Badge variant="outline" className="py-2 px-3 rounded-full hover:bg-primary/10 cursor-pointer">
                      <Bell className="h-3 w-3 mr-1" />
                      Science
                    </Badge>
                    <Badge variant="outline" className="py-2 px-3 rounded-full hover:bg-primary/10 cursor-pointer">
                      <Bell className="h-3 w-3 mr-1" />
                      Health
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <h3 className="text-xl font-bold mb-4">Latest News</h3>

              {/* Featured News */}
              <Card className="mb-6 overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="https://i.pinimg.com/736x/2f/11/6f/2f116fbd31defe4f49246ebcdf908945.jpg"
                    alt="Featured news"
                    fill
                   
                   
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 p-6 text-white">
                    <Badge className="mb-2 bg-primary">Breaking News</Badge>
                    <h3 className="text-2xl font-bold mb-2">
                      Major breakthrough in renewable energy technology announced
                    </h3>
                    <p className="text-white/90 mb-2">
                      Scientists have developed a new solar panel that&apos;s twice as efficient as current models
                    </p>
                    <div className="flex items-center text-sm">
                      <span>Global Science</span>
                      <span className="mx-2">•</span>
                      <span>20 minutes ago</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* News List */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Card key={item} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-1/3 h-40">
                        <Image
                          src={`/placeholder.svg?height=160&width=200`}
                          alt={`News item ${item}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 sm:w-2/3">
                        <Badge className="mb-2">
                          {["Politics", "Technology", "Health", "Business", "Environment"][item % 5]}
                        </Badge>
                        <h4 className="text-lg font-semibold mb-2">
                          This is a headline for news article number {item}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          This is a brief summary of the news article that gives readers an idea of what the story is
                          about without revealing all the details.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>News Source</span>
                            <span className="mx-2">•</span>
                            <span>
                              {item} hour{item !== 1 ? "s" : ""} ago
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Read more
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                Load More News
              </Button>
            </div>

            <div className="md:col-span-4 space-y-6">
              {/* News Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>News Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "World",
                      "Politics",
                      "Business",
                      "Technology",
                      "Science",
                      "Health",
                      "Sports",
                      "Entertainment",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                      >
                        <span>{category}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>Get Daily Updates</CardTitle>
                  <CardDescription>Subscribe to our newsletter for the latest news</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input placeholder="Your email address" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    By subscribing, you agree to our Terms and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sports">
          <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
            <p className="text-muted-foreground">Sports content will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="entertainment">
          <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
            <p className="text-muted-foreground">Entertainment content will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="technology">
          <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
            <p className="text-muted-foreground">Technology content will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Explore by Topic */}
      <div className="mt-8 mb-6">
        <h3 className="text-xl font-bold mb-4">Explore by Topic</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Technology
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Politics
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Sports
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Entertainment
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Science
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Health
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Business
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Travel
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Food
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Fashion
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Art
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Music
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Gaming
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Crypto
          </Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
            Finance
          </Badge>
        </div>
      </div>

      {/* Bottom Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to join the conversation?</h3>
              <p className="text-white/90">Create an account to follow topics and engage with the community</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary">Sign Up</Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


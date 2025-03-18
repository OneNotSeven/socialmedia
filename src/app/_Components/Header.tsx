import React from 'react'
import { Bell, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            {/* Left side - Logo and Name */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-bold text-primary-foreground">V</span>
                </div>
                <span className="hidden font-bold sm:inline-block">Vercel</span>
              </Link>
            </div>
    
            {/* Center - Search Bar */}
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full pl-8" />
              </div>
            </div>
    
            {/* Right side - Notifications */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      3
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>Your recent notifications will appear here.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {[1, 2, 3].map((notification) => (
                      <div key={notification} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="h-8 w-8 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="font-medium">New Message</p>
                          <p className="text-sm text-muted-foreground">You have a new message from a user.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )
}

export default Header
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bell, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockQuestions = [
  {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "Database"],
    votes: 5,
    answers: 3,
    username: "User Name",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "React useState not updating immediately",
    description:
      "I'm having trouble with useState not updating the state immediately when I call the setter function. The component doesn't re-render with the new value...",
    tags: ["React", "JavaScript", "Hooks"],
    votes: 8,
    answers: 2,
    username: "DevUser123",
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "Best practices for JWT token storage",
    description:
      "What are the security implications of storing JWT tokens in localStorage vs cookies? I want to implement authentication in my web app...",
    tags: ["JWT", "Security", "Authentication"],
    votes: 12,
    answers: 5,
    username: "SecureDev",
    timeAgo: "1 day ago",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("newest")
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100">
                StackIt
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link href="/" className="text-sm font-medium text-blue-100 hover:text-white">
                  Home
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white">
                  <DropdownMenuItem className="bg-white hover:bg-gray-50">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-black">New answer on your question</p>
                      <p className="text-xs text-gray-600">Someone answered "How to join 2 columns..."</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/20">
                    <Avatar className="h-8 w-8 ring-2 ring-white/30">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-orange-500 text-white">UN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem className="bg-white hover:bg-gray-50 text-black">
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="bg-white hover:bg-gray-50 text-black">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-black border-gray-300 placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32 bg-white text-black border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="newest" className="bg-white text-black hover:bg-gray-50">
                      Newest
                    </SelectItem>
                    <SelectItem value="unanswered" className="bg-white text-black hover:bg-gray-50">
                      Unanswered
                    </SelectItem>
                    <SelectItem value="most-voted" className="bg-white text-black hover:bg-gray-50">
                      Most Voted
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Link href="/ask">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                    Ask New Question
                  </Button>
                </Link>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {mockQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow bg-white border border-gray-200">
                  <CardContent className="p-6 bg-white">
                    <div className="flex gap-4">
                      {/* Vote Count */}
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <div className="text-lg font-semibold text-blue-600 bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center">
                          {question.votes}
                        </div>
                        <div className="text-xs text-muted-foreground">votes</div>
                        <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <MessageSquare className="h-3 w-3" />
                          {question.answers}
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <Link href={`/question/${question.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary cursor-pointer mb-2 text-black">
                            {question.title}
                          </h3>
                        </Link>
                        <p className="text-gray-700 mb-3 line-clamp-2">{question.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map((tag, index) => (
                            <Badge
                              key={tag}
                              className={`text-xs text-white ${
                                index % 4 === 0
                                  ? "bg-purple-500 hover:bg-purple-600"
                                  : index % 4 === 1
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : index % 4 === 2
                                      ? "bg-green-500 hover:bg-green-600"
                                      : "bg-orange-500 hover:bg-orange-600"
                              }`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>asked by {question.username}</span>
                          <span>{question.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="bg-white text-black border-gray-300">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600">
                  1
                </Button>
                <Button variant="outline" size="sm" className="bg-white text-black border-gray-300 hover:bg-gray-50">
                  2
                </Button>
                <Button variant="outline" size="sm" className="bg-white text-black border-gray-300 hover:bg-gray-50">
                  3
                </Button>
                <Button variant="outline" size="sm" className="bg-white text-black border-gray-300 hover:bg-gray-50">
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <Card className="bg-white">
              <CardHeader className="bg-white">
                <h3 className="font-semibold text-black">Popular Tags</h3>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="flex flex-wrap gap-2">
                  {["React", "JavaScript", "SQL", "Python", "Node.js", "CSS", "HTML", "JWT"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary bg-white text-black border-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

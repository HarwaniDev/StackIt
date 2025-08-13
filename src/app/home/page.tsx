"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import PostList from "@/components/PostList"
import { useHomeData } from "@/hooks/useHomeData"
import { ErrorMessage, SkeletonPostList } from "@/components/LoadingStates"

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState("newest")
    const session = useSession();
    const router = useRouter();

    const {
        posts,
        notifications,
        notificationCount,
        tags,
        totalPosts,
        loading,
        error,
        currentPage, 
        setCurrentPage,
        deleteNotifications,
        sortByUnCommented,
        sortByNewest,
        refetch
    } = useHomeData();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header
                session={session}
                notificationCount={notificationCount}
                notifications={notifications}
                onClearNotifications={deleteNotifications}
                onSignIn={() => signIn("google", { callbackUrl: "http://localhost:3000/home" })}
                onSignOut={() => signOut({callbackUrl: "/home"})}
            />

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-white text-black border-gray-300 placeholder:text-gray-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={filter} onValueChange={(value) => {
                                    setFilter(value);
                                    if (value === "uncommented") {
                                        sortByUnCommented();
                                    }
                                    if (value === "newest") {
                                        sortByNewest();
                                    }
                                }}>
                                    <SelectTrigger className="w-32 bg-white text-black border-gray-300 cursor-pointer">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-300">
                                        <SelectItem value="newest" className="bg-white text-black hover:bg-gray-50 cursor-pointer">
                                            Newest
                                        </SelectItem>
                                        <SelectItem value="uncommented" className="bg-white text-black hover:bg-gray-50 cursor-pointer">
                                            Uncommented
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="bg-black text-white hover:bg-black/90 cursor-pointer" onClick={() => {
                                    session.status === "unauthenticated" ? signIn("google", { callbackUrl: "http://localhost:3000/ask" }) : router.push("/ask");
                                }}>
                                    Share Interview Experience
                                </Button>
                            </div>
                        </div>

                        {/* Posts List */}
                        {loading ? (
                            <SkeletonPostList />
                        ) : error ? (
                            <ErrorMessage message={error} onRetry={refetch} />
                        ) : (
                            <PostList posts={posts} searchQuery={searchQuery} />
                        )}

                        {/* Pagination */}
                        <Pagination
                            totalPages={Math.ceil(totalPosts / 10)}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80">
                        <Card className="bg-white">
                            <CardHeader className="bg-white">
                                <h3 className="font-semibold text-black">Popular Tags</h3>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-secondary bg-white text-black border-gray-300"
                                        >
                                            {tag.name}
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

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { Search, MessageSquare } from "lucide-react"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header";
import axios from "axios"

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState("newest")
    const [notifications, setNotifications] = useState<{
        message: string;
        createdAt: string;
        slug: string;
    }[]>([]);
    const [notificationCount, setNotificationCount] = useState(0)
    const [posts, setPosts] = useState<{
        slug: string;
        title: string;
        description: string;
        createdAt: string;
        author: string;
        tags: string[];
        commentsCount: number;
    }[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPosts, setTotalPosts] = useState(0);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        async function getAllPosts() {
            const response = await axios.get("/api/getAllPosts");
            setPosts(response.data.postsResponse);
            setTotalPosts(response.data.totalPosts);
        }

        async function getNotificationData() {
            const response = await axios.get("/api/getNotifications");
            setNotifications(response.data);
            setNotificationCount(response.data.length);
        }

        Promise.all([getAllPosts(), getNotificationData()]).catch((err) => {
            console.error('Error loading post data:', err);
        })
    }, [])

    const handleDeleteNotifications = async () => {
        await axios.get("/api/deleteNotifications");
    }

    function sortByUnCommented() {
        const sortedPosts = [...posts].sort((a, b) => {
            return a.commentsCount - b.commentsCount
        });
        setPosts(sortedPosts);
    }

    function sortByNewest() {
        const sortedPosts = [...posts].sort((a, b) => {
            const [dayA, monthA, yearA] = a.createdAt.split('/').map(Number);
            const [dayB, monthB, yearB] = b.createdAt.split('/').map(Number);

            const dateA = new Date(yearA!, monthA! - 1, dayA);
            const dateB = new Date(yearB!, monthB! - 1, dayB);

            return dateB.getTime() - dateA.getTime();
        });
        setPosts(sortedPosts)
    }
    
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header
                session={session}
                notificationCount={notificationCount}
                notifications={notifications}
                onClearNotifications={() => {
                    handleDeleteNotifications();
                    setNotifications([]);
                    setNotificationCount(0);
                }}
                onSignIn={() => signIn("google", { callbackUrl: "http://localhost:3000/home" })}
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
                                    <SelectTrigger className="w-32 bg-white text-black border-gray-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-300">
                                        <SelectItem value="newest" className="bg-white text-black hover:bg-gray-50">
                                            Newest
                                        </SelectItem>
                                        <SelectItem value="uncommented" className="bg-white text-black hover:bg-gray-50">
                                            Uncommented
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white" onClick={() => {
                                    session.status === "unauthenticated" ? signIn("google", { callbackUrl: "http://localhost:3000/ask" }) : router.push("/ask");
                                }}>
                                    Share Interview Experience
                                </Button>
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="space-y-4">
                            {posts && (
                                posts.filter((post) =>
                                    searchQuery.trim() === "" ||
                                    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    post.description.toLowerCase().includes(searchQuery.toLowerCase())
                                ).length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">No results found.</div>
                                ) : (
                                    posts
                                        .filter((post) =>
                                            searchQuery.trim() === "" ||
                                            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            post.description.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((post, index) => (
                                            <Card key={index} className="hover:shadow-md transition-shadow bg-white border-green-500">
                                                <CardContent className="p-6 bg-white">
                                                    <div className="flex flex-col">
                                                        {/* Post Content */}
                                                        <div className="flex-1 flex flex-col">
                                                            <Link href={`/post/${post.slug}`}>
                                                                <h3 className="text-lg font-semibold hover:text-primary cursor-pointer mb-2 text-black">
                                                                    {post.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-gray-700 mb-3 line-clamp-2">{post.description}</p>
                                                            {/* Post Stats */}
                                                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                                                <div className="flex items-center gap-1">
                                                                    <MessageSquare className="h-4 w-4 text-green-600" />
                                                                    <span>{post.commentsCount} comments</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {post.tags.map((tag, index) => (
                                                                    <Badge
                                                                        key={tag}
                                                                        className={`text-xs text-white ${index % 4 === 0
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
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                                                {post.author.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span>posted by <span className="font-medium text-gray-800">{post.author}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-500">•</span>
                                                            <span className="font-medium">{post.createdAt}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                )
                            )}
                        </div>

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

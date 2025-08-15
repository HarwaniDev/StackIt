"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/Header";
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

// TypeScript interfaces for type safety
interface Post {
    id: string;
    slug: string;
    title: string;
    createdAt: string;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
}

interface User {
    id: string;
    bio?: string;
    createdAt: string;
    posts: Post[];
    comments: Comment[];
}

// Using real user data from /api/getUser

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [bioDraft, setBioDraft] = useState("")
    const [posts, setPosts] = useState<Post[]>([])
    const [comments, setComments] = useState<Comment[]>([])
    const [notifications, setNotifications] = useState<unknown[]>([])

    const session = useSession();
    const router = useRouter();

    const handleSaveBio = async () => {
        try {
            // Send API request to update bio
            await axios.post("/api/addBio", {
                bio: bioDraft
            });
            
            // Update local state
            setUser((prev: User | null) => (prev ? { ...prev, bio: bioDraft } : prev))
            setIsEditingBio(false)
        } catch (error) {
            console.error("Error updating bio:", error);
            // You might want to show an error message to the user here
        }
    }

    const handleCancelEdit = () => {
        setBioDraft(user?.bio ?? "")
        setIsEditingBio(false)
    }

    // Type guard functions
    const isPost = (obj: unknown): obj is Post => {
        return obj !== null && 
               typeof obj === 'object' && 
               'id' in obj && 
               'slug' in obj && 
               'title' in obj && 
               'createdAt' in obj;
    }

    const isComment = (obj: unknown): obj is Comment => {
        return obj !== null && 
               typeof obj === 'object' && 
               'id' in obj && 
               'content' in obj && 
               'createdAt' in obj;
    }

    const isUser = (obj: unknown): obj is User => {
        return obj !== null && 
               typeof obj === 'object' && 
               'id' in obj && 
               'createdAt' in obj;
    }

    useEffect(() => {
        async function getUserInfo() {
            try {
                const response = await axios.get("/api/getUser");
                const u = response.data;
                
                if (isUser(u)) {
                    setUser(u);
                    setBioDraft(u.bio ?? "");
                    setPosts(Array.isArray(u.posts) ? u.posts.filter(isPost) : []);
                    setComments(Array.isArray(u.comments) ? u.comments.filter(isComment) : []);
                } else {
                    console.error("Invalid user data received");
                }
                setNotifications([]);
            } catch (error) {
                console.error(error);
            }
        }
        void getUserInfo()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {session.status !== "loading" &&
                <div>
                    {/* Header */}
                    <Header
                        session={session}
                        notificationCount={notifications.length}
                        onSignOut={() => { void signOut({ callbackUrl: "/home" }); }}
                    />

                    <div className="container mx-auto px-4 py-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Profile Info */}
                                <div className="lg:col-span-1">
                                    <Card className="bg-white">
                                        <CardContent className="p-6 bg-white">
                                            <div className="flex flex-col items-center text-center">
                                                <Avatar className="h-24 w-24 mb-4">
                                                    <img src={session.data?.user.image ?? ""} />
                                                </Avatar>
                                                <h1 className="text-2xl font-bold text-black mb-2">{session.data?.user.name}</h1>
                                                <p className="text-gray-600 mb-4">{session.data?.user.email}</p>

                                                {/* Bio Section */}
                                                <div className="w-full mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-sm font-semibold text-black">Bio</h3>
                                                        {!isEditingBio && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setIsEditingBio(true)}
                                                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {isEditingBio ? (
                                                        <div className="space-y-2">
                                                            <Textarea
                                                                value={bioDraft}
                                                                onChange={(e) => setBioDraft(e.target.value)}
                                                                placeholder="Tell us about yourself..."
                                                                className="min-h-[100px] bg-white text-black border-gray-300"
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={handleSaveBio}
                                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                                >
                                                                    <Save className="h-4 w-4 mr-1" />
                                                                    Save
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={handleCancelEdit}
                                                                    className="bg-white text-black border-gray-300 hover:bg-gray-50"
                                                                >
                                                                    <X className="h-4 w-4 mr-1" />
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-700 text-sm text-left">
                                                            {user?.bio ?? "No bio added yet. Click edit to add your bio."}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="w-full space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Joined:</span>
                                                        <span className="text-black font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" }) : ""}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Stats Card */}
                                    <Card className="bg-white mt-6">
                                        <CardHeader className="bg-white">
                                            <CardTitle className="text-black">Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                                                    <div className="text-sm text-gray-600">Posts</div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{comments.length}</div>
                                                    <div className="text-sm text-gray-600">Comments</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Activity Feed */}
                                <div className="lg:col-span-2">
                                    {/* Recent Posts */}
                                    <Card className="bg-white mb-6">
                                        <CardHeader className="bg-white">
                                            <CardTitle className="text-black">Recent Posts</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            <div className="space-y-4">
                                                {posts.map((post: Post) => (
                                                    <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                        <Link href={`/post/${post.slug}`}>
                                                            <h3 className="text-lg font-medium text-black hover:text-blue-600 cursor-pointer mb-2">
                                                                {post.title}
                                                            </h3>
                                                        </Link>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Comments */}
                                    <Card className="bg-white">
                                        <CardHeader className="bg-white">
                                            <CardTitle className="text-black">Recent Comments</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            <div className="space-y-4">
                                                {comments.map((comment: Comment) => (
                                                    <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

        </div>
    )
}

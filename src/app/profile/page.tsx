"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/Header";
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

const mockUserData = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Full-stack developer with 5 years of experience in React, Node.js, and SQL. Love helping others learn programming!",
    joinedDate: "January 2023",
    questionsAsked: 12,
    answersGiven: 34,
    reputation: 1250,
    tags: ["React", "JavaScript", "Node.js", "SQL", "Python"],
}

const mockRecentQuestions = [
    {
        id: 1,
        title: "How to optimize React component re-renders?",
        votes: 8,
        answers: 3,
        timeAgo: "2 days ago",
    },
    {
        id: 2,
        title: "Best practices for Node.js error handling",
        votes: 12,
        answers: 5,
        timeAgo: "1 week ago",
    },
    {
        id: 3,
        title: "SQL query performance optimization tips",
        votes: 15,
        answers: 7,
        timeAgo: "2 weeks ago",
    },
]

const mockRecentAnswers = [
    {
        id: 1,
        questionTitle: "How to join 2 columns in a data set to make a separate column in SQL",
        votes: 8,
        isAccepted: true,
        timeAgo: "1 hour ago",
    },
    {
        id: 2,
        questionTitle: "React useState not updating immediately",
        votes: 5,
        isAccepted: false,
        timeAgo: "3 hours ago",
    },
    {
        id: 3,
        questionTitle: "Best practices for JWT token storage",
        votes: 12,
        isAccepted: true,
        timeAgo: "1 day ago",
    },
]

export default function ProfilePage() {
    const [userData, setUserData] = useState(mockUserData)
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [bioText, setBioText] = useState(userData.bio)
    const [notificationCount] = useState(3)
    const [bio, setBio] = useState("");
    const [questionsByUser, setQuestionsByUser] = useState<any>([]);
    const [answersByUser, setAnswersByUser] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userCreated, setUserCreated] = useState();

    const session = useSession();
    const router = useRouter();

    const handleSaveBio = () => {
        setUserData({ ...userData, bio: bioText })
        setIsEditingBio(false)
    }

    const handleCancelEdit = () => {
        setBioText(userData.bio)
        setIsEditingBio(false)
    }

    // Redirect unauthenticated users
    useEffect(() => {
        if (session.status === "unauthenticated") {
            const timeout = setTimeout(() => {
                router.push("/api/auth/signin?callbackUrl=/ask");
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [session.status, router]);

    if (session.status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-8 py-6 rounded shadow text-center">
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="mb-2">You must be logged in to access this page.</p>
                    <p>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        async function getUserInfo() {
            const response = await axios.get("/api/getUser");
            const user = response.data;
            setBio(user.bio);
            setNotifications(user.notifications);
            setAnswersByUser(user.answers);
            setQuestionsByUser(user.questions);

            console.log(user.questions);
            
        }
        getUserInfo()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {session.status !== "loading" &&
                <div>
                    {/* Header */}
                    <Header
                        session={session}
                        notificationCount={notificationCount}
                        onSignOut={() => { signOut({ callbackUrl: "/home" }) }}
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
                                                                value={bioText}
                                                                onChange={(e) => setBioText(e.target.value)}
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
                                                            {userData.bio || "No bio added yet. Click edit to add your bio."}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="w-full space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Joined:</span>
                                                        <span className="text-black font-medium">{userData.joinedDate}</span>
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
                                                    <div className="text-2xl font-bold text-blue-600">{userData.questionsAsked}</div>
                                                    <div className="text-sm text-gray-600">Questions</div>
                                                </div>
                                                <div className="p-3 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{userData.answersGiven}</div>
                                                    <div className="text-sm text-gray-600">Answers</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Activity Feed */}
                                <div className="lg:col-span-2">
                                    {/* Recent Questions */}
                                    <Card className="bg-white mb-6">
                                        <CardHeader className="bg-white">
                                            <CardTitle className="text-black">Recent Questions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            <div className="space-y-4">
                                                {questionsByUser.map((question: any) => (
                                                    <div key={question.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                        <Link href={`/question/${question.id}`}>
                                                            <h3 className="text-lg font-medium text-black hover:text-blue-600 cursor-pointer mb-2">
                                                                {question.title}
                                                            </h3>
                                                        </Link>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-blue-600 font-medium">{question.votes}</span> votes
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-green-600 font-medium">{question.answers}</span> answers
                                                            </span>
                                                            <span>{question.timeAgo}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Answers */}
                                    <Card className="bg-white">
                                        <CardHeader className="bg-white">
                                            <CardTitle className="text-black">Recent Answers</CardTitle>
                                        </CardHeader>
                                        <CardContent className="bg-white">
                                            <div className="space-y-4">
                                                {mockRecentAnswers.map((answer) => (
                                                    <div key={answer.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                                        <Link href={`/question/${answer.id}`}>
                                                            <h3 className="text-lg font-medium text-black hover:text-blue-600 cursor-pointer mb-2">
                                                                {answer.questionTitle}
                                                            </h3>
                                                        </Link>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-blue-600 font-medium">{answer.votes}</span> votes
                                                            </span>
                                                            {answer.isAccepted && <Badge className="bg-green-500 text-white text-xs">✓ Accepted</Badge>}
                                                            <span>{answer.timeAgo}</span>
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

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"

interface Post {
    slug: string;
    title: string;
    description: string;
    createdAt: string;
    author: string;
    tags: string[];
    commentsCount: number;
}

interface Notification {
    message: string;
    createdAt: string;
    slug: string;
}

interface Tag {
    name: string;
}

export function useHomeData() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<Post[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [notificationCount, setNotificationCount] = useState(0)
    const [tags, setTags] = useState<Tag[]>([])
    const [totalPosts, setTotalPosts] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // Always fetch posts and tags
            const [postsResponse, tagsResponse] = await Promise.all([
                axios.post("/api/getAllPosts", {
                    page: currentPage
                }),
                axios.get("/api/getTags")
            ])

            setPosts(postsResponse.data.postsResponse)
            setTotalPosts(postsResponse.data.totalPosts)
            setTags(tagsResponse.data)

            // Only fetch notifications if user is logged in
            if (session) {
                try {
                    const notificationsResponse = await axios.get("/api/getNotifications")
                    setNotifications(notificationsResponse.data)
                    setNotificationCount(notificationsResponse.data.length)
                } catch (err) {
                    console.error('Error loading notifications:', err)
                    // Don't fail the entire request if notifications fail
                    setNotifications([])
                    setNotificationCount(0)
                }
            } else {
                setNotifications([])
                setNotificationCount(0)
            }
        } catch (err) {
            console.error('Error loading data:', err)
            setError('Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [currentPage, session])

    const deleteNotifications = useCallback(async () => {
        if (!session) return
        
        try {
            await axios.get("/api/deleteNotifications")
            setNotifications([])
            setNotificationCount(0)
        } catch (err) {
            console.error('Error deleting notifications:', err)
        }
    }, [session])

    const sortByUnCommented = useCallback(() => {
        setPosts(prevPosts =>
            [...prevPosts].sort((a, b) => a.commentsCount - b.commentsCount)
        )
    }, [])

    const sortByNewest = useCallback(() => {
        setPosts(prevPosts =>
            [...prevPosts].sort((a, b) => {
                const [dayA, monthA, yearA] = a.createdAt.split('/').map(Number);
                const [dayB, monthB, yearB] = b.createdAt.split('/').map(Number);

                const dateA = new Date(yearA!, monthA! - 1, dayA);
                const dateB = new Date(yearB!, monthB! - 1, dayB);

                return dateB.getTime() - dateA.getTime();
            })
        )
    }, [])

    useEffect(() => {
        void fetchAllData()
    }, [fetchAllData])

    return {
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
        refetch: fetchAllData
    }
}

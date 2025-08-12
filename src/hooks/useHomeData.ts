import { useState, useEffect, useCallback } from "react"
import axios from "axios"

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
    const [posts, setPosts] = useState<Post[]>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [notificationCount, setNotificationCount] = useState(0)
    const [tags, setTags] = useState<Tag[]>([])
    const [totalPosts, setTotalPosts] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            const [postsResponse, notificationsResponse, tagsResponse] = await Promise.all([
                axios.get("/api/getAllPosts"),
                axios.get("/api/getNotifications"),
                axios.get("/api/getTags")
            ])

            setPosts(postsResponse.data.postsResponse)
            setTotalPosts(postsResponse.data.totalPosts)
            setNotifications(notificationsResponse.data)
            setNotificationCount(notificationsResponse.data.length)
            setTags(tagsResponse.data)
        } catch (err) {
            console.error('Error loading data:', err)
            setError('Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteNotifications = useCallback(async () => {
        try {
            await axios.get("/api/deleteNotifications")
            setNotifications([])
            setNotificationCount(0)
        } catch (err) {
            console.error('Error deleting notifications:', err)
        }
    }, [])

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
        fetchAllData()
    }, [fetchAllData])

    return {
        posts,
        notifications,
        notificationCount,
        tags,
        totalPosts,
        loading,
        error,
        deleteNotifications,
        sortByUnCommented,
        sortByNewest,
        refetch: fetchAllData
    }
}

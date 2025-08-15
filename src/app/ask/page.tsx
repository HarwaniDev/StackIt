"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"
import Header from "@/components/Header";
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"

// Define types for API responses
interface Notification {
  message: string;
  createdAt: string;
  slug: string;
}

interface PostResponse {
  authorId: string;
  id: string;
  slug: string;
}

export default function AddPostPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0)
  const session = useSession();
  const router = useRouter();

  // Fetch notifications for authenticated users
  useEffect(() => {
    if (session.status === "authenticated") {
      async function getNotificationData() {
        try {
          const response = await axios.get<Notification[]>("/api/getNotifications");
          setNotifications(response.data);
          setNotificationCount(response.data.length);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }

      void getNotificationData();
    }
  }, [session.status]);

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags);
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<PostResponse>("/api/addPost", {
        title,
        description,
        tags
      });
      const post = response.data;

      await axios.post("/api/addNotification", {
        userId: post.authorId,
        postId: post.id,
        type: "POST_CREATED"
      });
      router.push(`/post/${post.slug}`);
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  }

  return (

    <div className="min-h-screen bg-white">

      {/* Header */}
      <Header
        session={session}
        notificationCount={notificationCount}
        notifications={notifications}
        onSignOut={() => { void signOut({ callbackUrl: "https://stackit-theta.vercel.app/home" }); }}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-2xl text-black">Share Your Interview Experience</CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-black">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Give your post a clear, descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-black">
                    Description
                  </Label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Share your interview experience in detail..."
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-black">
                    Tags
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter or comma to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onBlur={() => { void addTag(tagInput); }}
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="flex items-center gap-1 bg-black text-white"
                          >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)}>
                              <X className="h-3 w-3 cursor-pointer hover:text-white/80" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Submit Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

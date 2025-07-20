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

export default function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [notificationCount] = useState(3)
  const session = useSession();
  const router = useRouter();

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

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    // console.log({ title, description, tags })

    const response = await axios.post("/api/addQuestion", {
      title,
      description,
      tags
    });
    const question = response.data;
    router.push(`/question/${question.slug}`);
  }

  return (
    
    <div className="min-h-screen bg-white">
    
      {/* Header */}
      <Header
        session={session}
        notificationCount={notificationCount}
        onSignOut={() => {signOut({callbackUrl: "http://localhost:3000/home"})}}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-2xl text-gray-800">Ask a Question</CardTitle>
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
                    placeholder="Be specific and imagine you're asking a question to another person"
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
                    placeholder="Include all the information someone would need to answer your question"
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
                      onBlur={() => addTag(tagInput)}
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge
                            key={tag}
                            className={`flex items-center gap-1 text-white ${
                              index % 4 === 0
                                ? "bg-purple-500"
                                : index % 4 === 1
                                  ? "bg-blue-500"
                                  : index % 4 === 2
                                    ? "bg-green-500"
                                    : "bg-orange-500"
                            }`}
                          >
                            {tag}
                            <X className="h-3 w-3 cursor-pointer hover:text-red-200" onClick={() => removeTag(tag)} />
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
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    Submit Question
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

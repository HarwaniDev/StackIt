"use client"

import type React from "react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Bell, Check, Loader2 } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"
import Header from "@/components/Header";
import { signOut, useSession } from "next-auth/react";
import axios from "axios"
import { renderPreview } from "@/components/ui/render"
import { Pagination } from "@/components/ui/pagination"

// TypeScript interfaces for type safety
interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  votes: number;
}

interface Post {
  postId: string;
  title: string;
  description: string;
  name: string;
  postAuthorId: string;
  createdAt: string;
  tagsInPost: string[];
  comments: Comment[];
  totalComments: number;
}

interface Vote {
  commentId: string;
  value: number;
}

export default function PostDetailPage() {

  const { slug } = useParams();
  const session = useSession();

  const [commentContent, setCommentContent] = useState("")
  const [notificationCount, setNotificationCount] = useState(0);
  const [userVotes, setUserVotes] = useState<{ [key: string]: "up" | "down" | null }>({})
  const [comments, setComments] = useState<Comment[]>([]);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postId, setPostId] = useState("");
  const [postAuthor, setPostAuthor] = useState("");
  const [postAuthorId, setPostAuthorId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [voteCount, setVoteCount] = useState<{ [key: string]: number }>({});
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [notifications, setNotifications] = useState<{
    message: string;
    createdAt: string;
    slug: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (commentId: string, voteType: "up" | "down") => {
    const currentVote = userVotes[commentId]
    if (currentVote === voteType) {
      // Remove vote if clicking the same vote
      setUserVotes((prev) => ({ ...prev, [commentId]: null }))
      await axios.post("/api/handleVote", {
        commentId: commentId,
        voteType: 0
      })
    } else {
      // Set new vote
      setUserVotes((prev) => ({ ...prev, [commentId]: voteType }))
      await axios.post("/api/handleVote", {
        commentId: commentId,
        voteType: voteType === "up" ? 1 : -1
      })
    }

    if (!currentVote && voteType) {
      setVoteCount((prev) => ({ ...prev, [commentId]: (prev[commentId] ?? 0) + 1 }));
    } else if (currentVote !== voteType) {

    } else if (currentVote === voteType) {
      setVoteCount((prev) => ({ ...prev, [commentId]: (prev[commentId] ?? 0) - 1 }));
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);

    try {
      const [response, _] = await Promise.all([
        // Handle comment submission
        axios.post("/api/addComment", {
          content: commentContent,
          slug: slug
        }),

        // handle adding notification
        axios.post("/api/addNotification", {
          userId: postAuthorId,
          postId: postId,
          type: "COMMENT_RECEIVED"
        })
      ]);
      // Get the current user's name for the new comment
      const currentUser = session.data?.user;

      // Create a new comment object with the same structure as the existing comments
      const newComment: Comment = {
        id: response.data.id,
        createdAt: new Date().toLocaleDateString(),
        content: commentContent,
        authorName: currentUser?.name ?? "",
        authorId: currentUser?.id ?? "",
        votes: 0,
      };

      setComments((prev) => [...prev, newComment]);
      setVoteCount((prev) => ({ ...prev, [response.data.id]: 0 }));
      setCommentContent("");
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function getPost() {
      try {
        const response = await axios.post<Post>("/api/getPost", {
          slug: slug,
          page: page
        });
        setPostId(response.data.postId);
        setPostContent(response.data.description);
        setPostTitle(response.data.title);
        setCreatedAt(response.data.createdAt);
        setPostTags(response.data.tagsInPost);
        setComments(response.data.comments);
        setPostAuthor(response.data.name);
        setPostAuthorId(response.data.postAuthorId);
        setTotalComments(response.data.totalComments);

        const voteCounts = response.data.comments.reduce((acc: { [key: string]: number }, comment: Comment) => {
          acc[comment.id] = comment.votes;
          return acc;
        }, {});

        setVoteCount(voteCounts);
      } catch (error) {
        console.error('Error loading post:', error);
      }
    }

    async function getVotesData() {
      try {
        const response = await axios.post<{ commentIds: Vote[] }>("/api/checkVotes", {
          slug
        });

        response.data.commentIds.map((vote: Vote) => {
          let voteType: "up" | "down";
          if (vote.value === 1) {
            voteType = "up"
          } else {
            voteType = "down"
          }
          const commentId = vote.commentId
          setUserVotes((prev) => ({ ...prev, [commentId]: voteType }))
        })
      } catch (error) {
        console.error('Error loading votes:', error);
      }
    }

    async function getNotificationData() {
      try {
        const response = await axios.get("/api/getNotifications");
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
    
    setIsLoading(true);
    Promise.all([getPost(), getVotesData(), getNotificationData()])
      .catch(error => {
        console.error('Error loading post data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  const handleDeleteNotifications = async () => {
    await axios.get("/api/deleteNotifications");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header
          session={session}
          notificationCount={notificationCount}
          notifications={notifications}
          onClearNotifications={() => {
            handleDeleteNotifications();
            setNotifications([]);
            setNotificationCount(0);
          }}
          // onSignIn={() => signIn("google", { callbackUrl: "http://localhost:3000/post/1" })}
          onSignOut={() => { void signOut({callbackUrl: "/home"}); }}
        />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Loading post...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          // onSignIn={() => signIn("google", { callbackUrl: "http://localhost:3000/post/1" })}
          onSignOut={() => { void signOut({callbackUrl: "/home"}); }}
        />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">

          {/* Post */}
          <Card className="mb-8 bg-white">
            <CardContent className="p-6 bg-white">
              <h1 className="text-2xl font-bold mb-4 text-black">{postTitle}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {postTags.map((tag) => (
                  <Badge key={tag} className="text-white bg-black">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="prose max-w-none mb-6">
                <div
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderPreview(postContent) }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                <span>posted by {postAuthor}</span>
                <span>{createdAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Comments ({totalComments})</h2>

            <div className="space-y-6">
              {comments.map((comment, index) => (
                <Card key={index} className="border border-gray-200 bg-white">
                  <CardContent className="p-6 bg-white">
                    <div className="flex gap-4">
                      {/* Vote Controls */}
                      <div className="flex flex-col items-center gap-2 min-w-[60px]">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { void handleVote(comment.id, "up"); }}
                          className={`hover:bg-green-100 ${userVotes[comment.id] === "up" ? "text-green-600 bg-green-100" : "text-gray-500"}`}
                        >
                          <ChevronUp className="h-5 w-5" />
                        </Button>
                        <span className="text-lg font-semibold text-blue-600 bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center">
                          {voteCount[comment.id]}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { void handleVote(comment.id, "down"); }}
                          className={`hover:bg-red-100 ${userVotes[comment.id] === "down" ? "text-red-600 bg-red-100" : "text-gray-500"}`}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 flex flex-col">
                        <div
                          className="prose max-w-none flex-1"
                          dangerouslySetInnerHTML={{ __html: renderPreview(comment.content) }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span>commented by {comment.authorName}</span>

                        {comment.authorId === postAuthorId && (
                          <Badge className="bg-black text-white text-xs">
                            OP
                          </Badge>
                        )}
                      </div>
                      <span>{comment.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Pagination
            totalPages={Math.ceil(totalComments / 10)}
            currentPage={page}
            onPageChange={setPage}
            className="mb-8"
          />

          {/* Submit Comment */}
          <Card className="bg-white">
            <CardContent className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4 text-black">Submit Your Comment</h3>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <RichTextEditor
                  value={commentContent}
                  onChange={setCommentContent}
                  placeholder="Write your comment here..."
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!commentContent.trim() || isSubmitting}
                    className="bg-black text-white hover:bg-black/90 disabled:bg-gray-400 disabled:text-gray-600 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Comment"
                    )}
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

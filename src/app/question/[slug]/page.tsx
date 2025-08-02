"use client"

import type React from "react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Bell, Check } from "lucide-react"
import Link from "next/link"
import RichTextEditor from "@/components/rich-text-editor"
import Header from "@/components/Header";
import { signIn, useSession } from "next-auth/react";
import axios from "axios"
import { renderPreview } from "@/components/ui/render"
import { Pagination } from "@/components/ui/pagination"

export default function QuestionDetailPage() {

  const { slug } = useParams();
  const session = useSession();

  const [answerContent, setAnswerContent] = useState("")
  const [notificationCount] = useState(3)
  const [userVotes, setUserVotes] = useState<{ [key: string]: "up" | "down" | null }>({})
  const [answers, setAnswers] = useState<any[]>([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [questionAuthor, setQuestionAuthor] = useState("");
  const [questionAuthorId, setQuestionAuthorId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [questionTags, setQuestionTags] = useState([]);
  const [voteCount, setVoteCount] = useState<{ [key: string]: number }>({});
  const [page, setPage] = useState(1);
  const [totalAnswers, setTotalAnswers] = useState(0);

  const handleVote = async (answerId: string, voteType: "up" | "down") => {
    const currentVote = userVotes[answerId]
    if (currentVote === voteType) {
      // Remove vote if clicking the same vote
      setUserVotes((prev) => ({ ...prev, [answerId]: null }))
      await axios.post("/api/handleVote", {
        userId: session.data?.user.id,
        answerId: answerId,
        voteType: 0
      })
    } else {
      // Set new vote
      setUserVotes((prev) => ({ ...prev, [answerId]: voteType }))
      await axios.post("/api/handleVote", {
        userId: session.data?.user.id,
        answerId: answerId,
        voteType: voteType === "up" ? 1 : -1
      })
    }

    if (!currentVote && voteType) {
      setVoteCount((prev) => ({ ...prev, [answerId]: (prev[answerId] ?? 0) + 1 }));
    } else if (currentVote !== voteType) {

    } else if (currentVote === voteType) {
      setVoteCount((prev) => ({ ...prev, [answerId]: (prev[answerId] ?? 0) - 1 }));
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle answer submission
    const response = await axios.post("/api/addAnswer", {
      content: answerContent,
      slug: slug
    })

    // Get the current user's name for the new answer
    const currentUser = session.data?.user;

    // Create a new answer object with the same structure as the existing answers
    const newAnswer = {
      id: response.data.id,
      createdAt: new Date().toLocaleDateString(),
      content: answerContent,
      authorName: currentUser?.name ?? "",
      authorId: currentUser?.id ?? "",
      votes: 0,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setVoteCount((prev) => ({ ...prev, [response.data.id]: 0 }));
    setAnswerContent("");
  };

  useEffect(() => {
    async function getQuestion() {
      const response = await axios.post("/api/getQuestion", {
        slug: slug,
        page: page
      });

      setQuestionContent(response.data.description);
      setQuestionTitle(response.data.title);
      setCreatedAt(response.data.createdAt);
      setQuestionTags(response.data.tagsInQuestion);
      setAnswers(response.data.answers);
      setQuestionAuthor(response.data.name);
      setQuestionAuthorId(response.data.questionAuthorId);
      setTotalAnswers(response.data.totalAnswers);

      const voteCounts = response.data.answers.reduce((acc: any, answer: any) => {
        acc[answer.id] = answer.votes;
        return acc;
      }, {});

      setVoteCount(voteCounts);
    }

    async function getVotesData() {
      const response = await axios.post("/api/checkVotes", {
        slug
      });

      response.data.answerIds.map((vote: any) => {
        let voteType: string;
        if (vote.value === 1) {
          voteType = "up"
        } else {
          voteType = "down"
        }
        const answerId = vote.answerId
        setUserVotes((prev) => ({ ...prev, [answerId]: voteType }))
      })
    }

    getQuestion();
    getVotesData();
  }, [page]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        session={session}
        notificationCount={notificationCount}
        onSignIn={() => signIn("google", { callbackUrl: "http://localhost:3000/question/1" })}
      />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">

          {/* Question */}
          <Card className="mb-8 bg-white">
            <CardContent className="p-6 bg-white">
              <h1 className="text-2xl font-bold mb-4 text-black">{questionTitle}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {questionTags.map((tag, index) => (
                  <Badge
                    key={tag}
                    className={`text-white ${index % 4 === 0
                      ? "bg-purple-500"
                      : index % 4 === 1
                        ? "bg-blue-500"
                        : index % 4 === 2
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{renderPreview(questionContent)}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>asked by {questionAuthor}</span>
                <span>{createdAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Answers ({totalAnswers})</h2>

            <div className="space-y-6">
              {answers.map((answer, index) => (
                <Card key={index} className="border-green-500 bg-white">
                  <CardContent className="p-6 bg-white">
                    <div className="flex gap-4">
                      {/* Vote Controls */}
                      <div className="flex flex-col items-center gap-2 min-w-[60px]">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVote(answer.id, "up")}
                          className={`hover:bg-green-100 ${userVotes[answer.id] === "up" ? "text-green-600 bg-green-100" : "text-gray-500"}`}
                        >
                          <ChevronUp className="h-5 w-5" />
                        </Button>
                        <span className="text-lg font-semibold text-blue-600 bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center">
                          {voteCount[answer.id]}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVote(answer.id, "down")}
                          className={`hover:bg-red-100 ${userVotes[answer.id] === "down" ? "text-red-600 bg-red-100" : "text-gray-500"}`}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="prose max-w-none flex-1">
                          {answer.content}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span>answered by {answer.authorName}</span>
                      
                        {answer.authorId === questionAuthorId && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            OP
                          </Badge>
                        )}
                      </div>
                      <span>{answer.createdAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Pagination
            totalPages={Math.ceil(totalAnswers / 10)}
            currentPage={page}
            onPageChange={setPage}
            className="mb-8"
          />

          {/* Submit Answer */}
          <Card className="bg-white">
            <CardContent className="p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4 text-black">Submit Your Answer</h3>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!answerContent.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:from-gray-400 disabled:to-gray-400"
                  >
                    Submit Answer
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

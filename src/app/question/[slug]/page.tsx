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

const mockQuestion = {
  id: 1,
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description:
    "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine both first name and last name.",
  tags: ["SQL", "Database"],
  votes: 5,
  username: "User Name",
  timeAgo: "2 hours ago",
  isOwner: true,
}

const mockAnswers = [
  {
    id: 1,
    content:
      "You can use the CONCAT function or the || operator to join columns:\n\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name\nFROM your_table;\n```\n\nOr using the || operator:\n\n```sql\nSELECT first_name || ' ' || last_name AS full_name\nFROM your_table;\n```",
    votes: 8,
    username: "SQLExpert",
    timeAgo: "1 hour ago",
    isAccepted: true,
  },
  {
    id: 2,
    content:
      "Another approach is to use the CONCAT_WS function which handles NULL values better:\n\n```sql\nSELECT CONCAT_WS(' ', first_name, last_name) AS full_name\nFROM your_table;\n```",
    votes: 3,
    username: "DatabasePro",
    timeAgo: "30 minutes ago",
    isAccepted: false,
  },
]

export default function QuestionDetailPage() {

  const [answerContent, setAnswerContent] = useState("")
  const [notificationCount] = useState(3)
  const [userVotes, setUserVotes] = useState<{ [key: string]: "up" | "down" | null }>({})
  const [answers, setAnswers] = useState<any[]>([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [votesCount, setVotesCount] = useState(0);
  const [questionAuthor, setQuestionAuthor] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [questionTags, setQuestionTags] = useState([]);

  const { slug } = useParams();
  const session = useSession();

  const handleVote = (answerId: number, voteType: "up" | "down") => {
    const currentVote = userVotes[answerId]
    if (currentVote === voteType) {
      // Remove vote if clicking the same vote
      setUserVotes((prev) => ({ ...prev, [answerId]: null }))
    } else {
      // Set new vote
      setUserVotes((prev) => ({ ...prev, [answerId]: voteType }))
    }
  }

  const handleAcceptAnswer = (answerId: number) => {
    // Handle accepting answer
    console.log("Accept answer:", answerId)
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle answer submission
    const response = await axios.post("/api/addAnswer", {
      content: answerContent,
      slug: slug
    })
    setAnswers([...answers, response.data.answer]);
    console.log(answers);
    
    setAnswerContent("");
  };

  // Enhanced syntax highlighting for code blocks
  const renderAnswerContent = (content: string) => {
    let html = content

    // SQL syntax highlighting
    html = html.replace(/```sql\n([\s\S]*?)```/g, (match, code) => {
      let highlightedCode = code
      // SQL keywords
      highlightedCode = highlightedCode.replace(
        /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP BY|ORDER BY|HAVING|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|DATABASE|INDEX|CONCAT|CONCAT_WS|AS)\b/gi,
        '<span class="text-blue-600 font-semibold">$1</span>',
      )
      // String literals
      highlightedCode = highlightedCode.replace(/'([^']*)'/g, "<span class=\"text-green-600\">'$1'</span>")
      // Comments
      highlightedCode = highlightedCode.replace(/--.*$/gm, '<span class="text-gray-500 italic">$&</span>')

      return `<pre class="bg-gray-100 p-4 rounded border overflow-x-auto my-4"><code class="text-sm font-mono text-black">${highlightedCode}</code></pre>`
    })

    // Generic code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-100 p-4 rounded border overflow-x-auto my-4"><code class="text-sm font-mono text-black">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-black">$1</code>',
    )

    // Line breaks
    html = html.replace(/\n/g, "<br>")

    return html
  }

  useEffect(() => {
    async function getQuestion() {
      const response = await axios.post("/api/getQuestion", {
        slug
      });
      console.log(response.data);
      
      setQuestionContent(response.data.description);
      setVotesCount(response.data.votesLength);
      setQuestionTitle(response.data.title);
      setCreatedAt(response.data.createdAt);
      setQuestionTags(response.data.tagsInQuestion);
      setAnswers(response.data.answers);
      setQuestionAuthor(response.data.name);
    }
    getQuestion();
  }, []);

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
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Questions
            </Link>
            <span className="mx-2">{">"}</span>
            <span>How to join 2...</span>
          </nav>

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
                <p className="text-gray-700">{questionContent}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>asked by {questionAuthor}</span>
                <span>{createdAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Answers ({answers.length})</h2>

            <div className="space-y-6">
              {answers.map((answer, index) => (
                <Card key={index} className={true ? "border-green-500 bg-white" : "bg-white"}>
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
                          {answer.votes}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVote(answer.id, "down")}
                          className={`hover:bg-red-100 ${userVotes[answer.id] === "down" ? "text-red-600 bg-red-100" : "text-gray-500"}`}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                        {/* {mockQuestion.isOwner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAcceptAnswer(answer.id)}
                            className={`hover:bg-green-100 ${answer.isAccepted ? "text-green-600 bg-green-100" : "text-gray-500"}`}
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                        )} */}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1">
                        <div
                          className="prose max-w-none mb-4"
                          dangerouslySetInnerHTML={{ __html: renderAnswerContent(answer.content) }}
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>answered by {answer.authorName}</span>
                          <span>{answer.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { slug, page } = body;
    try {
        const question = await db.question.findUnique({
            where: {
                slug
            },
            include: {
                answers: {
                    include: {
                        votes: true,
                        author: {
                            select: {
                                name: true
                            }
                        }
                    },
                skip: (page - 1) * 10,
                take: 10    
                },
                tags: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                notifications: true
            }
        });
       
        const tagsInQuestion: string[] = [];
        question?.tags.map((tag) => {
            tagsInQuestion.push(tag.tag.name)
        })

        const author = await db.user.findFirst({
            where: {
                id: question?.authorId
            }
        });
        
        let answers: {
            id: string;
            createdAt: string;
            content: string;
            authorName: string;
            authorId: string;
            votes: number;
        }[] = []

        question?.answers.map((answer) => {
            answers.push({
                id: answer.id,
                createdAt: new Date(answer.createdAt).toLocaleDateString(),
                content: answer.content,
                authorName: answer.author.name ?? "",
                votes: answer.votes.length,
                authorId: answer.authorId
            })
        })
        
        const totalAnswers = await db.answer.count({
            where: {
                question: {
                    slug: slug
                }
            }
        })

        const name = author?.name;
        const isoString = question?.createdAt;
        const date = new Date(isoString!).toLocaleDateString();
        
        const response = {
            title: question?.title,
            description: question?.description,
            createdAt: date,
            tagsInQuestion,
            answers,
            totalAnswers,
            name,
            questionAuthorId: question?.authorId,
        }

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the question" }, { status: 500 })
    }


}
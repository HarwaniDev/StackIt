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
                        votes: true
                    },
                skip: (page - 1) * 10,
                take: 10    
                },
                tags: true,
                notifications: true
            }
        });
       
        const tagsInQuestion: string[] = [];
        await Promise.all(
            question?.tags.map(async (tag) => {
                const response = await db.tag.findFirst({
                    where: { id: tag.tagId }
                });
                if (response) {
                    tagsInQuestion.push(response.name);
                }
            }) ?? []
        );
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
            votes: number;
        }[] = []

        
        await Promise.all(
            question?.answers.map(async (answer) => {
                const author = await db.user.findUnique({
                    where: { id: answer.authorId }
                });

                answers.push({
                    id: answer.id,
                    createdAt: new Date(answer.createdAt).toLocaleDateString(),
                    content: answer.content,
                    authorName: author?.name ?? "",
                    votes: answer.votes.length,
                })
            }) ?? []
        )
        
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
            name
        }
        // setQuestionContent(response.data.question.description);
        // setVotesCount(response.data.question.votes.length);
        // setQuestionTitle(response.data.question.title);
        // const isoString = response.data.question.createdAt;
        // const date = new Date(isoString);
        // setCreatedAt(date.toLocaleDateString());
        // setQuestionTags(response.data.tagsInQuestion);
        // setAnswers(response.data.question.answers);
        // setAnswerVotesLength(response.data.question.answers.length)
        // setQuestionAuthor(response.data.name);

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the question" }, { status: 500 })
    }


}
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [questions, totalQuestions] = await Promise.all([
            db.question.findMany({
                include: {
                    author: {
                        select: {
                            name: true
                        }
                    },
                    tags: {
                        include: {
                            tag: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    answers: {
                        select: {
                            _count: true
                        }
                    }
                }
            }),
            db.question.count()
        ]);

        const questionsResponse = questions.map((question) => ({
            slug: question.slug,
            title: question.title,
            description: question.description,
            createdAt: new Date(question.createdAt).toLocaleDateString(),
            author: question.author?.name ?? "",
            tags: question.tags.map((tag) => tag.tag.name) ?? [],
            answersCount: question.answers.length
        }));

        return NextResponse.json({ questionsResponse, totalQuestions }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching all the questions" }, { status: 500 });
    }
};
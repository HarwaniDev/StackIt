import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

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

    const { slug } = body;
    try {
        const question = await db.question.findUnique({
            where: {
                slug: slug
            },
            include: {
                answers: {
                    include: {
                        votes: true
                    }
                }
            }
        });

        const answerIds: {
            answerId: string;
            value: number;
        }[] = [];
        question?.answers.map((answer) => {
            answer.votes.map((vote) => {
                if (vote.userId === session.user.id) {
                    answerIds.push(
                        {
                            answerId: answer.id,
                            value: vote.value
                        }
                    )
                }
            })
        })

        return NextResponse.json({ answerIds }, { status: 201 });
    } catch (error) {
        return NextResponse.json({message: "Error fetching answerIds for votes"}, {status: 500});
    }
}
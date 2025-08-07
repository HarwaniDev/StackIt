import { auth } from "@/server/auth";
import { db } from "@/server/db";
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

    const { userId, commentId, voteType } = body;

    try {
        const vote = await db.vote.findUnique({
            where: {
                userId_commentId: {
                    userId: userId,
                    commentId: commentId
                }
            }
        });

        if (voteType == "1" || voteType == "-1") {
            await db.vote.upsert({
                where: {
                    userId_commentId: {
                        userId: userId,
                        commentId: commentId
                    }
                },
                update: {
                    value: voteType
                },
                create: {
                    userId: userId,
                    commentId: commentId,
                    value: voteType
                }
            })
        } else if (vote && voteType == "0") {
            await db.vote.delete({
                where: {
                    userId_commentId: {
                        userId: userId,
                        commentId: commentId
                    }
                }
            })
        }
        return NextResponse.json({ message: "vote operation successful" }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Failed to add the vote" }, { status: 500 });
    }
}
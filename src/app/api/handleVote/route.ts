import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    commentId: string;
    voteType: number;
}

export const POST = async (req: NextRequest) => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: RequestBody;
    try {
        body = await req.json() as RequestBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { commentId, voteType } = body;
    const userId = session.user.id; // Use authenticated user's ID

    // Validate required fields
    if (!commentId || voteType === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const vote = await db.vote.findUnique({
            where: {
                userId_commentId: {
                    userId: userId,
                    commentId: commentId
                }
            }
        });

        if (voteType === 1 || voteType === -1) {
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
        } else if (voteType === 0) {
            // Delete vote if it exists, otherwise do nothing
            if (vote) {
                await db.vote.delete({
                    where: {
                        userId_commentId: {
                            userId: userId,
                            commentId: commentId
                        }
                    }
                })
            }
        } else {
            return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
        }
        
        return NextResponse.json({ message: "vote operation successful" }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Failed to add the vote" }, { status: 500 });
    }
}
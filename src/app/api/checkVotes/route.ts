import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

interface RequestBody {
    slug: string;
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

    const { slug } = body;
    try {
        const post = await db.post.findUnique({
            where: {
                slug: slug
            },
            include: {
                comments: {
                    include: {
                        votes: true
                    }
                }
            }
        });

        const commentIds: {
            commentId: string;
            value: number;
        }[] = [];
        post?.comments.map((comment) => {
            comment.votes.map((vote) => {
                if (vote.userId === session.user.id) {
                    commentIds.push(
                        {
                            commentId: comment.id,
                            value: vote.value
                        }
                    )
                }
            })
        })

        return NextResponse.json({ commentIds: commentIds }, { status: 201 });
    } catch (error) {
        return NextResponse.json({message: "Error fetching commentIds for votes"}, {status: 500});
    }
}
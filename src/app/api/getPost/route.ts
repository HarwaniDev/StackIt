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
        const post = await db.post.findUnique({
            where: {
                slug
            },
            include: {
                comments: {
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
       
        const tagsInPost: string[] = [];
        post?.tags.map((tag) => {
            tagsInPost.push(tag.tag.name)
        })

        const author = await db.user.findFirst({
            where: {
                id: post?.authorId
            }
        });
        
        let comments: {
            id: string;
            createdAt: string;
            content: string;
            authorName: string;
            authorId: string;
            votes: number;
        }[] = []

        post?.comments.map((comment) => {
            comments.push({
                id: comment.id,
                createdAt: new Date(comment.createdAt).toLocaleDateString(),
                content: comment.content,
                authorName: comment.author.name ?? "",
                votes: comment.votes.length,
                authorId: comment.authorId
            })
        })
        
        const totalComments = await db.comment.count({
            where: {
                post: {
                    slug: slug
                }
            }
        })

        const name = author?.name;
        const isoString = post?.createdAt;
        const date = new Date(isoString!).toLocaleDateString();
        
        const response = {
            postId: post?.id,
            title: post?.title,
            description: post?.description,
            createdAt: date,
            tagsInPost,
            comments,
            totalComments,
            name,
            postAuthorId: post?.authorId,
        }

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the post" }, { status: 500 })
    }


}
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    page: number;
}

export const POST = async (req: NextRequest) => {
    // const session = await auth();
    // if (!session?.user?.id) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    let body: RequestBody;
    try {
        body = await req.json() as RequestBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { page } = body;

    try {
        const [posts, totalPosts] = await Promise.all([
            db.post.findMany({
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
                    comments: {
                        select: {
                            _count: true
                        }
                    }
                },
                skip: (page - 1) * 10,
                take: 10
            }),
            db.post.count()
        ]);

        const postsResponse = posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            description: post.description,
            createdAt: new Date(post.createdAt).toLocaleDateString("en-IN"),
            author: post.author?.name ?? "",
            tags: post.tags.map((tag) => tag.tag.name) ?? [],
            commentsCount: post.comments.length
        }));

        return NextResponse.json({ postsResponse: postsResponse, totalPosts }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching all the posts" }, { status: 500 });
    }
};
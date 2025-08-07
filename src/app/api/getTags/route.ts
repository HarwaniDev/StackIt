import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const postTags = await db.postTag.groupBy({
            by: ['tagId'],
            _count: {
                tagId: true
            },
            orderBy: {
                _count: {
                    tagId: 'desc'
                }
            },
            take: 6
        });
        const tagIds = postTags.map(item => item.tagId);

        const tags = await db.tag.findMany({
            where: {
                id: {
                    in: tagIds
                }
            }
        });

        return NextResponse.json(tags, {status: 201});
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching tags"
        }, {status: 500});
    }
}
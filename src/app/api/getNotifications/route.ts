import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notifications = await db.notification.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                post: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        const response = notifications.map((notification) => ({
            message: notification.message,
            createdAt: new Date(notification.createdAt).toLocaleDateString("en-IN"),
            slug: notification.post?.slug
        }));

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching all notifications." }, { status: 500 });
    }
}
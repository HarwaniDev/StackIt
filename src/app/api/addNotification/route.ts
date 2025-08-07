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
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    try {
        const { userId, type, postId } = body;

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        });

        let message;
        if (type === "POST_CREATED") {
            message = "Your post has been successfully created!";
        } else if (type === "COMMENT_RECEIVED") {
            message = `Someone has commented on your post: ${post?.title}`; 
        }

        const notification = await db.notification.create({
            data: {
                userId: userId,
                postId: postId,
                type: type,
                message: message!
            }
        });
        const response = {
            message: notification.message,
        }
        return NextResponse.json({ response }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "There has been an error adding a notification" }, { status: 500 })
    }



}
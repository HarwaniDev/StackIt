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
        const { userId, type, questionId } = body;

        const question = await db.question.findUnique({
            where: {
                id: questionId
            }
        });

        let message;
        if (type === "QUESTION_POSTED") {
            message = "Your question has been successfully posted!";
        } else if (type === "ANSWER_RECEIVED") {
            message = `Someone has commented on your question: ${question?.title}`; 
        }

        const notification = await db.notification.create({
            data: {
                userId: userId,
                questionId: questionId,
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
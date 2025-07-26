import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

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

    const { content, slug } = body;

    if (typeof content !== "string" || typeof slug !== "string") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
        const question = await db.question.findUnique({
            where: {
                slug
            }
        });

        // TODO :- correct ?? here
        const answer = await db.answer.create({
            data: {
                content: content,
                questionId: question?.id ?? "",
                authorId: session.user.id
            },
            include: {
                votes: true,
            }
        });
        return NextResponse.json(answer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add answer" }, { status: 500 });
    }
}
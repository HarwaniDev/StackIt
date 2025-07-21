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

    const { slug } = body;
    try {
        const question = await db.question.findUnique({
            where: {
                slug
            },
            include: {
                answers: true,
                votes: true,
                tags: true,
                notifications: true
            }
        });
        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch the question"}, {status: 500})
    }


}
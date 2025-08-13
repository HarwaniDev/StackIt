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
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { bio } = body;

    if (typeof bio !== "string") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
        const user = await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                bio: bio
            }
        });
        return NextResponse.json({message: "Bio updated successfully"}, {status: 201})
    } catch (error) {
        return NextResponse.json({error: "failed to add bio"}, {status: 500 })
    }

}
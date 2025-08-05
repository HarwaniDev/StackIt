import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await db.notification.deleteMany({
            where: {
                userId: session.user.id
            }
        });
        return NextResponse.json({ message: "Notifications deleted successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting notifications" }, { status: 500 });
    }
}
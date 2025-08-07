import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: true,
      comments: true,
      votes: true,
      notifications: true,
      mentionedBy: true,
      mentions: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
};

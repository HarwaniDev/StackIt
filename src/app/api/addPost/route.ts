import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

interface RequestBody {
    title: string;
    description: string;
    tags: string[];
}

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = await req.json() as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, tags } = body;
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !Array.isArray(tags) ||
    !tags.every((t) => typeof t === "string")
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Generate a slug (simple version)
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 8);

  try {
    // Upsert tags: create if not exist, else connect
    const tagRecords = await Promise.all(
      tags.map(async (tagName: string) => {
        return db.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      })
    );

    const post = await db.post.create({
      data: {
        title,
        description,
        slug,
        author: { connect: { id: session.user.id } },
        tags: {
          create: tagRecords.map((tag) => ({ tag: { connect: { id: tag.id } } })),
        },
      },
      include: {
        tags: { include: { tag: true } },
        author: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
};

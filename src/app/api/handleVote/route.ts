import { auth } from "@/server/auth";
import { db } from "@/server/db";
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

    const { userId, answerId, voteType } = body;

    try {
        const vote = await db.vote.findUnique({
            where: {
                userId_answerId: {
                    userId: userId,
                    answerId: answerId
                }
            }
        });

        if (voteType == "1" || voteType == "-1") {
            await db.vote.upsert({
                where: {
                    userId_answerId: {
                        userId: userId,
                        answerId: answerId
                    }
                },
                update: {
                    value: voteType
                },
                create: {
                    userId: userId,
                    answerId: answerId,
                    value: voteType
                }
            })
        } else if (vote && voteType == "0") {
            await db.vote.delete({
                where: {
                    userId_answerId: {
                        userId: userId,
                        answerId: answerId
                    }
                }
            })
        }
        return NextResponse.json({ message: "vote operation successful" }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Failed to add the vote" }, { status: 500 });
    }
}
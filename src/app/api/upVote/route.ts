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

    const { userId, answerId } = body;

    try {
        const vote = await db.vote.findUnique({
            where: {
                userId_answerId: {
                    userId: userId,
                     answerId: answerId
                }
            }
        });
        if(!vote) {
            await db.vote.create({
                data: {
                    userId: userId,
                    answerId: answerId, 
                    value: 1
                }
            })
        } else {
                await db.vote.delete({
                    where: {
                        userId_answerId: {
                            userId: userId,
                            answerId: answerId
                        }
                    }
                })
        }
        
        
    } catch (error) {

    }
}
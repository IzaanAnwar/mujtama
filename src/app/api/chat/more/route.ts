import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const [_url, roomId, lastMsgId] = req.url.split("?");
    console.log("ld", roomId, lastMsgId);

    try {
        const lastMsgIdNum = parseInt(lastMsgId);
        const lastMsg = await prisma.message.findUnique({
            where: { id: lastMsgIdNum },
        });
        console.log("\n\n\nlst=>", lastMsg, "\n\n\n\n");

        if (!lastMsg) {
            return NextResponse.json(
                { message: "Last Message not Found" },
                { status: 404 },
            );
        }

        const resDb = await prisma.message.findMany({
            where: {
                AND: [
                    { chatRoomId: lastMsg.chatRoomId },
                    { timeStamp: { lt: lastMsg.timeStamp } },
                ],
            },
            take: 25,
            orderBy: {
                timeStamp: "desc",
            },
        });
        console.log("more=>", resDb);

        return NextResponse.json({ message: "success", data: resDb });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: "error", error: error.message });
    }
};

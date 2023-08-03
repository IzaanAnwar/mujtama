import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const [_url, userId, roomId] = req.url.split("?");
    console.log("===>", userId, roomId);

    try {
        const resDb = await prisma.message.findMany({
            where: { chatRoomId: roomId },
            include: {
                sender: true,
            },
            take: 50,
            orderBy: {
                timeStamp: "desc",
            },
        });
        console.log(resDb);
        await prisma.task.deleteMany({});
        await prisma.message.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.chatRoom.deleteMany({});

        return new NextResponse(
            JSON.stringify({ message: "success", data: resDb }),
        );
    } catch (error: any) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "error", error: error.message }),
        );
    }
};

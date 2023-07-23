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
            take: 25,
            orderBy: {
                timeStamp: "desc",
            },
        });
        console.log(resDb);

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

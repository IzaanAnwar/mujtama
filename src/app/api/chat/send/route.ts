import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { Message } from "my-types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { chat, roomId }: { chat: Message; roomId: string } =
        await req.json();
    if (!chat) {
        return new NextResponse(JSON.stringify({ message: "Nothing to send" }));
    }
    try {
        pusherServer.trigger(roomId, "group-chat", chat);

        await prisma.message.create({
            data: {
                content: chat.content,
                sender: { connect: { id: chat.senderId } },
                chatRoom: { connect: { id: chat.chatRoomId } },
            },
        });

        return new NextResponse(JSON.stringify({ message: "success" }));
    } catch (error: any) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "error", error: error }),
        );
    }
};

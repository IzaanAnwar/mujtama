import { prisma } from "@/lib/prisma";
import { Message } from "my-types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const messages = (await req.json()) as Message;
    if (!messages) {
        return new NextResponse(
            JSON.stringify({ messages: "Nothing to send" }),
        );
    }
    try {
        const resDb = await prisma.message.create({
            data: {
                content: messages.content,
                sender: { connect: { id: messages.senderId } },
                chatRoom: { connect: { id: messages.chatRoomId } },
            },
        });
        return new NextResponse(
            JSON.stringify({ message: "success", data: resDb }),
        );
    } catch (error: any) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "error", data: error }),
        );
    }
};

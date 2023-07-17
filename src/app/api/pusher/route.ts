import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
    const { message, sender } = await req.json();
    console.log({
        appId: process.env.PUSHER_APP_ID as string,
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
        secret: process.env.PUSHER_APP_SECRET as string,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
        useTLS: true,
    });

    const response = await pusherServer.trigger("chat", "chat-event", {
        message,
        sender,
    });

    return new NextResponse(JSON.stringify({ message: "completed" }));
}

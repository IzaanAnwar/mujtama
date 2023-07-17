import { prisma } from "@/lib/prisma";
import { User } from "my-types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const session = await getServerSession();
    console.log("session at chaht get => ", session);

    if (!session || !session.user) {
        return new NextResponse(JSON.stringify({ messages: "User missing" }));
    }

    try {
        const resDb = await prisma.message.findMany({
            where: {},
        });

        return new NextResponse(
            JSON.stringify({ message: "success", data: resDb }),
        );
    } catch (error: any) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "error", data: error.message }),
        );
    }
};

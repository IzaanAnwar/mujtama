import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const userId = req.url.split("?")[1];

    try {
        const tasks = await prisma.task.findMany({
            where: { userId: userId },
        });
        return new NextResponse(
            JSON.stringify({ message: "success", data: tasks }),
        );
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "success", error: error.message }),
        );
    }
};

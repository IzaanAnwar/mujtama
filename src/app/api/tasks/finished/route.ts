import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { taskStatus, taskId }: { taskStatus: boolean; taskId: number } =
        await req.json();
    console.log("hereitis", taskStatus, taskId);

    try {
        const tasks = await prisma.task.update({
            where: { id: taskId },
            data: { completed: taskStatus },
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

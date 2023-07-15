import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {
        email,
        id: userId,
    }: { email: string | undefined; id: string | undefined } = await req.json();
    console.log("email", email, userId);
    if (!email || !userId) {
        return new NextResponse(
            JSON.stringify({ error: "Please provide valid data." }),
            {
                status: 400,
            },
        );
    }
    try {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email: email,
            },
        });
        console.log(user);
        return new NextResponse(JSON.stringify({ messege: "success", user }), {
            status: 201,
        });
    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: error.messege }), {
            status: 500,
        });
    }
}

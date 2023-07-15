import { RegisterFormValues } from "@/app/register/page";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { BEGINNER_TASKS } from "@/lib/tasks";

export async function POST(req: NextRequest) {
    const body = (await req.json()) as RegisterFormValues;

    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log(body);
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });
        if (user?.email === body.email) {
            return new Response(
                JSON.stringify({ message: "User already exists" }),
                { status: 409 },
            );
        }
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hashedPassword,
                role: "BEGINNER",
                
            },
        });

        if(newUser) {
            BEGINNER_TASKS.map(async task => {
                const createdTasks = await prisma.task.create({
                    data: {
                        ...task,
                        userId:newUser.id
                    }
                })
                if ( !createdTasks) {
                    return new Response(JSON.stringify({ error: "Something went wrong" }), {
                        status: 500,
                    });
                }
            })
            
        }
        console.log(newUser);
        return new Response(
            JSON.stringify({ message: "Succesfully refistered the user", user:newUser }),
            { status: 201 },
        );
    } catch (error: any) {
        console.log(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 404,
        });
    }
}

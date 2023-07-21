import { prisma } from "@/lib/prisma";
import { Role } from "my-types";
import { NextRequest, NextResponse } from "next/server";
import {
    INTERMEDIATE_TASKS,
    ADVANCE_TASKS,
    PRO_TASKS,
    G_TASKS,
    BEGINNER_TASKS,
} from "@/lib/tasks";

const updateUserRole = (currentRole: Role): Role => {
    if (currentRole === "BEGINNER") {
        return "INTERMEDIATE";
    } else if (currentRole === "INTERMEDIATE") {
        return "ADVANCE";
    } else if (currentRole === "ADVANCE") {
        return "PRO";
    } else if (currentRole === "PRO") {
        return "G";
    } else if (currentRole === "G") {
        return "G";
    }
};

function getTask(role: Role) {
    if (role === "INTERMEDIATE") {
        return INTERMEDIATE_TASKS;
    } else if (role === "ADVANCE") {
        return ADVANCE_TASKS;
    } else if (role === "PRO") {
        return PRO_TASKS;
    } else if (role === "G") {
        return G_TASKS;
    } else return BEGINNER_TASKS;
}

export const POST = async (req: NextRequest) => {
    const { userId, userRole }: { userId: string; userRole: Role } =
        await req.json();
    const newRole = updateUserRole(userRole);

    try {
        const chatRoomExists = await prisma.chatRoom.findFirst({
            where: {
                name: newRole,
            },
        });
        let chatRoom: {
            id: string;
            name: Role;
        };
        if (!chatRoomExists) {
            chatRoom = await prisma.chatRoom.create({
                data: {
                    name: newRole,
                },
            });
        } else {
            chatRoom = chatRoomExists;
        }
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role: newRole,
                chatRoomId: chatRoom.id,
            },
        });
        if (!newRole) {
            return NextResponse.json({ message: "failure" }, { status: 400 });
        }
        const newTasks = getTask(newRole);
        console.log("new Taks =>", newTasks);

        for (const task of newTasks) {
            try {
                const createdTasks = await prisma.task.create({
                    data: {
                        ...task,
                        userId: user.id,
                    },
                });
                if (!createdTasks) {
                    return new Response(
                        JSON.stringify({ error: "Something went wrong" }),
                        {
                            status: 500,
                        },
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }

        return NextResponse.json({ message: "success", newRole });
    } catch (error: any) {
        return NextResponse.json(
            { message: "error", error: error.message },
            { status: 404 },
        );
    }
};

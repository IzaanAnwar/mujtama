import { RegisterFormValues } from "@/app/register/page";

import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { BEGINNER_TASKS } from "@/lib/tasks";
import { Role } from "my-types";

/**
 * Handles the POST request for user registration.
 * @param req The Next.js request object.
 * @returns A response indicating the status of the user registration.
 */
export async function POST(req: NextRequest) {
    // Extract the request body as RegisterFormValues
    const body = (await req.json()) as RegisterFormValues;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log(body);
    try {
        // Check if user with the given email already exists
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

        //  Check if chatroom exists or create a new one
        const chatRoomExists = await prisma.chatRoom.findFirst({
            where: {
                name: "BEGINNER",
            },
        });
        let chatRoom: {
            id: string;
            name: Role;
        };
        if (!chatRoomExists) {
            // Create a new chatroom if it doesn't exist
            const newChatRoom = await prisma.chatRoom.create({
                data: {
                    name: "BEGINNER",
                },
            });
            chatRoom = newChatRoom;
        } else {
            // Use the existing chatroom
            chatRoom = chatRoomExists;
        }

        // Create a new user and associate with the chatroom
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hashedPassword,
                role: "BEGINNER",
                chatRoomId: chatRoom.id,
            },
        });

        // Create BEGINNER tasks for the new user
        BEGINNER_TASKS.map(async (task) => {
            const createdTasks = await prisma.task.create({
                data: {
                    ...task,
                    userId: newUser.id,
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
        });
        console.log("new room and user => ", newUser);

        // Return a response with success message and user details
        return new Response(
            JSON.stringify({
                message: "Succesfully refistered the user and linked the room",
                user: newUser,
            }),
            { status: 201 },
        );
    } catch (error: any) {
        console.log(error);

        // Return an error response with the error message
        return new Response(JSON.stringify({ error: error.message }), {
            status: 404,
        });
    }
}

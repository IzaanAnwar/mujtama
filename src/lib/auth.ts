import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { User } from "my-types";

/**
 * @author Izaan
 * @type NextAuthOptions
 */

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "jsmith@email.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email,
                    },
                });
                const userPass = credentials?.password as string;

                // Return null if user data could not be retrieved
                if (
                    !user ||
                    !(await bcrypt.compare(userPass, user?.password))
                ) {
                    return null;
                }

                // If no error and we have user data, return it
                return user;
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            console.log("session callback", { session, token });
            const dbUser = await prisma.user.findFirst({
                where: {
                    id: token.id as string,
                },
            });
            if (!dbUser) {
                // Return old session if user data could not be retrieved
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id,
                        role: token.role,
                        chatRoomId: token.chatRoomId,
                    },
                };
            }
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: dbUser.role,
                    image: dbUser.image,
                    chatRoomId: dbUser.chatRoomId,
                } as User,
            };
        },
        jwt: ({ token, user }) => {
            // console.log("jwt calback", { token, user });

            if (user) {
                const u = user as User;
                return {
                    ...token,
                    id: u.id,
                    role: u.role,
                    chatRoomId: u.chatRoomId,
                };
            }

            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
};

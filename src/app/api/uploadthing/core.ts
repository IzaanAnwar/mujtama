import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "my-types";
import { getServerSession } from "next-auth";

import { type FileRouter, createUploadthing } from "uploadthing/next";
import { utapi } from "uploadthing/server";

const fs = createUploadthing();

export const ourFileRouter = {
    profilePicture: fs(["image"])
        .middleware(async ({ req }) => {
            console.log(req.body, req.credentials, req.url);
            const session = await getServerSession(authOptions);
            if (!session) {
                throw new Error("Please log in");
            }
            const user = session.user as User;
            console.log("\n\nUser:", user, "\n\n");
            return {
                userId: user.id,
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(
                "\n\nUpload complete for userId:",
                metadata.userId,
                "\n\n",
            );

            console.log("file url", file.url);
            const userId = metadata.userId;
            const profileURL = file.url;
            try {
                const dbUser = await prisma.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                if (dbUser && dbUser.image) {
                    const fileKeyArr = file.url.split("/");
                    const fileKey = fileKeyArr[fileKeyArr.length - 1];

                    const utDelRes = await utapi.deleteFiles(fileKey);
                    if (utDelRes) {
                        console.log(
                            "\n\nSuccessfuly removed previous profile image\n\n",
                        );
                    } else {
                        throw new Error("Unable to delete the previous image");
                    }
                }
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        image: profileURL,
                    },
                });
            } catch (error) {
                console.log(error);
                throw new Error("upload to database failed");
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

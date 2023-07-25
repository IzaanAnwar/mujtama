"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "../../components/Loading";
import { User } from "my-types";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

const Profile = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userImage, setUserImage] = useState<string>(
        session?.user?.image ?? "",
    );
    const [userName, setUserName] = useState<string>(
        session?.user?.name as string,
    );
    console.log(userName, "img", userImage, "ses", session);

    const [isDisabled, setInputStatus] = useState<boolean>(true);
    useEffect(() => {
        if (session?.user?.image) {
            setUserImage(session?.user?.image);
        }
    }, [session]);

    if (status === "loading") {
        return <Loading />;
    }

    if (!session) {
        router.push("/login");
        return null;
    }
    const user = session.user as User;

    const handleUserNameChange = async (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    ) => {
        setInputStatus(true);
        console.log(isDisabled, "making req");

        const res = await fetch("/api/user/name", {
            method: "POST",
            body: JSON.stringify({
                name: userName,
                id: user.id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(res);
        if (res.status !== 200) {
            const data = await res.json();
            console.log(data);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:border-2 bg-zinc-900 sm:border-zinc-800 py-4 sm:p-4 sm:mx-2 md:mx-32 mx-4 sm:space-x-8 rounded-md">
                <div className="w-32 h-32 rounded-full overflow-hidden md:mx-16 mx-4">
                    {userImage ? (
                        <Image
                            src={userImage as string}
                            alt="Profile Image"
                            width={128}
                            height={128}
                            className="w-full h-full"
                        />
                    ) : (
                        <Image
                            src="/user-profile.png"
                            alt="Profile Image"
                            width={128}
                            height={128}
                            className="w-full h-full"
                        />
                    )}
                </div>
                <div className="sm:py-8 py-2">
                    <div className=" flex md:justify-start justify-center items-center w-full sm:w-auto">
                        <input
                            value={
                                userName !== undefined ? userName : user.name
                            }
                            className="text-3xl font-bold sm:w-full w-[50%] bg-zinc-900 border-none"
                            disabled={isDisabled}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                event.preventDefault();
                                setUserName(event.target.value);
                            }}
                        />

                        <span className="px-2">
                            {!isDisabled ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 border-gray-400 rounded-md text-gray-400 hover:border-gray-600 hover:text-gray-600"
                                    onClick={async (e) =>
                                        await handleUserNameChange(e)
                                    }
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 border-2 border-gray-400 rounded-md text-gray-400 hover:border-gray-600 hover:text-gray-600"
                                    onClick={() => {
                                        if (isDisabled) {
                                            setInputStatus(false);
                                        }
                                    }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                    />
                                </svg>
                            )}
                        </span>
                    </div>
                    <p className="md:text-start text-center text-gray-600">
                        {user?.email}
                    </p>
                    <div className="mt-4 flex justify-center md:justify-start items-center md:items-start">
                        <UploadButton
                            endpoint="profilePicture"
                            onClientUploadComplete={(res) => {
                                // Do something with the response
                                console.log("Files: ", res);
                                if (res && res[0]) {
                                    setUserImage(res[0].fileUrl);
                                }
                                alert("Upload Completed");
                            }}
                            onUploadError={(error: Error) => {
                                // Do something with the error.
                                alert(
                                    `ERROR! ${error.message} | or try another image`,
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-4">
                <div className="mt-4">
                    <span className="flex">
                        Current Room: &nbsp;
                        <p className="font-bold text-primary">{user?.role}</p>
                    </span>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="mt-4 block">
                    <Link href="/profile/settings" className="text-blue-500">
                        Go to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;

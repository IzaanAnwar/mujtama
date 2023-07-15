"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "../../components/Loading";

export interface IUser {
    name: string;
    email: string;
    id: string;
    role: string;
}

const Profile = () => {
    const { data: session, status } = useSession();
    const [userImage, setUserImage] = useState<string>("");
    const [userName, setUserName] = useState<string>(
        session?.user?.name as string,
    );
    console.log(userName);

    const [isDisabled, setInputStatus] = useState<boolean>(true);

    if (status === "loading") {
        return <Loading />;
    }

    if (!session) {
        return <div>Please sign in to view your profile.</div>;
    }
    const user = session.user as IUser;

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            setUserImage(event.target?.result as string);
        };

        reader.onloadend = () => {
            reader.abort();
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setUserImage("");
        }
    };
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
            <div className="flex flex-col sm:flex-row items-center justify-center sm:border-2 bg-zinc-900 sm:border-zinc-800 sm:rounded-md sm:p-4 sm:mx-2 md:mx-32 mx-4 sm:space-x-8">
                <div className="w-24 h-24 rounded-full overflow-hidden sm:mx-16 mx-4">
                    {userImage ? (
                        <Image
                            src={userImage as string}
                            alt="Profile Image"
                            width={128}
                            height={128}
                        />
                    ) : (
                        <Image
                            src="/images/photo.jpg"
                            alt="Profile Image"
                            width={96}
                            height={96}
                        />
                    )}
                </div>
                <div className="sm:py-8 py-2">
                    <div className=" flex justify-start items-center w-full sm:w-auto">
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
                    <p className="text-gray-600">{user?.email}</p>
                    <div className="mt-4">
                        <label className="btn btn-sm btn-primary">
                            Change Profile Image
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-4">
                {/* <div className="mt-4">
                        <p>Completed Tasks: {userData.completedTasks}</p>
                        <p>Ongoing Tasks: {userData.ongoingTasks}</p>
                        <p>Current Room: {user?.role}</p>
                        <p>
                            Tasks to Promote:{" "}
                            {userData.tasksToPromote - userData.completedTasks}
                            more tasks needed
                        </p>
                    </div> */}
                <div className="mt-4">
                    <Link href="/profile/settings" className="text-blue-500">
                        Go to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;

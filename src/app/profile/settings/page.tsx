"use client";

import { useSession } from "next-auth/react";
import Loading from "../../../components/Loading";
import { useState } from "react";
import { User } from "my-types";

const SettingsPage = () => {
    const { data: session, status } = useSession();
    const [userPassword, setPassword] = useState<string>("");
    const [userEmail, setEmail] = useState<string>(
        session?.user?.name as string,
    );

    const [isDisabled, setInputStatus] = useState<boolean>(true);

    if (status === "loading") {
        return <Loading />;
    }

    if (!session) {
        return <div>Please sign in to view your profile.</div>;
    }
    const user = session.user as User;

    const handleEmailChange = async (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    ) => {
        setInputStatus(true);
        console.log(isDisabled, "making req");

        const res = await fetch("/api/user/email", {
            method: "POST",
            body: JSON.stringify({
                name: userEmail,
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
        <div className="min-h-screen bg-[#181313]">
            <div className="py-8 bg-[#251d1d]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold">Settings</h1>
                </div>
            </div>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className=" shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            General Settings
                        </h2>
                        <p className="mt-1 text-sm ">
                            Customize your account preferences.
                        </p>
                    </div>
                    <div className="border-t ">
                        <dl>
                            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium ">email</dt>
                                <dd className="mt-1 text-sm  sm:mt-0 sm:col-span-2">
                                    <div className=" flex justify-start items-center">
                                        {/* yaha se */}
                                        <input
                                            value={
                                                userEmail !== undefined
                                                    ? userEmail
                                                    : user.name
                                            }
                                            className="text-3xl font-bold w-[50%] bg-base-100 border-none"
                                            disabled={isDisabled}
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                event.preventDefault();
                                                setEmail(event.target.value);
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
                                                        await handleEmailChange(
                                                            e,
                                                        )
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
                                                            setInputStatus(
                                                                false,
                                                            );
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
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Password
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    *********************
                                </dd>
                            </div>
                            {/* Additional settings can be added here */}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

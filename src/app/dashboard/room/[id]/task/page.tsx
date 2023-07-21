"use client";

import { Tasks, User } from "my-types";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

function CheckForPromotion(allTasks: Tasks[]): boolean {
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].completed === false) {
            return false;
        }
    }
    return true;
}
export default function Task() {
    const { data: session, status, update: updateSession } = useSession();
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [completed, setCompleted] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (session) {
            const user = session.user as User;

            const getAllTasks = async () => {
                const res = await fetch(`/api/tasks?${user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    return <div>went wrogn</div>;
                }
                const data = await res.json();
                console.log("data taks =>", data.data);
                const allTaskCompeleted = CheckForPromotion(data.data);

                if (allTaskCompeleted) {
                    const res = await fetch("/api/promote-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            userRole: user.role,
                        }),
                    });
                    if (!res.ok) {
                        router.refresh();
                    }
                }
                console.log("sesions ==>", session);

                setTasks(data.data);
            };
            getAllTasks();
        }
    }, [session, completed, router, updateSession]);

    if (status === "loading") {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <Loading />
            </div>
        );
    }
    if (!session) {
        router.push("/");
    }

    return (
        <div className="container mx-auto py-10 px-0 md:px-10 ">
            <div className="py-4 px-0 md:px-4  rounded shadow 00 ">
                <h2 className="text-center md:text-left text-xl md:text-2xl font-semibold mb-4">
                    Task Panel
                </h2>
                <div className="overflow-x-auto">
                    <table className="table w-full mt-4 ">
                        <thead>
                            <tr>
                                <th className="text-lg md:text-xl px-4 py-2 font-bold text-left">
                                    Task
                                </th>
                                <th className="text-lg md:text-xl  px-4 py-2 font-bold text-left">
                                    Progress
                                </th>
                                <th className="text-lg md:text-xl  px-4 py-2 font-bold text-left">
                                    Done
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks ? (
                                tasks.map((task, idx) => (
                                    <tr
                                        key={idx}
                                        className="text-xs md:text-sm font-semibold border-t duration-100 hover:bg-primary hover:text-gray-300 "
                                    >
                                        <td className="px-4 py-2">
                                            {task.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.amount}
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.completed ? "Yes" : "No"}{" "}
                                            <button
                                                className="px-2 rounded-full hover:text-base-100"
                                                onClick={async (e) => {
                                                    e.preventDefault();

                                                    const isTaskCompeleted =
                                                        !task.completed &&
                                                        window.confirm(
                                                            "Did you complete this task?",
                                                        );

                                                    if (isTaskCompeleted) {
                                                        const res = await fetch(
                                                            "/api/tasks/finished",
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        taskStatus:
                                                                            isTaskCompeleted,
                                                                        taskId: task.id,
                                                                    },
                                                                ),
                                                            },
                                                        );

                                                        console.log(res);

                                                        if (!res.ok) {
                                                            alert(
                                                                "something wend wrong... Please try again",
                                                            );
                                                        } else {
                                                            alert(
                                                                "Congratulations",
                                                            );
                                                            setCompleted(
                                                                !completed,
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                ✔
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <Loading />
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="m-2 bg-white rounded-md"></div>
        </div>
    );
}

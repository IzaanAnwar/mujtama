"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();
    return (
        <nav className="px-2 md:px-16">
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <Link
                        href="/"
                        className="btn btn-ghost  normal-case text-xl hover:text-primary duration-300"
                    >
                        Mujtama
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    {/* search bar and notification for later */}
                    {/* <div className="form-control">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-24 md:w-auto"
                        />
                    </div> */}
                    {/* <button className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </button> */}
                    <div className="dropdown dropdown-bottom dropdown-end">
                        <label
                            tabIndex={0}
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <Image
                                    src={
                                        session?.user?.image
                                            ? session.user.image
                                            : "/user-profile.png"
                                    }
                                    alt="profile"
                                    width={40}
                                    height={40}
                                />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <Link
                                    className="justify-between"
                                    href="/profile"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="justify-between"
                                    href="/dashboard/room/BEGINNER/task"
                                >
                                    My task
                                </Link>
                            </li>
                            <li>
                                <Link href="profile/settings">Settings</Link>
                            </li>
                            <li>
                                <Link
                                    href={session?.user ? "/" : "/login"}
                                    onClick={async (
                                        e: React.FormEvent<HTMLAnchorElement>,
                                    ) => {
                                        e.preventDefault;
                                        if (session?.user) {
                                            await signOut();
                                        }
                                    }}
                                >
                                    {session?.user ? "Logout" : "Login"}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

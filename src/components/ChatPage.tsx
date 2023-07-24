"use client";
import { Message, User } from "my-types";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import { pusherClient } from "@/lib/pusher";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const ChatPage = ({ user }: { user: User }) => {
    const [message, setMessage] = useState("");
    const [allMsg, setAllMsg] = useState<Message[]>([]);

    const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const pathName = usePathname();
    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const handleFormSubmit = async (
        event: React.MouseEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setMessage("");

        if (message.trim() === "") return;
        const response = await fetch("/api/chat/send/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat: {
                    content: message,
                    senderId: user.id,
                    chatRoomId: user.chatRoomId,
                    sender: user,
                    timeStamp: new Date().toISOString(),
                },
                roomId: user.chatRoomId,
            }),
        });
        if (!response.ok) {
            alert("something went wrong");
        }
        scrollToBottom();
    };

    useEffect(() => {
        const channel = pusherClient.subscribe(user.chatRoomId);
        channel.bind("group-chat", (chat: Message) => {
            setAllMsg((prev: Message[] | null) =>
                prev ? [...prev, chat] : [chat],
            );
        });

        const getAllMessages = async () => {
            const res = await fetch(
                `/api/chat/get?${user.id}?${user.chatRoomId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const resData = await res.json();
            const allChats: Message[] = resData.data;
            setAllMsg(allChats.slice().reverse());

            setLoadingComplete(true);
        };

        getAllMessages();

        return () => {
            pusherClient.unsubscribe(user.chatRoomId);
        };
    }, [user.chatRoomId, user.id]);
    useEffect(() => {
        if (loadingComplete) {
            scrollToBottom();
        }
    }, [loadingComplete]);

    useEffect(() => {
        const fetchMoreChats = async () => {
            const lastMsg = allMsg[0];

            try {
                const res = await fetch(
                    `/api/chat/more?${user.chatRoomId}?${lastMsg.id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                const { data: newChats }: { data: Message[] } =
                    await res.json();

                const revChats = newChats.slice().reverse();

                setAllMsg((prevChats) => [...revChats, ...prevChats]);
            } catch (error: any) {
                console.log(error);
                alert("Something went wrong please reload the page");
                router.replace(pathName);
            }
        };
        const handleScrollToTop = async () => {
            if (chatContainerRef.current) {
                const viewIsNearTop = chatContainerRef.current.scrollTop === 0;
                console.log(viewIsNearTop);

                if (viewIsNearTop) {
                    await fetchMoreChats();
                }
            }
        };

        const chatContainer = chatContainerRef.current;
        chatContainer?.addEventListener("scroll", handleScrollToTop);
        return () => {
            chatContainer?.removeEventListener("scroll", handleScrollToTop);
        };
    }, [allMsg, pathName, router, user.chatRoomId]);

    return (
        <div className="flex flex-col h-[85vh] bg-zinc-900  rounded-lg">
            <div
                className="flex-grow p-4 overflow-y-auto "
                ref={chatContainerRef}
            >
                {allMsg ? (
                    allMsg?.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat ${
                                msg.senderId === user.id
                                    ? "chat-end"
                                    : "chat-start"
                            }`}
                        >
                            <div className="chat-image avatar">
                                <div className="w-10  rounded-full">
                                    <Image
                                        src={
                                            msg.sender?.image ??
                                            "/user-profile.png"
                                        }
                                        alt="profile"
                                        width={40}
                                        height={40}
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                {msg.sender?.name
                                    ? msg.sender?.name
                                    : "Loading ..."}
                                <time className="px-2 text-xs opacity-50">
                                    {new Date(msg.timeStamp)
                                        .toTimeString()
                                        .substring(0, 5)}
                                </time>
                            </div>
                            <div className="chat-bubble">{msg.content}</div>
                        </div>
                    ))
                ) : (
                    <div className="h-screen flex justify-center items-center">
                        <Loading />
                    </div>
                )}
            </div>
            <div className="flex-shrink-0">
                <form
                    className="flex items-center justify-between p-4"
                    onSubmit={handleFormSubmit}
                >
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        className="flex-grow px-4 py-2 rounded-full bg-zinc-700 text-gray-100 focus:outline-none"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="ml-4 px-4 py-2 rounded-full bg-blue-500 text-white"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;

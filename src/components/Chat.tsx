"use client";
import { Message, User } from "my-types";
import React, { useEffect, useRef, useState } from "react";

const ChatPage = ({ user }: { user: User }) => {
    const [message, setMessage] = useState("");

    const [allMsg, setAllMsg] = useState<Message[]>();

    const chatContainerRef = useRef(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleFormSubmit = async (
        event: React.MouseEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (message.trim() === "") return;
        const response = await fetch("/api/chat/send/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: message,
                senderId: user.id,
                chatRoomId: user.chatRoomId,
            }),
        });
        console.log(await response.json());

        // Scroll to the bottom of the chat container
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const getAllChat = async () => {
            const data = await fetch("/api/chat/receive/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const recData = await data.json();
            const recMessages = recData.data;
            setAllMsg(recMessages);
        };
        // Scroll to the bottom of the chat container when a new message is added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
        getAllChat();
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <div
                className="flex-grow p-4 overflow-y-auto"
                ref={chatContainerRef}
            >
                {allMsg?.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.senderId !== user.id
                                ? "justify-start text-black"
                                : "justify-end"
                        }`}
                    >
                        <div
                            className={`bg-gray-100 p-2 rounded-lg mb-2 ${
                                msg.senderId !== user.id
                                    ? "mr-auto bg-gray-200 text-black"
                                    : "ml-auto bg-blue-700 text-black"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <form
                className="flex items-center justify-between p-4 bg-gray-200"
                onSubmit={handleFormSubmit}
            >
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    className="flex-grow px-4 py-2 rounded-full bg-white focus:outline-none"
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
    );
};

export default ChatPage;

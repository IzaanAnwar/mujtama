import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ChatPage from "@/components/Chat";
import { redirect } from "next/navigation";
import { User } from "my-types";

interface IRoom {
    roomID: {
        userID: string;
        message: string;
    };
}

export default async function Room() {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log("session => ", session);
        redirect("/");
    }
    console.log("session => ", session);
    const user = session.user as User;
    return (
        <div className="container mx-auto py-10 px-10 ">
            <h1 className="text-4xl font-bold mb-6">
                Welcome to the Private Community
            </h1>

            <div className="p-4 bg-gray-100  rounded shadow text-gray-800">
                <h2 className="text-2xl font-semibold mb-4">Task Panel</h2>
                <p>Display tasks and progress here.</p>
            </div>
            <div className="m-2 bg-white rounded-md">
                <ChatPage user={user} />
            </div>
        </div>
    );
}

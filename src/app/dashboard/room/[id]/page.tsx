import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ChatPage from "@/components/ChatPage";
import { redirect } from "next/navigation";
import { User } from "my-types";

export default async function Room() {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log("session => ", session);
        redirect("/");
    }

    console.log("session => ", session);
    const user = session.user as User;
    if (user.role)
        return (
            <div className="container mx-auto lg:px-32 md:px-16 px-2 ">
                <ChatPage user={user} />
            </div>
        );
}

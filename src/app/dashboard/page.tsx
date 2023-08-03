import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, User } from "my-types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const showRooms = (role: Role): Role => {
    const userRoles = ["BEGINNER", "INTERMEDIATE", "ADVANCE", "PRO", "G"];
};

const Home = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
        return null;
    }
    const user = session.user as User;
    // const dbUser = await prisma.user.findFirst({
    //     where: {
    //         id: user.id,
    //     },
    // });
    // console.log("dbUser => ", dbUser, "\n session =>", session);
    // if (!dbUser) {
    //     return <div>Something went wrong...</div>;
    // }

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-xl md:text-4xl font-bold mb-6">
                Welcome to the Private Community
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-gray-800 min-h-[50vh]">
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h2 className="text-lg md:text-2xl font-semibold mb-4">
                        Chat Room
                    </h2>
                    <ul className="list-disc pl-6 text-primary hover:text-zinc-900  duration-200">
                        <li>
                            <a href={`/dashboard/room/${user.role}`}>
                                {user.role}
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="p-4 bg-gray-100  rounded shadow text-gray-800">
                    <h2 className="text-lg md:text-2xl font-semibold mb-4">
                        Current Affairs Panel
                    </h2>
                    <p>Display current affairs information here.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;

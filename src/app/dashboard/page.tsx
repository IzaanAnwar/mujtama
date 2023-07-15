const Home = async () => {
    return (
        <div className="container mx-auto p-10">
            <h1 className="text-4xl font-bold mb-6">
                Welcome to the Private Community
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-gray-800">
                <div className="p-4 bg-gray-100 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
                    <ul className="list-disc pl-6">
                        <li>
                            <a href="/dashboard/room/BEGINNER">BEGINNER</a>
                        </li>
                        <li>
                            <a href="/dashboard/room/INTERMEDIATE">
                                INTERMEDIATE
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard/room/ADVANCE">ADVANCE</a>
                        </li>
                        <li>
                            <a href="/dashboard/room/PRO">PRO</a>
                        </li>
                        <li>
                            <a href="/dashboard/room/G">G</a>
                        </li>
                    </ul>
                </div>

                <div className="p-4 bg-gray-100  rounded shadow text-gray-800">
                    <h2 className="text-2xl font-semibold mb-4">
                        Current Affairs Panel
                    </h2>
                    <p>Display current affairs information here.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;

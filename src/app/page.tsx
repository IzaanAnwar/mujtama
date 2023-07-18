import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const LandingPage = async () => {
    const session = await getServerSession(authOptions);
    console.log("nud");

    if (session) {
        console.log("entered");

        redirect("/dashboard");
    }
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section
                className="bg-business-hero-pattern bg-cover bg-center 
          text-white py-16 min-h-screen"
            >
                <div className="flex flex-col sm:flex-row justify-between items-center container px-4 sm:px-8 md:px-16 lg:px-24">
                    <div className="sm:min-h-[342px] grid place-items-start px-8 max-w-full">
                        <h1 className="lg:text-4xl text-2xl font-bold mb-4">
                            Welcome to Mujtama
                        </h1>
                        <div className="lg:text-lg text-md mb-8 text-gray-400 sm:max-w-[90%]">
                            <p>
                                A community where people meet and work together
                                to become better individuals. Inside The
                                Mujtama, you will access knowledge that will
                                spark your genius and compel you to work your
                                hardest to keep up.
                            </p>
                        </div>
                        <Link href="/register" className="btn btn-neutral">
                            Get Started
                        </Link>
                    </div>
                    <div className="mt-8 sm:mt-0">
                        <Image
                            className=""
                            src="/images/bg-art.png"
                            alt="Community"
                            width={256}
                            height={342}
                        />
                    </div>
                </div>
            </section>

            {/* Other Sections */}
            <section className="py-16 bg-green-950 md:h-screen flex justify-center items-center">
                <div className="container px-4 sm:px-8 md:px-16 lg:px-24">
                    {/* Section 1 */}
                    <div className="mb-8">
                        <h2 className="lg:text-3xl text-2xl font-bold mb-4">
                            Section 1
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla luctus tristique justo, a tempus sem
                            tincidunt ut. Nunc non facilisis leo.
                        </p>
                    </div>
                    {/* Section 2 */}
                    <div className="mb-8">
                        <h2 className="lg:text-3xl text-2xl font-bold mb-4">
                            Section 2
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla luctus tristique justo, a tempus sem
                            tincidunt ut. Nunc non facilisis leo.
                        </p>
                    </div>
                    {/* Section 3 */}
                    <div>
                        <h2 className="lg:text-3xl text-2xl font-bold mb-4">
                            Section 3
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla luctus tristique justo, a tempus sem
                            tincidunt ut. Nunc non facilisis leo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="text-white py-8">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row justify-center items-center">
                        <div className="mr-4 mb-4 sm:mb-0">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/images/profile.png"
                                    alt="Mujtama Logo"
                                    width={32}
                                    height={32}
                                />
                                <span className="ml-2 lg:text-xl text-md font-bold">
                                    Mujtama
                                </span>
                            </Link>
                        </div>
                        <div>
                            <p className="text-center sm:text-left">
                                © 2023 Mujtama. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

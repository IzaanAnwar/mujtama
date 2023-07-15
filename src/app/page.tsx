import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="min-h-screen  ">
            {/* Hero Section */}
            <section
                className="bg-business-hero-pattern bg-cover bg-center 
                text-white py-16 min-h-screen"
            >
                <div className="flex justify-between items-center container px-8 sm:px-64">
                    <div className="min-h-[342px] grid place-items-start px-8 max-w-lg">
                        <h1 className=" text-4xl font-bold mb-4">
                            Welcome to Mujtama
                        </h1>
                        <div className="text-lg mb-8 text-gray-400 sm:max-w-[90%]">
                            <p>
                                A community where people meet and work together
                                to become better individuals. Inside The Mujtama
                                you will access knowledge that will spark your
                                genius and compel you to work your hardest to
                                keep up.
                            </p>
                        </div>
                        <Link href="/register" className="btn btn-neutral ">
                            Get Started
                        </Link>
                    </div>
                    <div>
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
            <section className="py-16 bg-green-950 h-screen flex justify-center items-center">
                <div className="container px-32">
                    {/* Section 1 */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">Section 1</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla luctus tristique justo, a tempus sem
                            tincidunt ut. Nunc non facilisis leo.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">Section 2</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla luctus tristique justo, a tempus sem
                            tincidunt ut. Nunc non facilisis leo.
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Section 3</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nulla luctus tristique justo, a tempus sem
                            tincidunt ut. Nunc non facilisis leo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className=" text-white py-8">
                <div className="container mx-auto">
                    <div className="flex justify-center items-center">
                        <div className="mr-4">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/images/profile.png"
                                    alt="Mujtama Logo"
                                    width={32}
                                    height={32}
                                />
                                <span className="ml-2 text-xl font-bold">
                                    Mujtama
                                </span>
                            </Link>
                        </div>
                        <div>
                            <p className="text-center">
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

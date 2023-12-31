import Navbar from "../components/Navbar";
import { NextAuthProvider } from "@/components/Provider";
import "./globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Mujtama",
    description: "Community",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="forest">
            <link rel="icon" href="/images/Mujtama-logo.png" sizes="any" />

            <body className={inter.className}>
                <NextAuthProvider>
                    <Navbar />
                    {children}
                </NextAuthProvider>
            </body>
        </html>
    );
}

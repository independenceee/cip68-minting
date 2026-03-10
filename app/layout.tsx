import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import Provider from "@/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Multisig Treasury – Secure DAO Treasury on Cardano",
    description:
        "Decentralized multisig treasury management on Cardano blockchain. Secure, transparent governance for DAOs, teams, and communities using native scripts and Plutus.",
    keywords: ["Cardano", "Multisig", "Treasury", "DAO", "Governance", "Blockchain", "Web3"],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Provider session={session}>
                    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                        <Header />
                        <aside>{children}</aside>
                        <Footer />
                    </main>
                </Provider>
            </body>
        </html>
    );
}

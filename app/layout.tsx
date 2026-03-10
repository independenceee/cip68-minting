import "./globals.css";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import Provider from "@/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "CIP-68 Metadata Manager – Dynamic NFT & Token Metadata on Cardano",
    description:
        "A decentralized application for managing dynamic NFT and token metadata using the CIP-68 standard on the Cardano blockchain. Enables reference NFTs, updatable metadata, and secure on-chain data management.",
    keywords: ["Cardano", "CIP-68", "NFT Metadata", "Reference NFT", "Token Metadata", "Blockchain", "Web3"],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="en">
            <body>
                <Provider session={session}>
                    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 font-sans">
                        <Header />
                        <aside>{children}</aside>
                        <Footer />
                    </main>
                </Provider>
            </body>
        </html>
    );
}

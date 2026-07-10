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
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-transparent">
                <Provider session={session}>
                    <main className="relative isolate overflow-x-hidden">
                        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_30%)]" />
                        <Header />
                        <div className="relative flex min-h-screen flex-col pt-24">{children}</div>
                        <Footer />
                    </main>
                </Provider>
            </body>
        </html>
    );
}

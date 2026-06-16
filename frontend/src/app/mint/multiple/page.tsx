"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
    const { status: sessionStatus } = useSession();

    if (sessionStatus === "unauthenticated") {
        redirect("/login");
    }
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 min-h-[80vh]">
            <div className="text-center space-y-8 max-w-lg">
                <h1 className="text-5xl md:text-6xl font-bold">Multi Mint</h1>

                <p className="text-xl text-slate-300">
                    Multi Mint is an upcoming feature designed to streamline the process of creating and minting multiple NFTs in a single
                    transaction.
                </p>

                <p className="text-base text-blue-300/80 italic">This feature is especially useful.</p>
            </div>
        </div>
    );
}

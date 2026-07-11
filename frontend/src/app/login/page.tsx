"use client";

import Link from "next/link";
import Image from "next/image";
import { images } from "@/public/images";
import { routers } from "@/constants/routers";
import { useSession } from "next-auth/react";
import { wallets } from "@/constants/wallets";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Network from "@/components/network";
import Wallet from "@/components/wallet";
import { WalletType } from "@/types";
import { networks } from "@/constants/networks";
import { APP_NETWORK } from "@/constants/enviroments";
export const dynamic = "force-dynamic";

export default function SignIn() {
    const [network, setNetwork] = useState<string>(APP_NETWORK);

    useEffect(() => {
        const networkConnection = localStorage.getItem("network");
        if (networkConnection) {
            setNetwork(JSON.parse(networkConnection));
        }
    }, []);

    useEffect(() => {
        if (network) {
            localStorage.setItem("network", JSON.stringify(network));
        }
    }, [network]);

    const router = useRouter();

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            redirect("/");
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-transparent">
            <div className="mx-auto flex h-full w-full flex-col">
                <header className="z-10 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-2 lg:px-8">
                        <section className="flex items-center">
                            <Link href={routers.home} className="flex items-center gap-3">
                                <Image className="h-10 w-auto" loading="lazy" src={images.logo} alt="CIP68" />
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">CIP68</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Connect wallet</p>
                                </div>
                            </Link>
                        </section>
                        <ul className="flex items-center justify-center gap-4">
                            <Link href="https://traceability.trustorstudio.com/" target="_blank">
                                <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 34, height: 34 }} network="telegram" />
                            </Link>
                            <Link href="https://traceability.trustorstudio.com/" target="_blank">
                                <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 34, height: 34 }} network="discord" />
                            </Link>
                            <Link href="https://traceability.trustorstudio.com/" target="_blank">
                                <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 34, height: 34 }} network="github" />
                            </Link>
                            <Link href="https://traceability.trustorstudio.com/" target="_blank">
                                <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 34, height: 34 }} network="x" />
                            </Link>
                        </ul>
                    </div>
                </header>

                <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
                    <section className="w-full max-w-5xl rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:p-10">
                        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Connect Wallet</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Choose a network and wallet to continue.</p>
                            </div>
                            <div className="rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {network.charAt(0).toUpperCase() + network.slice(1).toLowerCase()}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 lg:flex-row">
                            <section className="flex flex-wrap gap-3 lg:w-56 lg:flex-col lg:gap-3">
                                {networks.map(({ image, name }, index: number) => (
                                    <Network
                                        image={image}
                                        name={name}
                                        key={index}
                                        isActive={name.toLowerCase() === network.toLowerCase()}
                                        setNetwork={setNetwork}
                                    />
                                ))}
                            </section>
                            <section className="flex-1 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
                                    {wallets.map((wallet: WalletType, index: number) => (
                                        <Wallet key={index} wallet={wallet} session={session} />
                                    ))}
                                </div>
                            </section>
                        </div>
                    </section>

                    <section className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Web2 login powered by Particle Network</p>
                        <div className="mt-4 flex items-center justify-center gap-6">
                            <Link href="https://traceability.trustorstudio.com/" target="_blank">
                                <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 34, height: 34 }} network="x" />
                            </Link>
                            <Link href="https://traceability.trustorstudio.com/" target="_blank">
                                <SocialIcon href="https://traceability.trustorstudio.com/" style={{ width: 34, height: 34 }} network="github" />
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="pb-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    <Link
                        className="font-medium text-slate-700 underline-offset-4 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        href="https://traceability.trustorstudio.com/"
                        target="_blank"
                    >
                        Help Center
                    </Link>
                    <p className="mt-3">CIP68 Network Foundation • Cardano2vn</p>
                </footer>
            </div>
        </div>
    );
}

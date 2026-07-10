"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/public/images";
import { ThemeToggle } from "./ui/theme-toggle";
import { usePathname } from "next/navigation";
import { routers } from "@/constants/routers";

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith(routers.documentation) || pathname.startsWith(routers.login)) {
        return null;
    }

    return (
        <footer className="relative z-30 border-t border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            <Image src={images.logo} alt="CIP68" width={24} height={24} />
                            CIP-68 Metadata Studio
                        </div>
                        <h3 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">Craft metadata with clarity and confidence.</h3>
                        <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                            Create, manage, and evolve NFT metadata on Cardano with the CIP-68 standard using a modern workspace designed for builders
                            and creators.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Explore</h4>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <li>
                                <Link href={routers.dashboard} className="transition hover:text-slate-900 dark:hover:text-white">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href={routers.mint} className="transition hover:text-slate-900 dark:hover:text-white">
                                    Mint Asset
                                </Link>
                            </li>
                            <li>
                                <Link href={routers.documentation} className="transition hover:text-slate-900 dark:hover:text-white">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resources</h4>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <li>
                                <Link href="https://cardano.org" target="_blank" className="transition hover:text-slate-900 dark:hover:text-white">
                                    Cardano
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://developers.cardano.org"
                                    target="_blank"
                                    className="transition hover:text-slate-900 dark:hover:text-white"
                                >
                                    Developer Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="https://github.com" target="_blank" className="transition hover:text-slate-900 dark:hover:text-white">
                                    GitHub
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} CIP68. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <span className="hidden h-1 w-1 rounded-full bg-slate-400 md:block" />
                        <span>Built for modern Cardano workflows</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/public/images";
import { ThemeToggle } from "./ui/theme-toggle";
import { usePathname } from "next/navigation";
import { routers } from "@/constants/routers";

export default function Footer() {
    const pathname = usePathname();

    // Ẩn footer ở trang docs và login (giữ nguyên logic)
    if (pathname.startsWith(routers.documentation) || pathname.startsWith(routers.login)) {
        return null;
    }

    return (
        <div className="relative z-30 border-t border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur-md text-gray-900 dark:text-gray-100">
            <footer className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
                {/* Gradient line top */}
                <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

                <div className="flex flex-col">
                    <div className="grid w-full grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Column 1: About / Stay Connected */}
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-70"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Multisig Treasury</h3>
                            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Secure, transparent treasury management for DAOs and communities on Cardano. Powered by native multisig scripts.
                            </p>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="mailto:support@multisigtreasury.io" // thay email thật
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Support
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="mailto:hello@multisigtreasury.io"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="https://docs.multisigtreasury.io" // giả sử link docs
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Documentation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: Resources */}
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-10 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-70"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Resources</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="https://cardano.org"
                                        target="_blank"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Cardano.org
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="https://developers.cardano.org"
                                        target="_blank"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Developer Portal
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="/guides/multisig-setup"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Multisig Guide
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Community & Follow */}
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-10 bg-gradient-to-r from-purple-500 to-pink-500 opacity-70"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Community</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="https://twitter.com/multisigtreasury" // thay handle thật
                                        target="_blank"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Twitter / X
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="https://discord.gg/multisigtreasury" // giả sử có Discord
                                        target="_blank"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Discord
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="https://github.com/multisig-treasury"
                                        target="_blank"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        GitHub
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Legal */}
                        <div className="relative">
                            <div className="absolute -top-2 left-0 h-1 w-10 bg-gradient-to-r from-pink-500 to-red-500 opacity-70"></div>
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">Legal</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="/privacy-policy"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="/terms-of-service"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                        href="/disclaimer"
                                    >
                                        <span className="mr-3 inline-block h-px w-3 bg-gray-500 group-hover:bg-blue-500 transition-all duration-200"></span>
                                        Disclaimer
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-16 border-t border-gray-200/30 dark:border-white/10 pt-10">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center gap-4">
                                <Image
                                    className="h-9 w-auto opacity-90 transition-opacity hover:opacity-100"
                                    src={images.logo}
                                    alt="Multisig Treasury"
                                    width={36}
                                    height={36}
                                />
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Secure Governance • Decentralized Treasury • Built on Cardano
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <ThemeToggle />
                                <span className="text-gray-400/50">|</span>
                                <span>© {new Date().getFullYear()} Multisig Treasury. All rights reserved.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

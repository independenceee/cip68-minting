"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { images } from "@/public/images";
import { routers } from "@/constants/routers";
import Image from "next/image";
import { ConnectWallet } from "@/components/connect-wallet";
import { navbars } from "@/constants/navbars";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActiveNav = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href === "/documents") return pathname.startsWith("/documents");
        if (href === "/dashboard") return pathname.startsWith("/dashboard");
        if (href === "/tipper") return pathname.startsWith("/tipper");
        return false;
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    if (pathname.startsWith(routers.documentation) || pathname.startsWith(routers.login)) {
        return null;
    }

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
                    <motion.section
                        className="flex items-center"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Link href={routers.home} className="group flex items-center gap-3 transition-all duration-300 hover:scale-[1.02]">
                            <motion.div
                                className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
                                whileHover={{ scale: 1.04, rotate: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Image className="h-10 w-auto" loading="lazy" src={images.logo} alt="CIP68" width={40} height={40} />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">CIP68</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Metadata Studio</p>
                            </div>
                        </Link>
                    </motion.section>

                    <section className="hidden items-center gap-2 md:flex">
                        {navbars.map((navbar) => {
                            const isActive = isActiveNav(navbar.href);
                            return (
                                <motion.div
                                    key={navbar.id}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: navbar.id * 0.06 }}
                                >
                                    <Link
                                        target={navbar.target}
                                        href={navbar.href}
                                        className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                            isActive
                                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                        }`}
                                        onClick={closeMenu}
                                    >
                                        {navbar.title}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </section>

                    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                        <ConnectWallet />
                    </motion.div>

                    <section className="md:hidden">
                        <motion.button
                            onClick={toggleMenu}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                {isMenuOpen ? (
                                    <motion.div
                                        key="x"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </section>
                </div>
            </header>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeMenu}
                        />
                        <motion.div
                            className="fixed left-0 right-0 top-20 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
                            initial={{ y: "-10%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-10%", opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="flex h-screen flex-col items-center gap-4 px-6 py-8">
                                {navbars.map((navbar, index) => {
                                    const isActive = isActiveNav(navbar.href);
                                    return (
                                        <motion.div
                                            key={navbar.id}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.25, delay: index * 0.05 }}
                                        >
                                            <Link
                                                target={navbar.target}
                                                href={navbar.href}
                                                onClick={closeMenu}
                                                className={`flex items-center gap-2 rounded-full px-4 py-3 text-lg font-semibold transition ${isActive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                                            >
                                                {navbar.title}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                                <motion.div
                                    className="mt-4 w-full border-t border-slate-200/70 pt-6 dark:border-slate-800"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25, delay: navbars.length * 0.05 }}
                                >
                                    <ConnectWallet />
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

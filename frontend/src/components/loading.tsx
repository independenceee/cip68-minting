import { motion } from "framer-motion";
import { Link } from "lucide-react";
import Image from "next/image";
import { images } from "@/public/images";
export default function Loading() {
    return (
        <main className="relative pt-20">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <motion.div
                    className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-200/80 bg-white/80 px-8 py-16 text-center shadow-[0_24px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <motion.div
                        className="mb-6 flex h-30 w-30 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-purple-100 shadow-inner dark:from-blue-900 dark:to-purple-900"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image className="h-full w-full object-cover" src={images.logo} alt="" />
                    </motion.div>
                    <motion.h3
                        className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Loading ...
                    </motion.h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Preparing your CIP-68 workspace...</p>
                </motion.div>
            </div>
        </main>
    );
}

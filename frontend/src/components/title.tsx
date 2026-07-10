import { motion } from "framer-motion";
import Link from "next/link";

export default function Title({ title, description, isCreater = false }: { title: string; description: string; isCreater?: boolean }) {
    return (
        <div className="relative mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <motion.div
                    className="mb-4 flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <span className="h-1.5 w-12 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                    <span className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">CIP68 Workspace</span>
                </motion.div>
                <motion.h1
                    className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    {description}
                </motion.p>
            </div>
            {isCreater && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                    <Link
                        href="/dashboard/create"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        Create Treasury
                    </Link>
                </motion.div>
            )}
        </div>
    );
}

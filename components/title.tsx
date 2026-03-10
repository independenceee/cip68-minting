import { motion } from "framer-motion";
import Link from "next/link";

export default function Title({ title, description, isCreater = false }: { title: string; description: string; isCreater?: boolean }) {
    return (
        <div className="relative mb-16 flex items-start justify-between">
            <div>
                <motion.div
                    className="absolute -top-8 left-0 h-1 w-32 bg-gradient-to-r from-blue-500 to-transparent shadow-lg shadow-blue-500/50"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
                <motion.div
                    className="absolute -top-4 left-8 h-1 w-16 bg-gradient-to-r from-gray-300 dark:from-white/60 to-transparent"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <div className="mb-6 flex items-center gap-4">
                    <motion.div
                        className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    ></motion.div>
                    <motion.h1
                        className="text-4xl font-bold text-gray-900 dark:text-white lg:text-6xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        {title}
                    </motion.h1>
                </div>
                <motion.p
                    className="max-w-3xl text-xl text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    {description}
                </motion.p>
            </div>
            {isCreater && (
                <Link
                    href={"/dashboard/create"}
                    className="inline-flex items-center justify-center rounded-sm bg-blue-600 px-8 py-2 text-lg font-semibold text-white shadow-xl hover:bg-blue-700 dark:bg-white dark:text-blue-900 dark:hover:bg-gray-100"
                >
                    Create Treasury
                </Link>
            )}
        </div>
    );
}

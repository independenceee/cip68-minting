"use client";
import { motion, AnimatePresence } from "framer-motion";
import Mint from "@/components/mint";
import Title from "@/components/title";
import { images } from "@/public/images";
import { routers } from "@/constants/routers";

export default function Page() {
    return (
        <motion.main className="relative min-h-screen pt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                >
                    <Title
                        title="CIP-68 Core Features"
                        description="Focus on datum-based metadata, reference NFT labels, upgradable records, and readable smart contracts for modern Cardano workflows."
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.section
                        key="data"
                        className="grid gap-8 md:grid-cols-2"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { duration: 0.4 } },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {[
                            {
                                title: "Mint One – Single NFT",
                                image: "https://i.pinimg.com/1200x/32/ae/e6/32aee6200a75cdf06c932f737b533b3a.jpg",
                                routes: routers.mintOne,
                                description:
                                    "Create a single NFT with a focused transaction flow. Ideal for one-off drops, creative experiments, and fine-grained control over metadata.",
                            },
                            {
                                title: "Mint Multiple – Batch Minting",
                                image: "https://i.pinimg.com/736x/99/68/0e/99680e56e17f5150040515565a1a9725.jpg",
                                routes: routers.mintMultiple,
                                description:
                                    "Launch a full collection efficiently by batching multiple assets into one transaction. This is the best choice for large-scale launches and generative projects.",
                            },
                        ].map((result, index: number) => (
                            <motion.div
                                key={index}
                                className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-2 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                                }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.01, y: -4 }}
                            >
                                <Mint
                                    image={result.image || images.logo}
                                    title={result.title || "Untitled Proposal"}
                                    routes={result.routes || ""}
                                    description={result.description || ""}
                                />
                            </motion.div>
                        ))}
                    </motion.section>
                </AnimatePresence>
            </div>
        </motion.main>
    );
}

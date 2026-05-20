"use client";
import { motion, AnimatePresence } from "framer-motion";
import Mint from "@/components/mint";
import Title from "@/components/title";
import { images } from "@/public/images";
import { routers } from "@/constants/routers";

export default function Page() {
    return (
        <motion.main
            className="relative pt-20 min-h-screen bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                >
                    <Title
                        title="CIP-68 Core Features"
                        description="Focuses on datum-based metadata (reference NFT label 100 + 
                         user token label 222/444), upgradability without reminting, smart-contract readability — not Hydra tipping."
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.section
                        key="data"
                        className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
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
                                type: "mint_one",
                                title: "Mint One – Single NFT",
                                image: "https://i.pinimg.com/1200x/32/ae/e6/32aee6200a75cdf06c932f737b533b3a.jpg",
                                routes: routers.mintOne,
                                description:
                                    "Mint just one unique NFT in a single transaction. Ideal for on-demand minting, high-rarity items, testing, or user-triggered mints. Transactions are small, easy to track, but fees add up quickly when minting many individually.",
                            },
                            {
                                type: "mint_multiple",
                                title: "Mint Multiple – Batch Minting",
                                image: "https://i.pinimg.com/736x/99/68/0e/99680e56e17f5150040515565a1a9725.jpg",
                                routes: routers.mintMultiple,
                                description:
                                    "Mint multiple different NFTs (usually under the same policy ID) in one transaction. Extremely cost-efficient (20–50 NFTs for ~0.3–0.7 ADA/tx). Perfect for launching full collections, generative art, PFP projects. Requires careful tx size management and metadata optimization.",
                            },
                        ].map((result, index: number) => (
                            <motion.div
                                key={index}
                                className="rounded-xl border border-slate-700 bg-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900/95"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                                }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}
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

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { burn } from "@/actions/cip68.action";
import { useWallet } from "@/hooks/use-wallet";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosClock, IoIosShare } from "react-icons/io";
import { MdCopyAll, MdClose } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getAsset } from "@/actions/assets.action";
import { hexToString } from "@meshsdk/core";

type Transaction = {
    type: string;
    from: string;
    to: string;
    date: string;
    txHash: string;
};

export default function Page() {
    const { unit } = useParams();
    const { address, submitTx, signTx } = useWallet();

    const [showBurnModal, setShowBurnModal] = useState(false);
    const [burnQuantity, setBurnQuantity] = useState<string>("1");
    const [isBurning, setIsBurning] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ["assets", address],
        queryFn: async () =>
            await getAsset({ policyId: String(unit).slice(0, 56), assetName: String(unit).slice(56), walletAddress: address as string }),
        enabled: !!address,
    });

    const [copiedField, setCopiedField] = useState<string | null>(null);

    const transactions: Transaction[] = [
        {
            type: "Mint",
            from: "0x0000...0000",
            to: "addr1qx...9k2m3n4p5q6r7s8t9u0v",
            date: "2025-03-20 14:32",
            txHash: "tx1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        },
        {
            type: "Transfer",
            from: "addr1qx...9k2m3n4p5q6r7s8t9u0v",
            to: "addr1qy...x7y8z9a0b1c2d3e4f5g6h7i8j9k0l",
            date: "2025-03-21 09:15",
            txHash: "tx9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h",
        },
    ];

    const metadataArray = data?.onchain_metadata ? Object.entries(data.onchain_metadata).map(([key, value]) => ({ key, value })) : [];

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    const handleBurn = async function () {
        try {
            setIsBurning(true);
            const unsignedTx = await burn({
                address: address as string,
                assetName: hexToString(String(data?.asset_name).slice(8)),
                quantity: "-1",
            });
            const signedTx = await signTx(unsignedTx);
            const txHash = await submitTx(signedTx);
        } catch (error) {
            console.log(error);
        } finally {
            setIsBurning(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent py-20 text-slate-900 dark:text-white">
            <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
                <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"
                        >
                            <img src={data?.onchain_metadata?.image} alt={data?.onchain_metadata?.name} className="h-full w-full object-cover" />
                            <div className="absolute right-6 top-6 flex flex-col gap-3">
                                <button className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800">
                                    <IoIosShare className="h-6 w-6" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* ==================== DETAILS ==================== */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="mb-4 flex gap-3">
                                <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                    CIP-68
                                </span>
                                <span className="rounded-full bg-violet-100 px-4 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
                                    Legendary
                                </span>
                            </div>
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{data?.onchain_metadata?.name}</h1>
                            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">{data?.onchain_metadata?.description}</p>
                        </div>

                        {/* Owner & Mint Info */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="rounded-[1.3rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Current Owner</p>
                                <div className="flex items-center gap-3">
                                    <p className="truncate font-mono text-sm">{address}</p>
                                    <button
                                        onClick={() => copyToClipboard(address as string, "owner")}
                                        className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    >
                                        <MdCopyAll className="h-5 w-5" />
                                    </button>
                                </div>
                                {copiedField === "owner" && <p className="mt-2 text-xs text-emerald-500">Copied!</p>}
                            </div>

                            <div className="rounded-[1.3rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Minted</p>
                                <p className="font-medium">{Date.now().toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-6 rounded-[1.6rem] border border-slate-200/80 bg-white/80 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Policy ID</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <p className="break-all font-mono text-sm text-slate-700 dark:text-slate-300">{data?.policy_id}</p>
                                    <button
                                        onClick={() => copyToClipboard(data?.policy_id as string, "policy")}
                                        className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    >
                                        <MdCopyAll className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Asset Name (Hex)</p>
                                <p className="mt-1 break-all font-mono text-sm text-amber-600 dark:text-amber-300">{data?.asset_name}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                            <Link
                                href={window.location + "/update"}
                                className="flex-1 rounded-[1.1rem] border border-slate-200/80 bg-white px-5 py-5 text-center text-lg font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Update Metadata
                            </Link>

                            <button
                                onClick={() => setShowBurnModal(true)}
                                className="flex-1 rounded-[1.1rem] bg-red-600 px-5 py-5 text-lg font-semibold text-white transition hover:bg-red-700"
                            >
                                Burn NFT
                            </button>
                        </div>

                        {/* ==================== BURN MODAL ==================== */}
                        <AnimatePresence>
                            {showBurnModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="mx-4 w-full max-w-md rounded-[1.6rem] border border-slate-200/80 bg-white p-8 shadow-[0_20px_80px_-25px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="mb-6 flex items-center justify-between">
                                            <h2 className="text-2xl font-semibold text-red-500">Burn NFT</h2>
                                            <button
                                                onClick={() => setShowBurnModal(false)}
                                                className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                            >
                                                <MdClose size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                                                    NFT: <span className="font-medium text-slate-900 dark:text-white">{data?.metadata?.name}</span>
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Available quantity:{" "}
                                                    <span className="text-emerald-600 dark:text-emerald-400">{data?.quantity}</span>
                                                </p>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm text-slate-500 dark:text-slate-400">Quantity to burn</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={data?.quantity}
                                                    value={burnQuantity}
                                                    onChange={(e) => setBurnQuantity(e.target.value)}
                                                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xl text-slate-900 transition focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Max: {data?.quantity}</p>
                                            </div>

                                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                                                This action cannot be undone. The NFT will be permanently removed from the chain after burn.
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    onClick={() => setShowBurnModal(false)}
                                                    className="flex-1 rounded-2xl bg-slate-100 px-4 py-4 font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                                    disabled={isBurning}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleBurn}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-800"
                                                >
                                                    {isBurning ? <>Burning...</> : <>Confirm Burn</>}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-16">
                    <h3 className="mb-6 text-2xl font-semibold">Traits</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {metadataArray.map(({ key, value }, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -4 }}
                                className="rounded-[1.4rem] border border-slate-200/80 bg-white/80 p-7 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80"
                            >
                                <p className="text-sm text-slate-500 dark:text-slate-400">{key}</p>
                                <p className="mt-2 text-2xl font-semibold">{value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-16">
                    <div className="mb-6 flex items-center gap-3">
                        <IoIosClock className="h-6 w-6" />
                        <h3 className="text-2xl font-semibold">Transaction History</h3>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((tx, index) => (
                            <div
                                key={index}
                                className="rounded-[1.4rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                            {tx.type}
                                        </span>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            From: <span className="font-mono text-slate-700 dark:text-slate-200">{tx.from}</span>
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            To: <span className="font-mono text-slate-700 dark:text-slate-200">{tx.to}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{tx.date}</p>
                                        <button
                                            onClick={() => copyToClipboard(tx.txHash, `tx-${index}`)}
                                            className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
                                        >
                                            <MdCopyAll className="h-4 w-4" /> Copy Tx
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

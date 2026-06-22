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

export default function NFTDetailPage() {
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
        <div className="min-h-screen bg-zinc-950 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl"
                        >
                            <img src={data?.onchain_metadata?.image} alt={data?.onchain_metadata?.name} className="object-cover" />

                            {/* Floating Buttons */}
                            <div className="absolute top-6 right-6 flex flex-col gap-3">
                                <button className="p-4 rounded-2xl backdrop-blur-md border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 transition">
                                    <IoIosShare className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* ==================== DETAILS ==================== */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex gap-3 mb-4">
                                <span className="px-4 py-1 bg-emerald-900/60 rounded-full text-emerald-400 text-sm">CIP-68</span>
                                <span className="px-4 py-1 bg-purple-900/60 rounded-full text-purple-400 text-sm">Legendary</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{data?.onchain_metadata?.name}</h1>
                            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">{data?.onchain_metadata?.description}</p>
                        </div>

                        {/* Owner & Mint Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <p className="text-xs text-zinc-500 mb-1">Current Owner</p>
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-sm truncate">{address}</p>
                                    <button onClick={() => copyToClipboard(address as string, "owner")} className="text-zinc-400 hover:text-white">
                                        <MdCopyAll className="w-5 h-5" />
                                    </button>
                                </div>
                                {copiedField === "owner" && <p className="text-emerald-400 text-xs mt-2">Đã sao chép!</p>}
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <p className="text-xs text-zinc-500 mb-1">Minted</p>
                                <p className="font-medium">{Date.now().toLocaleString()}</p>
                            </div>
                        </div>

                        {/* On-chain Info */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 space-y-6">
                            <div>
                                <p className="text-xs text-zinc-500">Policy ID</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="font-mono text-sm break-all text-zinc-300">{data?.policy_id}</p>
                                    <button
                                        onClick={() => copyToClipboard(data?.policy_id as string, "policy")}
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        <MdCopyAll className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Asset Name (Hex)</p>
                                <p className="font-mono text-sm text-amber-300 break-all mt-1">{data?.asset_name}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href={window.location + "/update"}
                                className="flex-1 py-5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl font-semibold text-lg transition text-center"
                            >
                                Update Metadata
                            </Link>

                            <button
                                onClick={() => setShowBurnModal(true)}
                                className="flex-1 py-5 bg-red-600/90 hover:bg-red-700 rounded-2xl font-semibold text-lg transition"
                            >
                                Burn NFT
                            </button>
                        </div>

                        {/* ==================== BURN MODAL ==================== */}
                        <AnimatePresence>
                            {showBurnModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md mx-4 p-8"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-red-400">Burn NFT</h2>
                                            <button onClick={() => setShowBurnModal(false)} className="text-zinc-400 hover:text-white">
                                                <MdClose size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-sm text-zinc-400 mb-2">
                                                    NFT: <span className="text-white font-medium">{data?.metadata?.name}</span>
                                                </p>
                                                <p className="text-sm text-zinc-500">
                                                    Số lượng hiện có: <span className="text-emerald-400">{data?.quantity}</span>
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-2">Số lượng muốn burn</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={data?.quantity}
                                                    value={burnQuantity}
                                                    onChange={(e) => setBurnQuantity(e.target.value)}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-xl focus:outline-none focus:border-red-500 transition"
                                                />
                                                <p className="text-xs text-zinc-500 mt-2">Tối đa: {data?.quantity}</p>
                                            </div>

                                            <div className="bg-red-950/50 border border-red-900/50 rounded-2xl p-4 text-sm text-red-300">
                                                ⚠️ Hành động này không thể hoàn tác. NFT sau khi burn sẽ bị xóa vĩnh viễn khỏi blockchain.
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    onClick={() => setShowBurnModal(false)}
                                                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-semibold transition"
                                                    disabled={isBurning}
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={handleBurn}
                                                    className="flex-1 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                                                >
                                                    {isBurning ? <>Đang burn...</> : <>Xác nhận Burn</>}
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
                    <h3 className="text-2xl font-semibold mb-6">Thuộc tính (Traits)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metadataArray.map(({ key, value }, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -4 }}
                                className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-3xl p-7 transition-all duration-300"
                            >
                                <p className="text-sm text-zinc-500">{key}</p>
                                <p className="text-2xl font-semibold mt-2">{value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-16">
                    <div className="flex items-center gap-3 mb-6">
                        <IoIosClock className="w-6 h-6" />
                        <h3 className="text-2xl font-semibold">Lịch sử giao dịch</h3>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((tx, index) => (
                            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="inline-block px-4 py-1 bg-blue-900/50 text-blue-400 text-sm rounded-full mb-3">
                                            {tx.type}
                                        </span>
                                        <p className="text-zinc-400 text-sm">
                                            Từ: <span className="font-mono text-zinc-300">{tx.from}</span>
                                        </p>
                                        <p className="text-zinc-400 text-sm mt-1">
                                            Đến: <span className="font-mono text-zinc-300">{tx.to}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-500">{tx.date}</p>
                                        <button
                                            onClick={() => copyToClipboard(tx.txHash, `tx-${index}`)}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 mt-2 flex items-center gap-1"
                                        >
                                            <MdCopyAll className="w-4 h-4" /> Copy Tx
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

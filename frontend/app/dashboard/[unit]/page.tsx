"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosClock, IoIosShare, IoMdHeart, IoMdLink } from "react-icons/io";
import { MdCopyAll } from "react-icons/md";

type NFTDetail = {
    policyId: string;
    assetName: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    mintedAt: string;
    owner: string;
    metadata: Record<string, any>;
    traits: Array<{ trait_type: string; value: string; rarity?: number }>;
};

type Transaction = {
    type: string;
    from: string;
    to: string;
    date: string;
    txHash: string;
};

export default function NFTDetailPage() {
    const router = useRouter();

    const [nft] = useState<NFTDetail>({
        policyId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
        assetName: "536f6c76656c447261676f6e303031",
        name: "Solvel Dragon #001",
        description: "A legendary fire dragon from the Solvel universe. Born from the ashes of the ancient blockchain.",
        image: "https://via.placeholder.com/800x800.png/1a1a2e/00ffcc?text=Solvel+Dragon+%23001",
        quantity: 1,
        mintedAt: "2025-03-20",
        owner: "addr1qx...9k2m3n4p5q6r7s8t9u0v",
        metadata: {
            name: "Solvel Dragon #001",
            description: "A legendary fire dragon...",
            image: "ipfs://Qm...abc123",
            mediaType: "image/png",
            version: "CIP-68",
        },
        traits: [
            { trait_type: "Background", value: "Cosmic Nebula", rarity: 12.5 },
            { trait_type: "Body", value: "Obsidian Scales", rarity: 8.3 },
            { trait_type: "Eyes", value: "Golden Flame", rarity: 3.7 },
            { trait_type: "Horns", value: "Crystal Crown", rarity: 15.2 },
            { trait_type: "Wings", value: "Inferno Wings", rarity: 6.9 },
            { trait_type: "Rarity", value: "Legendary", rarity: 1.2 },
        ],
    });

    const [liked, setLiked] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Dữ liệu mẫu lịch sử giao dịch
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

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
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
                            <img src={nft.image} alt={nft.name} className="object-cover" />

                            {/* Floating Buttons */}
                            <div className="absolute top-6 right-6 flex flex-col gap-3">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`p-4 rounded-2xl backdrop-blur-md border border-zinc-700 transition-all ${
                                        liked ? "bg-red-500/20 text-red-500" : "bg-zinc-900/80 hover:bg-zinc-800"
                                    }`}
                                >
                                    <IoMdHeart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
                                </button>
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
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{nft.name}</h1>
                            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">{nft.description}</p>
                        </div>

                        {/* Owner & Mint Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <p className="text-xs text-zinc-500 mb-1">Current Owner</p>
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-sm truncate">{nft.owner}</p>
                                    <button onClick={() => copyToClipboard(nft.owner, "owner")} className="text-zinc-400 hover:text-white">
                                        <MdCopyAll className="w-5 h-5" />
                                    </button>
                                </div>
                                {copiedField === "owner" && <p className="text-emerald-400 text-xs mt-2">Đã sao chép!</p>}
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <p className="text-xs text-zinc-500 mb-1">Minted</p>
                                <p className="font-medium">{nft.mintedAt}</p>
                            </div>
                        </div>

                        {/* On-chain Info */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 space-y-6">
                            <div>
                                <p className="text-xs text-zinc-500">Policy ID</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <p className="font-mono text-sm break-all text-zinc-300">{nft.policyId}</p>
                                    <button onClick={() => copyToClipboard(nft.policyId, "policy")} className="text-zinc-400 hover:text-white">
                                        <MdCopyAll className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Asset Name (Hex)</p>
                                <p className="font-mono text-sm text-amber-300 break-all mt-1">{nft.assetName}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="flex-1 py-5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl font-semibold text-lg transition">
                                Update Metadata
                            </button>
                            <button className="flex-1 py-5 bg-red-600/90 hover:bg-red-700 rounded-2xl font-semibold text-lg transition">
                                Burn NFT
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==================== TRAITS ==================== */}
                <div className="mt-16">
                    <h3 className="text-2xl font-semibold mb-6">Thuộc tính (Traits)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nft.traits.map((trait, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -4 }}
                                className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-3xl p-7 transition-all duration-300"
                            >
                                <p className="text-sm text-zinc-500">{trait.trait_type}</p>
                                <p className="text-2xl font-semibold mt-2">{trait.value}</p>
                                {trait.rarity && (
                                    <p className="mt-4 text-xs inline-block bg-emerald-900/70 px-4 py-1 rounded-full text-emerald-400">
                                        Rarity: {trait.rarity}%
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ==================== TRANSACTION HISTORY ==================== */}
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

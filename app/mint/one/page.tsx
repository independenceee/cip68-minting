"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { MdCheck } from "react-icons/md";

type MetadataField = {
    key: string;
    value: string;
};

type FormData = {
    assetName: string;
    quantity: number;
    metadata: MetadataField[];
};

export default function Page() {
    const { status: sessionStatus } = useSession();

    if (sessionStatus === "unauthenticated") {
        redirect("/login");
    }

    const [step, setStep] = useState<number>(1);
    const [isMinting, setIsMinting] = useState(false);
    const [txHash, setTxHash] = useState<string>("");

    const [formData, setFormData] = useState<FormData>({
        assetName: "",
        quantity: 1,
        metadata: [
            { key: "name", value: "Solvel Dragon #001" },
            { key: "description", value: "A powerful dragon from the Solvel universe." },
            { key: "image", value: "https://via.placeholder.com/600x600.png?text=Solvel+Dragon" },
            { key: "mediaType", value: "image/png" },
        ],
    });
    const updateForm = (field: keyof Omit<FormData, "metadata">, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateMetadata = (index: number, field: "key" | "value", value: string) => {
        setFormData((prev) => {
            const newMeta = [...prev.metadata];
            newMeta[index] = { ...newMeta[index], [field]: value };
            return { ...prev, metadata: newMeta };
        });
    };

    const addMetadata = () => {
        setFormData((prev) => ({
            ...prev,
            metadata: [...prev.metadata, { key: "", value: "" }],
        }));
    };

    const removeMetadata = (index: number) => {
        if (formData.metadata.length <= 1) return;
        setFormData((prev) => ({
            ...prev,
            metadata: prev.metadata.filter((_, i) => i !== index),
        }));
    };

    const next = () => step < 5 && setStep(step + 1);
    const prev = () => step > 1 && setStep(step - 1);

    const progress = (step / 5) * 100;

    const handleMint = async () => {
        setIsMinting(true);

        setTxHash("");
        setIsMinting(false);
        next();
    };
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pt-20 pb-20 min-h-screen  text-white">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center my-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        CIP-68 Minting
                    </h1>
                    <p className="mt-4 text-zinc-400 text-xl">Mint NFT theo chuẩn CIP-68 chỉ trong 5 bước</p>
                </div>

                {/* Progress */}
                <div className="mb-10">
                    <div className="flex justify-between text-sm font-medium mb-4">
                        {["Thông tin Asset", "Metadata", "Xem lại", "Ký giao dịch", "Hoàn tất"].map((label, i) => (
                            <div key={i} className={`flex flex-col items-center ${i + 1 <= step ? "text-white" : "text-zinc-500"}`}>
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all ${
                                        i + 1 < step ? "bg-emerald-600" : i + 1 === step ? "bg-blue-600 ring-4 ring-blue-500/30" : "bg-zinc-800"
                                    }`}
                                >
                                    {i + 1}
                                </div>
                                <span className="hidden md:block text-xs">{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* ==================== STEP 1 ==================== */}
                    {step === 1 && (
                        <div className="space-y-10">
                            <div className="text-center">
                                <h2 className="text-3xl font-semibold">Bước 1: Thông tin Asset</h2>
                                <p className="text-zinc-400 mt-2">Tên và số lượng NFT bạn muốn mint</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">Tên Asset (on-chain)</label>
                                        <input
                                            type="text"
                                            value={formData.assetName}
                                            onChange={(e) => updateForm("assetName", e.target.value)}
                                            placeholder="SolvelDragon #001"
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-2">Số lượng mint</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={formData.quantity}
                                            onChange={(e) => updateForm("quantity", Math.max(1, Number(e.target.value)))}
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-sm text-zinc-400">
                                    <strong className="text-white">Lưu ý:</strong>
                                    <br />
                                    Asset Name sẽ được encode thành hex khi lưu trên blockchain.
                                    <br />
                                    CIP-68 cho phép metadata linh hoạt và dễ cập nhật sau này.
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={next}
                                    disabled={!formData.assetName.trim()}
                                    className="px-10 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 rounded-2xl font-semibold text-lg transition disabled:cursor-not-allowed"
                                >
                                    Tiếp tục →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== STEP 2 ==================== */}
                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-semibold">Bước 2: Metadata (CIP-25 / CIP-68)</h2>
                                <p className="text-zinc-400">Thêm các thuộc tính cho NFT của bạn</p>
                            </div>

                            <div className="space-y-4">
                                {formData.metadata.map((field, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <input
                                            type="text"
                                            placeholder="Key (ví dụ: name, description, image...)"
                                            value={field.key}
                                            onChange={(e) => updateMetadata(index, "key", e.target.value)}
                                            className="md:col-span-5 bg-zinc-950 border border-zinc-700 rounded-xl px-5 py-3 focus:border-purple-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Giá trị"
                                            value={field.value}
                                            onChange={(e) => updateMetadata(index, "value", e.target.value)}
                                            className="md:col-span-6 bg-zinc-950 border border-zinc-700 rounded-xl px-5 py-3 focus:border-purple-500"
                                        />
                                        <button
                                            onClick={() => removeMetadata(index)}
                                            className="md:col-span-1 text-red-400 hover:text-red-500 text-xl"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addMetadata} className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm">
                                + Thêm trường metadata
                            </button>

                            <div className="flex justify-between pt-6">
                                <button onClick={prev} className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-2xl">
                                    ← Quay lại
                                </button>
                                <button onClick={next} className="px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-semibold">
                                    Tiếp tục →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== STEP 3: REVIEW ==================== */}
                    {step === 3 && (
                        <div className="space-y-10">
                            <h2 className="text-3xl font-semibold text-center">Bước 3: Xem lại thông tin</h2>

                            <div className="grid md:grid-cols-2 gap-10">
                                {/* Info */}
                                <div className="space-y-6 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Asset Name</span>
                                        <span className="font-mono text-emerald-400">{formData.assetName || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Số lượng</span>
                                        <span className="font-semibold">{formData.quantity}</span>
                                    </div>

                                    <div>
                                        <p className="text-zinc-400 mb-3">Metadata</p>
                                        <pre className="bg-black p-6 rounded-2xl text-sm overflow-auto max-h-96">
                                            {JSON.stringify(Object.fromEntries(formData.metadata.map((m) => [m.key, m.value])), null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {/* NFT Preview Card */}
                                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center">
                                    <div className="w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden mb-6">
                                        <img
                                            src={formData.metadata.find((m) => m.key === "image")?.value || ""}
                                            alt="NFT Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold">{formData.assetName}</h3>
                                    <p className="text-zinc-400 text-center mt-2">{formData.metadata.find((m) => m.key === "description")?.value}</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button onClick={prev} className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-2xl">
                                    ← Sửa lại
                                </button>
                                <button onClick={next} className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-semibold">
                                    Xác nhận & Tiếp tục
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== STEP 4: SIGN ==================== */}
                    {step === 4 && (
                        <div className="text-center py-12 space-y-10">
                            <div>
                                <h2 className="text-3xl font-semibold mb-3">Bước 4: Ký giao dịch</h2>
                                <p className="text-zinc-400 max-w-md mx-auto">Kết nối ví Cardano (Nami, Eternl, Lace, Yoroi...) và xác nhận mint</p>
                            </div>

                            <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"></div>

                            <button
                                onClick={handleMint}
                                disabled={isMinting}
                                className="px-16 py-6 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-3xl font-bold text-xl shadow-xl shadow-pink-900/50 disabled:opacity-70 flex items-center gap-3 mx-auto"
                            >
                                {isMinting ? (
                                    <>
                                        <Loading />
                                    </>
                                ) : (
                                    "KẾT NỐI VÍ & KÝ"
                                )}
                            </button>

                            <button onClick={prev} className="text-zinc-400 hover:text-white">
                                ← Quay lại
                            </button>
                        </div>
                    )}

                    {/* ==================== STEP 5: SUCCESS ==================== */}
                    {step === 5 && (
                        <div className="text-center py-16 space-y-12">
                            <div className="mx-auto w-24 h-24 rounded-full bg-emerald-900/50 flex items-center justify-center">
                                <MdCheck className="w-20 h-20 text-emerald-400" />
                            </div>

                            <div>
                                <h2 className="text-5xl font-bold text-emerald-400">Mint thành công!</h2>
                                <p className="text-zinc-400 mt-4 text-xl">NFT của bạn đã được tạo trên testnet</p>
                            </div>

                            {txHash && (
                                <div className="max-w-xl mx-auto bg-zinc-950 border border-emerald-900 rounded-2xl p-8">
                                    <p className="text-emerald-400 text-sm mb-2">Transaction Hash</p>
                                    <a
                                        href={`https://preview.cardanoscan.io/transaction/${txHash}`}
                                        target="_blank"
                                        className="font-mono text-sm break-all text-emerald-300 hover:underline"
                                    >
                                        {txHash}
                                    </a>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setStep(1);
                                    setTxHash("");
                                    setFormData({
                                        assetName: "",
                                        quantity: 1,
                                        metadata: [
                                            { key: "name", value: "Solvel Dragon #001" },
                                            { key: "description", value: "A powerful dragon from the Solvel universe." },
                                            { key: "image", value: "https://via.placeholder.com/600x600.png?text=Solvel+Dragon" },
                                        ],
                                    });
                                }}
                                className="px-12 py-5 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 transition"
                            >
                                Mint NFT khác
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-zinc-600 text-sm mt-12">
                    Đây là giao diện demo • Chưa kết nối blockchain thật • Sử dụng Next.js + Tailwind + Framer Motion
                </p>
            </div>
        </motion.main>
    );
}

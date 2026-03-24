"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type FormData = {
    assetName: string;
    quantity: number;
    metadata: Record<string, string>;
};

export default function Page() {
    const { status: sessionStatus } = useSession();

    if (sessionStatus === "unauthenticated") {
        redirect("/login");
    }
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        assetName: "",
        quantity: 1,
        metadata: {
            name: "Example NFT",
            description: "This is an example NFT created with CIP-68 minting interface.",
            image: "https://via.placeholder.com/300.png?text=Example+NFT",
        },
    });

    const updateMetadata = (index: number, field: string, value: string) => {
        const updated = [...formData.metadata];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, metadata: updated });
    };

    const addMetadata = () => {
        setFormData({
            ...formData,
            metadata: [...formData.metadata, { key: "", value: "" }],
        });
    };

    const removeMetadata = (index: number) => {
        const updated = formData.metadata.filter((_, i) => i !== index);
        setFormData({ ...formData, metadata: updated });
    };
    const [txHash] = useState("0x" + "a".repeat(64));

    const updateForm = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const next = () => {
        if (step < 5) setStep(step + 1);
    };

    const prev = () => {
        if (step > 1) setStep(step - 1);
    };

    const progressWidth = `${(step / 5) * 100}%`;

    return (
        <motion.main className="relative pt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="min-h-screen ">
                <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                    <div className="text-center mb-10 md:mb-12">
                        <h1
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3 
    bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
    bg-clip-text text-transparent"
                        >
                            CIP68 Minting
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl">
                            Easily create and mint your NFT in just 5 simple steps with this demo interface
                        </p>
                    </div>

                    <div className="mb-12">
                        <div className="flex justify-between text-xs md:text-sm font-medium mb-3 px-1">
                            {["Asset", "Metadata", "Review", "Sign", "Done"].map((label, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold mb-1.5 transition-all duration-300 ${
                                            i + 1 < step
                                                ? "bg-emerald-600 text-white"
                                                : i + 1 === step
                                                  ? "bg-blue-600 ring-2 ring-blue-500/40 text-white"
                                                  : "bg-zinc-800 text-zinc-500"
                                        }`}
                                    >
                                        {i + 1}
                                    </div>
                                    <span className={i + 1 <= step ? "text-white" : "text-zinc-600"}>{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500 ease-out"
                                style={{ width: progressWidth }}
                            />
                        </div>
                    </div>

                    <div className=" backdrop-blur-sm border rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl">
                        {step === 1 && (
                            <div className="flex flex-col">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl md:text-3xl font-semibold mb-3">Step 1 – Asset Details</h2>
                                    <p className="text-zinc-400">Provide the basic information for your NFT asset</p>
                                </div>

                                <main className="grid md:grid-cols-2 gap-10 items-start">
                                    {/* LEFT - FORM */}
                                    <div className="space-y-8 animate-fade-in">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-300 mb-2">Asset Name (on-chain)</label>
                                                <input
                                                    type="text"
                                                    value={formData.assetName}
                                                    onChange={(e) => updateForm("assetName", e.target.value)}
                                                    placeholder="Example: SolvelDragon #001"
                                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-5 py-4 text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-zinc-300 mb-2">Mint Quantity</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={formData.quantity}
                                                    onChange={(e) => updateForm("quantity", Math.max(1, Number(e.target.value)))}
                                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-5 py-4 text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={next}
                                                disabled={!formData.assetName.trim()}
                                                className="px-8 py-4 w-full text-center bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center gap-3 transition"
                                            >
                                                Continue <span aria-hidden>→</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* RIGHT - GUIDE */}
                                    <div className="p-7 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                        <h3 className="text-lg font-semibold mb-3">Step Guide</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            Enter the name of your NFT asset and choose how many tokens you want to mint. This information will be
                                            stored on-chain when the minting transaction is executed.
                                        </p>
                                    </div>
                                </main>
                            </div>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
                                {/* Header */}
                                <div className="text-center">
                                    <h2 className="text-3xl md:text-4xl font-semibold mb-3">Step 2 – Metadata (CIP-25)</h2>
                                    <p className="text-zinc-400">Enter metadata fields for your NFT</p>
                                </div>

                                {/* Metadata Fields */}
                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 space-y-6">
                                    {formData.metadata.map((item, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            {/* Key */}
                                            <input
                                                type="text"
                                                placeholder="Key (example: name)"
                                                value={item.key}
                                                onChange={(e) => updateMetadata(index, "key", e.target.value)}
                                                className="md:col-span-2 bg-zinc-900 border border-zinc-700
                    rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none"
                                            />

                                            {/* Value */}
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={item.value}
                                                onChange={(e) => updateMetadata(index, "value", e.target.value)}
                                                className="md:col-span-2 bg-zinc-900 border border-zinc-700
                    rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none"
                                            />

                                            {/* Remove */}
                                            <button onClick={() => removeMetadata(index)} className="text-red-400 hover:text-red-300 text-sm">
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Field */}
                                    <button onClick={addMetadata} className="text-sm text-purple-400 hover:text-purple-300">
                                        + Add Field
                                    </button>
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-between pt-6">
                                    <button
                                        onClick={prev}
                                        className="px-7 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-xl font-medium transition"
                                    >
                                        ← Back
                                    </button>

                                    <button
                                        onClick={next}
                                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700
            rounded-xl font-semibold transition"
                                    >
                                        Continue →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3 - Review */}
                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Bước 3 – Xem lại thông tin</h2>

                                <div className="space-y-6 bg-zinc-950/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
                                    <div className="flex justify-between py-3 border-b border-zinc-800">
                                        <span className="text-zinc-400">Asset Name</span>
                                        <span className="font-medium text-emerald-400 font-mono">{formData.assetName || "—"}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-zinc-800">
                                        <span className="text-zinc-400">Quantity</span>
                                        <span className="font-medium">{formData.quantity}</span>
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 mb-3">Metadata</p>
                                        <pre className="bg-black p-5 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap text-amber-200/90">
                                            {JSON.stringify(formData.metadata, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-8">
                                    <button
                                        onClick={prev}
                                        className="px-7 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-xl font-medium transition"
                                    >
                                        ← Sửa lại
                                    </button>
                                    <button
                                        onClick={next}
                                        className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition"
                                    >
                                        Xác nhận & Tiếp tục
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4 - Sign (giả lập) */}
                        {step === 4 && (
                            <div className="space-y-10 animate-fade-in text-center">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">Bước 4 – Ký giao dịch</h2>
                                    <p className="text-zinc-400 mb-8 max-w-md mx-auto">Kết nối ví (Nami / Eternl / Leather / ...) và xác nhận mint</p>
                                </div>

                                <div className="inline-flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-zinc-800/70 flex items-center justify-center text-5xl">👛</div>
                                    <button
                                        onClick={next}
                                        className="px-12 py-6 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-2xl font-bold text-lg shadow-lg shadow-rose-900/30 transition"
                                    >
                                        KẾT NỐI VÀ KÝ
                                    </button>
                                </div>

                                <div className="pt-8">
                                    <button
                                        onClick={prev}
                                        className="px-7 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-xl font-medium transition"
                                    >
                                        ← Quay lại
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 5 - Success */}
                        {step === 5 && (
                            <div className="text-center space-y-10 animate-fade-in">
                                <div className="mx-auto w-24 h-24 rounded-full bg-emerald-900/40 flex items-center justify-center">
                                    <svg className="w-14 h-14 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="text-4xl font-bold text-emerald-400 mb-3">Mint thành công!</h2>
                                    <p className="text-zinc-400 text-lg">NFT của bạn đã được tạo (trên testnet/demo)</p>
                                </div>

                                <div className="bg-zinc-950/70 p-6 rounded-2xl border border-zinc-800 max-w-2xl mx-auto">
                                    <p className="text-zinc-500 text-sm mb-3">Transaction Hash</p>
                                    <div className="font-mono text-emerald-300 break-all text-sm md:text-base">{txHash}</div>
                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    className="px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-semibold text-lg transition"
                                >
                                    Mint NFT khác
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer note */}
                    <p className="text-center text-zinc-600 text-sm mt-12">
                        Đây chỉ là giao diện demo • Chưa kết nối blockchain thật • Next.js + Tailwind
                    </p>
                </div>
            </div>
        </motion.main>
    );
}

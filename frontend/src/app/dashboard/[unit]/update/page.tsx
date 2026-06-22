"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MdArrowLeft, MdCheckCircle } from "react-icons/md";
import { CircleLoader } from "react-spinners";
import { useWallet } from "@/hooks/use-wallet";
import { update } from "@/actions/cip68.action";
import { getAsset } from "@/actions/assets.action";
import { hexToString } from "@meshsdk/core";

type MetadataField = {
    key: string;
    value: string;
};

export default function UpdateMetadataPage() {
    const { address, signTx, submitTx } = useWallet();
    const { unit } = useParams();
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ["assets", address],
        queryFn: async () =>
            await getAsset({ policyId: String(unit).slice(0, 56), assetName: String(unit).slice(56), walletAddress: address as string }),
        enabled: !!address,
    });

    const [step, setStep] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    const [txHash, setTxHash] = useState("");

    const [metadata, setMetadata] = useState<MetadataField[]>(
        Object.entries((data?.onchain_metadata as Record<string, string>) || {}).map(([key, value]) => ({
            key,
            value,
        })),
    );

    const updateField = (index: number, field: "key" | "value", newValue: string) => {
        const newMetadata = [...metadata];
        newMetadata[index] = { ...newMetadata[index], [field]: newValue };
        setMetadata(newMetadata);
    };

    const addField = () => {
        setMetadata([...metadata, { key: "", value: "" }]);
    };

    const removeField = (index: number) => {
        if (metadata.length === 1) return;
        setMetadata(metadata.filter((_, i) => i !== index));
    };

    const next = () => step < 4 && setStep(step + 1);
    const prev = () => step > 1 && setStep(step - 1);

    const handleUpdate = async () => {
        setIsUpdating(true);
        const unsignedTx = await update({
            address: address as string,
            metadata: metadata.reduce(
                (acc, item) => {
                    acc[item.key] = item.value;
                    return acc;
                },
                {} as Record<string, string>,
            ),
            assetName: hexToString(String(data?.asset_name).slice(8)),
        });
        const signedTx = await signTx(unsignedTx);
        const txHash = await submitTx(signedTx);
        setTxHash(txHash);
        setIsUpdating(false);
        next();
    };

    const progress = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10">
                {/* Header */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8">
                    <MdArrowLeft className="w-5 h-5" /> Quay lại chi tiết NFT
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Update Metadata</h1>
                    <p className="text-zinc-400 mt-3 text-lg">Cập nhật thông tin NFT theo chuẩn CIP-68</p>
                    <p className="text-sm text-emerald-400 mt-1 font-mono">{data?.onchain_metadata.name}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-sm mb-4 px-2">
                        {["Xem trước", "Chỉnh sửa", "Xem lại", "Xác nhận"].map((label, i) => (
                            <div key={i} className={`font-medium ${i + 1 <= step ? "text-white" : "text-zinc-500"}`}>
                                {label}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12">
                    {/* Step 1: Preview */}
                    {step === 1 && (
                        <div className="space-y-10 text-center">
                            <div className="mx-auto w-80 aspect-square rounded-2xl overflow-hidden border border-zinc-700">
                                <img
                                    src={data?.onchain_metadata?.image}
                                    alt={data?.onchain_metadata?.name}
                                    width={400}
                                    height={400}
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-semibold">{data?.onchain_metadata?.name}</h2>
                                <p className="text-zinc-400 mt-2">Bạn đang cập nhật metadata cho NFT này</p>
                            </div>
                            <button onClick={next} className="px-12 py-5 bg-purple-600 hover:bg-purple-700 rounded-2xl font-semibold text-lg">
                                Bắt đầu chỉnh sửa →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Edit Metadata */}
                    {step === 2 && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-semibold text-center">Chỉnh sửa Metadata</h2>

                            <div className="space-y-5">
                                {metadata.map((field, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <input
                                            type="text"
                                            value={field.key}
                                            onChange={(e) => updateField(index, "key", e.target.value)}
                                            placeholder="Key (ví dụ: name, description...)"
                                            className="md:col-span-5 bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => updateField(index, "value", e.target.value)}
                                            placeholder="Giá trị"
                                            className="md:col-span-6 bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-4 focus:border-purple-500 outline-none"
                                        />
                                        <button onClick={() => removeField(index)} className="text-red-400 hover:text-red-500 text-2xl md:col-span-1">
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addField} className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                                + Thêm trường metadata mới
                            </button>

                            <div className="flex justify-between pt-8">
                                <button onClick={prev} className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-2xl">
                                    ← Quay lại
                                </button>
                                <button onClick={next} className="px-12 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-semibold">
                                    Tiếp tục →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="space-y-10">
                            <h2 className="text-3xl font-semibold text-center">Xem lại thay đổi</h2>

                            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                                <pre className="text-sm text-emerald-300 overflow-auto max-h-96 font-mono whitespace-pre-wrap">
                                    {JSON.stringify(Object.fromEntries(metadata.map((m) => [m.key, m.value])), null, 2)}
                                </pre>
                            </div>

                            <div className="flex justify-between">
                                <button onClick={prev} className="px-8 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-2xl">
                                    ← Sửa lại
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 rounded-2xl font-semibold flex items-center gap-3"
                                >
                                    {isUpdating ? (
                                        <>
                                            <CircleLoader className="animate-spin" /> Đang cập nhật...
                                        </>
                                    ) : (
                                        "Xác nhận cập nhật Metadata"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-12 space-y-12">
                            <div className="mx-auto w-24 h-24 rounded-full bg-emerald-900/50 flex items-center justify-center">
                                <MdCheckCircle className="w-20 h-20 text-emerald-400" />
                            </div>

                            <div>
                                <h2 className="text-4xl font-bold text-emerald-400">Cập nhật thành công!</h2>
                                <p className="text-zinc-400 mt-4">Metadata của NFT đã được cập nhật trên blockchain.</p>
                            </div>

                            {txHash && (
                                <div className="max-w-lg mx-auto bg-zinc-950 border border-emerald-900 rounded-2xl p-6">
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

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push(`/nft/${data?.onchain_metadata?.assetName}`)}
                                    className="px-10 py-5 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200"
                                >
                                    Quay về chi tiết NFT
                                </button>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setTxHash("");
                                    }}
                                    className="px-10 py-5 border border-zinc-700 hover:bg-zinc-800 rounded-2xl font-semibold"
                                >
                                    Cập nhật NFT khác
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

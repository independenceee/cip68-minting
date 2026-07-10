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
        <div className="min-h-screen bg-transparent pb-20 pt-10 text-slate-900 dark:text-white">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                    <MdArrowLeft className="h-5 w-5" /> Back to NFT details
                </button>

                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                        Update Metadata
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Edit your NFT metadata with confidence</h1>
                    <p className="mt-3 text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Update the on-chain information for this NFT using the same polished workflow as the rest of the app.
                    </p>
                    <p className="mt-2 font-mono text-sm text-emerald-600 dark:text-emerald-400">{data?.onchain_metadata.name}</p>
                </div>

                <div className="mb-12 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="mb-4 flex justify-between px-2 text-sm font-medium">
                        {["Preview", "Edit", "Review", "Confirm"].map((label, i) => (
                            <div
                                key={i}
                                className={`font-medium ${i + 1 <= step ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <motion.div
                            className="h-full bg-linear-to-r from-violet-500 to-fuchsia-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:p-12">
                    {step === 1 && (
                        <div className="space-y-10 text-center">
                            <div className="mx-auto aspect-square w-80 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                <img
                                    src={data?.onchain_metadata?.image}
                                    alt={data?.onchain_metadata?.name}
                                    width={400}
                                    height={400}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-semibold">{data?.onchain_metadata?.name}</h2>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">You are updating the metadata for this NFT.</p>
                            </div>
                            <button
                                onClick={next}
                                className="rounded-2xl bg-violet-600 px-12 py-5 text-lg font-semibold text-white transition hover:bg-violet-700"
                            >
                                Start editing →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <h2 className="text-center text-3xl font-semibold">Edit Metadata</h2>

                            <div className="space-y-5">
                                {metadata.map((field, index) => (
                                    <div key={index} className="grid items-center gap-4 md:grid-cols-12">
                                        <input
                                            type="text"
                                            value={field.key}
                                            onChange={(e) => updateField(index, "key", e.target.value)}
                                            placeholder="Key (for example: name, description...)"
                                            className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-slate-900 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white md:col-span-5"
                                        />
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => updateField(index, "value", e.target.value)}
                                            placeholder="Value"
                                            className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-slate-900 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white md:col-span-6"
                                        />
                                        <button
                                            onClick={() => removeField(index)}
                                            className="text-2xl text-red-500 transition hover:text-red-600 md:col-span-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addField}
                                className="flex items-center gap-2 text-sm font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-400"
                            >
                                + Add a new metadata field
                            </button>

                            <div className="flex justify-between pt-8">
                                <button
                                    onClick={prev}
                                    className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={next}
                                    className="rounded-2xl bg-violet-600 px-12 py-4 font-semibold text-white transition hover:bg-violet-700"
                                >
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10">
                            <h2 className="text-center text-3xl font-semibold">Review Changes</h2>

                            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-8 dark:border-slate-800 dark:bg-slate-950/50">
                                <pre className="max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-sm text-slate-700 dark:text-slate-300">
                                    {JSON.stringify(Object.fromEntries(metadata.map((m) => [m.key, m.value])), null, 2)}
                                </pre>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={prev}
                                    className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    ← Edit again
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-12 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                    {isUpdating ? (
                                        <>
                                            <CircleLoader className="animate-spin" /> Updating...
                                        </>
                                    ) : (
                                        "Confirm metadata update"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-12 py-12 text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                                <MdCheckCircle className="h-20 w-20 text-emerald-600 dark:text-emerald-400" />
                            </div>

                            <div>
                                <h2 className="text-4xl font-semibold text-emerald-600 dark:text-emerald-400">Update successful!</h2>
                                <p className="mt-4 text-slate-500 dark:text-slate-400">The NFT metadata has been updated on chain.</p>
                            </div>

                            {txHash && (
                                <div className="mx-auto max-w-lg rounded-[1.3rem] border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/40">
                                    <p className="mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">Transaction Hash</p>
                                    <a
                                        href={`https://preview.cardanoscan.io/transaction/${txHash}`}
                                        target="_blank"
                                        className="break-all font-mono text-sm text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                                    >
                                        {txHash}
                                    </a>
                                </div>
                            )}

                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <button
                                    onClick={() => router.push(`/nft/${data?.onchain_metadata?.assetName}`)}
                                    className="rounded-2xl bg-slate-900 px-10 py-5 font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                >
                                    Back to NFT details
                                </button>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setTxHash("");
                                    }}
                                    className="rounded-2xl border border-slate-200 bg-white px-10 py-5 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Update another NFT
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

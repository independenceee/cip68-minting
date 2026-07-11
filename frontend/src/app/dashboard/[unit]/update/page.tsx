"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MdArrowLeft, MdCheckCircle, MdAdd, MdDeleteOutline } from "react-icons/md";
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

    const { data } = useQuery({
        queryKey: ["assets", address],
        queryFn: async () =>
            await getAsset({ policyId: String(unit).slice(0, 56), assetName: String(unit).slice(56), walletAddress: address as string }),
        enabled: !!address,
    });

    const [step, setStep] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [metadata, setMetadata] = useState<MetadataField[]>([]);

    useEffect(() => {
        if (!data?.onchain_metadata) {
            setMetadata([]);
            return;
        }

        const entries = Object.entries(data.onchain_metadata as Record<string, string>).map(([key, value]) => ({
            key,
            value: String(value),
        }));

        setMetadata(entries.length > 0 ? entries : [{ key: "", value: "" }]);
    }, [data?.onchain_metadata]);

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
        const payload = metadata.reduce(
            (acc, item) => {
                const key = item.key.trim();
                if (!key) return acc;
                acc[key] = item.value.trim();
                return acc;
            },
            {} as Record<string, string>,
        );

        const unsignedTx = await update({
            address: address as string,
            metadata: payload,
            assetName: hexToString(String(data?.asset_name).slice(8)),
        });
        const signedTx = await signTx(unsignedTx);
        const txHash = await submitTx(signedTx);
        setTxHash(txHash);
        setIsUpdating(false);
        next();
    };

    const progress = (step / 4) * 100;
    const stepLabels = ["Preview", "Edit", "Review", "Confirm"];
    const currentName = data?.onchain_metadata?.name || "NFT";

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.2),transparent_35%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.98))] dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <button
                    onClick={() => router.back()}
                    className="flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                    <MdArrowLeft className="h-4 w-4" /> Back to NFT details
                </button>

                <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_90px_-35px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:p-8">
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-300">
                                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Update Metadata
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Edit your NFT metadata with clarity</h1>
                            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                                Review the current asset information, adjust the fields you want, and publish the update in a few guided steps.
                            </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <p className="font-medium">Current asset</p>
                            <p className="mt-1 font-mono text-xs">{currentName}</p>
                        </div>
                    </div>

                    <div className="mb-8 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                        <div className="mb-4 flex flex-wrap gap-2">
                            {stepLabels.map((label, index) => {
                                const isActive = index + 1 <= step;
                                return (
                                    <div
                                        key={label}
                                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                                : "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                                        }`}
                                    >
                                        {index + 1}. {label}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <motion.div
                                className="h-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 md:p-8">
                        {step === 1 && (
                            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                    <img src={data?.onchain_metadata?.image} alt={currentName} className="h-full min-h-80 w-full object-cover" />
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
                                            Preview
                                        </p>
                                        <h2 className="mt-2 text-3xl font-semibold">{currentName}</h2>
                                        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                                            This step gives you a quick preview of the NFT before you update any metadata fields.
                                        </p>
                                    </div>
                                    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                                        <p className="font-medium text-slate-900 dark:text-white">What you can do next</p>
                                        <ul className="mt-3 space-y-2">
                                            <li>• Review the existing metadata values</li>
                                            <li>• Add or remove fields as needed</li>
                                            <li>• Confirm the final payload before broadcasting</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={next}
                                        className="rounded-2xl bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-700"
                                    >
                                        Start editing →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                                <div className="space-y-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/70">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">Edit</p>
                                        <h2 className="mt-2 text-2xl font-semibold">Shape the metadata payload</h2>
                                    </div>
                                    <div className="rounded-[1.1rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        Keep the field names meaningful and use short values where possible to keep the on-chain payload easier to
                                        read.
                                    </div>
                                    <div className="rounded-[1.1rem] border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                                        <p className="font-medium text-slate-900 dark:text-white">Tips</p>
                                        <ul className="mt-2 space-y-2">
                                            <li>• Blank keys are ignored before submission</li>
                                            <li>• Remove fields you no longer need</li>
                                            <li>• Preview the final JSON on the next step</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {metadata.map((field, index) => (
                                        <div
                                            key={index}
                                            className="rounded-[1.2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Field #{index + 1}</p>
                                                <button
                                                    onClick={() => removeField(index)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-sm text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30"
                                                >
                                                    <MdDeleteOutline className="h-4 w-4" /> Remove
                                                </button>
                                            </div>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <input
                                                    type="text"
                                                    value={field.key}
                                                    onChange={(e) => updateField(index, "key", e.target.value)}
                                                    placeholder="Key (for example: name, description...)"
                                                    className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={field.value}
                                                    onChange={(e) => updateField(index, "value", e.target.value)}
                                                    placeholder="Value"
                                                    className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={addField}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/60"
                                    >
                                        <MdAdd className="h-4 w-4" /> Add a new metadata field
                                    </button>

                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                                        <button
                                            onClick={prev}
                                            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={next}
                                            className="rounded-2xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-700"
                                        >
                                            Review payload →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Review</p>
                                    <h2 className="mt-2 text-3xl font-semibold">Check the final metadata payload</h2>
                                </div>

                                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/70">
                                    <pre className="max-h-105 overflow-auto whitespace-pre-wrap wrap-break-word rounded-[1rem] bg-slate-900 p-4 font-mono text-sm text-slate-100 dark:bg-slate-950">
                                        {JSON.stringify(
                                            metadata.reduce(
                                                (acc, item) => {
                                                    const key = item.key.trim();
                                                    if (!key) return acc;
                                                    acc[key] = item.value.trim();
                                                    return acc;
                                                },
                                                {} as Record<string, string>,
                                            ),
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                    <button
                                        onClick={prev}
                                        className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        ← Edit again
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isUpdating}
                                        className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
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
                            <div className="space-y-8 py-6 text-center">
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                                    <MdCheckCircle className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">Update successful!</h2>
                                    <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                                        The NFT metadata has been submitted successfully. You can review the transaction below.
                                    </p>
                                </div>

                                {txHash && (
                                    <div className="mx-auto max-w-2xl rounded-[1.3rem] border border-emerald-200 bg-emerald-50 p-5 text-left dark:border-emerald-900/50 dark:bg-emerald-950/40">
                                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                                            Transaction hash
                                        </p>
                                        <a
                                            href={`https://preview.cardanoscan.io/transaction/${txHash}`}
                                            target="_blank"
                                            className="break-all font-mono text-sm text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                                        >
                                            {txHash}
                                        </a>
                                    </div>
                                )}

                                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                    <button
                                        onClick={() => router.push(`/dashboard/${unit}`)}
                                        className="rounded-2xl bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                    >
                                        Back to NFT details
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setTxHash("");
                                        }}
                                        className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        Update again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { MdArrowLeft, MdCheckCircle, MdAdd, MdDeleteOutline } from "react-icons/md";
import { CircleLoader } from "react-spinners";
import { mint } from "@/actions/cip68.action";
import { useWallet } from "@/hooks/use-wallet";

type MetadataField = {
    key: string;
    value: string;
};

type FormData = {
    assetName: string;
    quantity: number;
    metadata: MetadataField[];
};

const defaultMetadata: MetadataField[] = [
    { key: "name", value: "Solvel Dragon #001" },
    { key: "description", value: "A powerful dragon from the Solvel universe." },
    { key: "image", value: "https://via.placeholder.com/600x600.png?text=Solvel+Dragon" },
    { key: "mediaType", value: "image/png" },
];

export default function Page() {
    const { status: sessionStatus } = useSession();
    const { address, signTx, submitTx } = useWallet();
    const router = useRouter();

    if (sessionStatus === "unauthenticated") {
        redirect("/login");
    }

    const [step, setStep] = useState<number>(1);
    const [isMinting, setIsMinting] = useState(false);
    const [txHash, setTxHash] = useState<string>("");

    const [formData, setFormData] = useState<FormData>({
        assetName: "",
        quantity: 1,
        metadata: defaultMetadata,
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
    const stepLabels = ["Asset Info", "Metadata", "Review", "Sign", "Complete"];

    const handleMint = async () => {
        setIsMinting(true);
        const unsignedTx = await mint({
            address: address as string,
            assetName: formData.assetName,
            metadata: formData.metadata.reduce(
                (acc, item) => {
                    const key = item.key.trim();
                    if (!key) return acc;
                    acc[key] = item.value.trim();
                    return acc;
                },
                {} as Record<string, string>,
            ),
            quantity: String(formData.quantity),
        });
        const signedTx = await signTx(unsignedTx);
        const hash = await submitTx(signedTx);

        setTxHash(hash);
        setIsMinting(false);
        next();
    };

    const previewImage = formData.metadata.find((m) => m.key === "image")?.value || "";
    const previewDescription = formData.metadata.find((m) => m.key === "description")?.value || "";

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.2),transparent_35%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.98))] dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                    <MdArrowLeft className="h-4 w-4" /> Back to dashboard
                </button>

                <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_90px_-35px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:p-8">
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> CIP-68 Minting Flow
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create your NFT in a few simple steps</h1>
                            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                                Fill in the asset details, shape the metadata, review the payload, and sign the transaction to mint your NFT.
                            </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <p className="font-medium">Asset name</p>
                            <p className="mt-1 font-mono text-xs">{formData.assetName || "—"}</p>
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
                                className="h-full bg-linear-to-r from-blue-500 via-violet-500 to-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 md:p-8">
                        {step === 1 && (
                            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
                                            Step 1 · Asset Info
                                        </p>
                                        <h2 className="mt-2 text-3xl font-semibold">Name and quantity of the NFT you want to mint</h2>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                            Asset name (on-chain)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.assetName}
                                            onChange={(e) => updateForm("assetName", e.target.value)}
                                            placeholder="Hydra Course 2026"
                                            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Quantity to mint</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={formData.quantity}
                                            onChange={(e) => updateForm("quantity", Math.max(1, Number(e.target.value)))}
                                            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <button
                                        onClick={next}
                                        disabled={!formData.assetName.trim()}
                                        className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    >
                                        Continue →
                                    </button>
                                </div>

                                <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                                    <p className="font-medium text-slate-900 dark:text-white">Note</p>
                                    <ul className="mt-3 space-y-2">
                                        <li>• The asset name will be encoded to hex when stored on-chain</li>
                                        <li>• CIP-68 keeps metadata flexible and easy to update later</li>
                                        <li>• Quantity controls how many units of this asset are minted</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                                <div className="space-y-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/70">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
                                            Step 2 · Metadata
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold">Shape the metadata payload</h2>
                                    </div>
                                    <div className="rounded-[1.1rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        Follow CIP-25 / CIP-68 conventions — keys like name, description, image, and mediaType are recognized by most
                                        wallets and explorers.
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
                                    {formData.metadata.map((field, index) => (
                                        <div
                                            key={index}
                                            className="rounded-[1.2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Field #{index + 1}</p>
                                                <button
                                                    onClick={() => removeMetadata(index)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-sm text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30"
                                                >
                                                    <MdDeleteOutline className="h-4 w-4" /> Remove
                                                </button>
                                            </div>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <input
                                                    type="text"
                                                    value={field.key}
                                                    onChange={(e) => updateMetadata(index, "key", e.target.value)}
                                                    placeholder="Key (for example: name, description...)"
                                                    className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={field.value}
                                                    onChange={(e) => updateMetadata(index, "value", e.target.value)}
                                                    placeholder="Value"
                                                    className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={addMetadata}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
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
                                            className="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
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
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                                        Step 3 · Review
                                    </p>
                                    <h2 className="mt-2 text-3xl font-semibold">Check the final mint payload</h2>
                                </div>

                                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                                    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/70">
                                        <div className="mb-4 flex items-center justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Asset Name</span>
                                            <span className="font-mono text-blue-600 dark:text-blue-400">{formData.assetName || "—"}</span>
                                        </div>
                                        <div className="mb-4 flex items-center justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Quantity</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{formData.quantity}</span>
                                        </div>
                                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Metadata</p>
                                        <pre className="max-h-80 overflow-auto whitespace-pre-wrap wrap-break-word rounded-[1rem] bg-slate-900 p-4 font-mono text-sm text-slate-100 dark:bg-slate-950">
                                            {JSON.stringify(
                                                formData.metadata.reduce(
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

                                    <div className="flex flex-col items-center rounded-[1.4rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/70">
                                        <div className="mb-6 aspect-square w-full overflow-hidden rounded-[1.2rem] bg-slate-200 dark:bg-slate-950">
                                            {previewImage && <img src={previewImage} alt="NFT preview" className="h-full w-full object-cover" />}
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{formData.assetName || "—"}</h3>
                                        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{previewDescription}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                    <button
                                        onClick={prev}
                                        className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        ← Edit again
                                    </button>
                                    <button
                                        onClick={next}
                                        className="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Confirm & continue →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8 py-6 text-center">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
                                        Step 4 · Sign Transaction
                                    </p>
                                    <h2 className="mt-2 text-3xl font-semibold">Connect your wallet and confirm the mint</h2>
                                    <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600 dark:text-slate-400">
                                        Signing broadcasts the transaction that mints your NFT on-chain.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 justify-center">
                                    <button
                                        onClick={prev}
                                        className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting}
                                        className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    >
                                        {isMinting ? (
                                            <>
                                                <CircleLoader size={18} color="#fff" /> Minting...
                                            </>
                                        ) : (
                                            "Sign transaction"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-8 py-6 text-center">
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                                    <MdCheckCircle className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">Mint successful!</h2>
                                    <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">
                                        Your NFT has been minted on testnet. You can review the transaction below.
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
                                        onClick={() => router.push("/dashboard")}
                                        className="rounded-2xl bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                    >
                                        Back to dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setTxHash("");
                                            setFormData({
                                                assetName: "",
                                                quantity: 1,
                                                metadata: defaultMetadata,
                                            });
                                        }}
                                        className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        Mint another NFT
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

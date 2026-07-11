"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { MdCheck } from "react-icons/md";
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

export default function Page() {
    const { status: sessionStatus } = useSession();
    const { address, signTx, submitTx } = useWallet();

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
        const unsignedTx = await mint({
            address: address as string,
            assetName: formData.assetName,
            metadata: formData.metadata.reduce(
                (acc, item) => {
                    acc[item.key] = item.value;
                    return acc;
                },
                {} as Record<string, string>,
            ),
            quantity: String(formData.quantity),
        });
        const signedTx = await signTx(unsignedTx);
        const txHash = await submitTx(signedTx);

        setTxHash(txHash);
        setIsMinting(false);
        next();
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen bg-transparent pb-20 pt-20 text-slate-900 dark:text-white"
        >
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <div className="my-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        CIP-68 Minting Flow
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">Create your NFT in a few simple steps</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Mint NFT to CIP-68 standard with a polished flow for asset details, metadata, review, and transaction signing.
                    </p>
                </div>

                <div className="mb-10 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="mb-4 flex justify-between px-1 text-sm font-medium">
                        {["Asset Info", "Metadata", "Review", "Sign Transaction", "Complete"].map((label, i) => (
                            <div
                                key={i}
                                className={`flex flex-col items-center ${i + 1 <= step ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}`}
                            >
                                <div
                                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full transition-all ${i + 1 < step ? "bg-blue-600 text-white" : i + 1 === step ? "bg-blue-500 text-white ring-4 ring-blue-400/30" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}
                                >
                                    {i + 1}
                                </div>
                                <span className="hidden text-xs md:block">{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <motion.div
                            className="h-full bg-linear-to-r from-blue-500 to-violet-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:p-12">
                    {step === 1 && (
                        <div className="space-y-10">
                            <div className="text-center">
                                <h2 className="text-3xl font-semibold">Step 1: Asset Information</h2>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Name and quantity of NFT you want to mint</p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                                            Asset Name (on-chain)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.assetName}
                                            onChange={(e) => updateForm("assetName", e.target.value)}
                                            placeholder="Hydra Course 2026"
                                            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-lg text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Quantity to Mint</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={formData.quantity}
                                            onChange={(e) => updateForm("quantity", Math.max(1, Number(e.target.value)))}
                                            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-lg text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-6 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                                    <strong className="text-slate-900 dark:text-white">Note:</strong>
                                    <br />
                                    Asset Name will be encoded to hex when saved on blockchain.
                                    <br />
                                    CIP-68 allows flexible metadata and easy updates later.
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={next}
                                    disabled={!formData.assetName.trim()}
                                    className="rounded-2xl bg-blue-600 px-10 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-semibold">Step 2: Metadata (CIP-25 / CIP-68)</h2>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Add attributes for your NFT</p>
                            </div>

                            <div className="space-y-4">
                                {formData.metadata.map((field, index) => (
                                    <div key={index} className="grid items-center gap-4 md:grid-cols-12">
                                        <input
                                            type="text"
                                            placeholder="Key (e.g.: name, description, image...)"
                                            value={field.key}
                                            onChange={(e) => updateMetadata(index, "key", e.target.value)}
                                            className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 md:col-span-5"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={field.value}
                                            onChange={(e) => updateMetadata(index, "value", e.target.value)}
                                            className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 md:col-span-6"
                                        />
                                        <button
                                            onClick={() => removeMetadata(index)}
                                            className="text-xl text-red-500 transition hover:text-red-600 md:col-span-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addMetadata}
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                            >
                                + Add metadata field
                            </button>

                            <div className="flex justify-between pt-6">
                                <button
                                    onClick={prev}
                                    className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={next}
                                    className="rounded-2xl bg-blue-600 px-10 py-4 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10">
                            <h2 className="text-center text-3xl font-semibold">Step 3: Review Information</h2>

                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="space-y-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-8 dark:border-slate-800 dark:bg-slate-950/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Asset Name</span>
                                        <span className="font-mono text-blue-600 dark:text-blue-400">{formData.assetName || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Quantity</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{formData.quantity}</span>
                                    </div>

                                    <div>
                                        <p className="mb-3 text-slate-500 dark:text-slate-400">Metadata</p>
                                        <pre className="max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                                            {JSON.stringify(Object.fromEntries(formData.metadata.map((m) => [m.key, m.value])), null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/50">
                                    <div className="mb-6 aspect-square w-full overflow-hidden rounded-[1.2rem] bg-slate-200 dark:bg-slate-900">
                                        <img
                                            src={formData.metadata.find((m) => m.key === "image")?.value || ""}
                                            alt="NFT Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{formData.assetName}</h3>
                                    <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
                                        {formData.metadata.find((m) => m.key === "description")?.value}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={prev}
                                    className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    ← Edit
                                </button>
                                <button
                                    onClick={next}
                                    className="rounded-2xl bg-blue-600 px-12 py-4 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Confirm & Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-10 py-12 text-center">
                            <div>
                                <h2 className="mb-3 text-3xl font-semibold">Step 4: Sign Transaction</h2>
                                <p className="mx-auto max-w-md text-slate-500 dark:text-slate-400">Connect Cardano wallet and confirm mint.</p>
                            </div>

                            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-pink-600" />

                            <button
                                onClick={handleMint}
                                disabled={isMinting}
                                className="mx-auto flex items-center gap-3 rounded-[1.4rem] bg-linear-to-r from-blue-600 to-violet-600 px-16 py-6 text-xl font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isMinting ? <Loading /> : "Sign Transaction"}
                            </button>

                            <button
                                onClick={prev}
                                className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                ← Back
                            </button>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-12 py-16 text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                                <MdCheck className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div>
                                <h2 className="text-5xl font-semibold text-blue-600 dark:text-blue-400">Mint Successful!</h2>
                                <p className="mt-4 text-xl text-slate-500 dark:text-slate-400">Your NFT has been created on testnet.</p>
                            </div>

                            {txHash && (
                                <div className="mx-auto max-w-xl rounded-[1.3rem] border border-blue-200 bg-blue-50 p-8 dark:border-blue-900/50 dark:bg-blue-950/40">
                                    <p className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-400">Transaction Hash</p>
                                    <a
                                        href={`https://preview.cardanoscan.io/transaction/${txHash}`}
                                        target="_blank"
                                        className="break-all font-mono text-sm text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
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
                                className="rounded-2xl bg-slate-900 px-12 py-5 font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                            >
                                Mint Another NFT
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    This is a demo interface • Not yet connected to real blockchain • Built with Next.js + Tailwind + Framer Motion
                </p>
            </div>
        </motion.main>
    );
}

"use client";

import { USD } from "./icons";
import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { images } from "@/public/images";
import { shortenString } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { signature, submitTx } from "@/services/mesh";
import { useQueryClient } from "@tanstack/react-query";

const Signature = function ({
    walletAddress,
    signers,
    owners,
    isLoading,
    threshold,
    allowance,
    title,
}: {
    walletAddress: string;
    signers: string[];
    owners: string[];
    isLoading?: boolean;
    threshold: number;
    allowance: number;
    title: string;
}) {
    const { address, signTx } = useWallet();

    const [isLoadingSign, setIsLoadingSign] = useState(false);
    const normWallet = walletAddress.toLowerCase();
    const queryClient = useQueryClient();
    const normSigners = new Set(signers.map((s) => s.toLowerCase()));
    const onSubmitSend = async function () {
        setIsLoadingSign(true);
        try {
            if (!walletAddress) {
                toast.error("Please connect your wallet");
                return;
            }

            const unsignedTx = await signature({
                walletAddress: walletAddress,
                allowance: allowance,
                threshold: threshold,
                title: title,
            });

            const signedTx = await signTx(unsignedTx);

            await submitTx({ signedTx: signedTx });
            toast.success("Treasury signed successfully!");
            await Promise.allSettled([queryClient.invalidateQueries({ queryKey: ["treasury"] })]);
        } catch (error) {
            toast.error("Failed to sign treasury. Please try again.");
        } finally {
            setIsLoadingSign(false);
        }
    };

    const formattedOwners = owners.map((owner) => {
        const normOwner = owner.toLowerCase();
        return {
            owner,
            isSigner: normSigners.has(normOwner),
            isCurrentUser: normOwner === normWallet,
            hasSigned: normSigners.has(normOwner),
        };
    });

    return (
        <motion.div
            className=" rounded-2xl h-full border border-blue-200/50 bg-white shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            <div className="p-6">
                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                    <motion.div
                        className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <USD className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Signature</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your latest signature treasury</p>
                    </div>
                </div>

                <div className="mt-4 flex-1 overflow-auto">
                    <AnimatePresence mode="wait">
                        {formattedOwners.length === 0 ? (
                            <NotFound key="not-found" />
                        ) : isLoading ? (
                            <Loading key="loading" />
                        ) : (
                            <Result
                                key="result"
                                threshold={threshold}
                                signers={signers}
                                owners={owners}
                                data={formattedOwners}
                                page={1}
                                setPage={null!}
                                totalPages={0}
                                onSubmitSend={onSubmitSend}
                                isLoadingSign={isLoadingSign}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const NotFound = function () {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-300"
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div
                className="rounded-full bg-blue-100/50 p-6 dark:bg-blue-900/50"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
                <USD className="h-12 w-12 text-blue-500 dark:text-blue-400" />
            </motion.div>
            <div className="mt-4 text-center">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">No Tips Yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Share your Tip Jar link to receive tips</p>
            </div>
        </motion.div>
    );
};

const Loading = function () {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-20 gap-4"
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Image className="h-16 w-16" width={64} height={64} src={images.logo} alt="Loading" />
            </motion.div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Loading...</p>
        </motion.div>
    );
};

const Result = function ({
    data,
    threshold,
    page,
    signers,

    setPage,
    totalPages,
    onSubmitSend,
    isLoadingSign,
}: {
    threshold: number;
    signers: string[];
    owners: string[];
    data: {
        owner: string;
        isSigner: boolean;
        isCurrentUser: boolean;
        hasSigned: boolean;
    }[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages?: number;
    onSubmitSend: () => Promise<void>;
    isLoadingSign: boolean;
}) {
    return (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Owner
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Signature
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider dark:text-gray-200">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-gray-700">
                        {data.map((item, index: number) => (
                            <motion.tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200"
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                                }}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-300">{shortenString(item.owner)}</td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-500 dark:text-gray-400">
                                    {item.isSigner ? "Signed" : "Unsigned"}
                                </td>
                                <td className="px-4 py-3 text-center ...">
                                    {item.isCurrentUser ? (
                                        item.isSigner ? (
                                            <span className="text-green-600 font-semibold">✓ Already Signed</span>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => {}}>
                                                        {isLoadingSign ? "Signing..." : "Sign Now"}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirm Signature</AlertDialogTitle>
                                                        <AlertDialogDescription>Bạn đang ký xác nhận transaction này.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={onSubmitSend}>Confirm Sign</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )
                                    ) : (
                                        <span className="text-gray-500">—</span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <motion.div
                className="flex justify-center items-center mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
            >
                <div className="inline-flex items-center gap-4  px-6 py-3 shadow-md 0 dark:from-slate-800/80 dark:to-slate-900 dark:border-slate-700/70 dark:shadow-slate-950/40">
                    {/* Phần đã ký */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold shadow-inner ${
                                signers.length >= threshold
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                    : signers.length > 0
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        >
                            {signers.length}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">đã ký</span>
                    </div>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-lg font-bold shadow-inner dark:bg-blue-900/40 dark:text-blue-300">
                            {threshold}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">cần</span>
                    </div>

                    {threshold > 0 && signers.length >= threshold && (
                        <div className="ml-3 flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-800 shadow-sm dark:bg-green-900/50 dark:text-green-200">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Đủ chữ ký – Sẵn sàng thực thi
                        </div>
                    )}

                    {threshold > 0 && signers.length < threshold && signers.length > 0 && (
                        <div className="ml-3 text-xs text-amber-700 dark:text-amber-400 italic">Còn thiếu {threshold - signers.length} chữ ký</div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default memo(Signature);

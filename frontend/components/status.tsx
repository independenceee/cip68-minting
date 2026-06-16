"use client";

import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Button } from "./ui/button";
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
import { Input } from "./ui/input"; // ← thêm import Input từ shadcn/ui
import { Warn } from "./icons";
import { submitTx, withdraw } from "@/services/mesh";
import { useWallet } from "@/hooks/use-wallet"; // ← giả sử bạn có hook này
import { DECIMAL_PLACE } from "@/frontend/constants/common";

interface StatusProps {
    title: string;
    allowance: number;
    loading: boolean;
    name: string;
    threshold: number;
    signers: string[];
    address: string;
}

const Status: React.FC<StatusProps> = ({ title, allowance, loading, threshold, signers, name, address }) => {
    const { signTx } = useWallet(); // =
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [showAmountDialog, setShowAmountDialog] = useState(false);
    const queryClient = useQueryClient();

    const onSubmitWithdraw = async () => {
        const withdrawAmount = Number(amount);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            toast.error("Vui lòng nhập số lượng ADA hợp lệ (lớn hơn 0)");
            return;
        }

        if (withdrawAmount > allowance) {
            toast.error(`Số lượng rút (${withdrawAmount} ADA) vượt quá allowance hiện có (${allowance} ADA)`);
            return;
        }

        setIsLoading(true);
        try {
            if (!address) {
                toast.error("Please connect your wallet");
                return;
            }

            const unsignedTx = await withdraw({
                walletAddress: address,
                allowance: allowance * DECIMAL_PLACE,
                threshold: threshold,
                title: name,
                amount: withdrawAmount,
            });

            const signedTx = await signTx(unsignedTx);

            await submitTx({ signedTx: signedTx });
            toast.success("Treasury withdrawn successfully!");
            await Promise.allSettled([queryClient.invalidateQueries({ queryKey: ["treasury"] })]);

            setAmount("");
            setShowAmountDialog(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to withdraw treasury. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const canWithdraw = signers.length >= threshold && allowance > 0;

    return (
        <motion.div
            className="relative flex w-full items-center gap-4 rounded-lg border-l-4 border-blue-400 bg-gradient-to-r from-blue-50 to-white p-4 shadow-md dark:border-blue-600 dark:from-blue-900/30 dark:to-gray-900"
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="flex-shrink-0 text-blue-500 dark:text-blue-400"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Warn className="h-5 w-5" />
            </motion.div>

            <div className="min-w-0 flex-1">
                <motion.p
                    className="truncate text-sm font-medium text-blue-700 dark:text-blue-200"
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.2 }}
                >
                    {title}
                </motion.p>
                <motion.div
                    className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600 dark:text-blue-300"
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.3 }}
                >
                    Allowance:{" "}
                    {loading ? (
                        <ClipLoader color="#3b82f6" size={14} />
                    ) : (
                        <span className="rounded-md bg-blue-100 px-2 py-1 dark:bg-blue-800/50">{allowance || "0"} ADA</span>
                    )}
                </motion.div>
            </div>

            {canWithdraw && (
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AlertDialog open={showAmountDialog} onOpenChange={setShowAmountDialog}>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={isLoading || allowance <= 0}
                                className="rounded-md bg-blue-500 py-3 px-8 text-base font-semibold text-white shadow-lg hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {isLoading ? "Withdrawing..." : "Withdraw"}
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Rút tiền từ Treasury</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Nhập số lượng ADA bạn muốn rút. Allowance hiện tại: <strong>{allowance} ADA</strong>.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="py-4">
                                <Input
                                    type="number"
                                    placeholder="Số ADA muốn rút"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min={0}
                                    step="0.000001" // hỗ trợ ADA có decimal nhỏ
                                    className="w-full"
                                    disabled={isLoading}
                                />
                                {amount && Number(amount) > allowance && (
                                    <p className="mt-1 text-sm text-red-600">Số lượng vượt quá allowance hiện có</p>
                                )}
                            </div>

                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onSubmitWithdraw}
                                    disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > allowance}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading ? "Đang xử lý..." : "Xác nhận rút"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Status;

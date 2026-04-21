"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "./icons";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Image from "next/image";
import { images } from "@/public/images";
import CountUp from "react-countup";
import { DECIMAL_PLACE } from "@/constants/common";
import { toast } from "sonner";
import { deposit, submitTx } from "@/services/mesh";

export const DepositSchema = z.object({
    amount: z.number().min(2, "Must commit at least 2 ADA"),
});

type DepositForm = z.infer<typeof DepositSchema>;
const FormTip = function ({
    allowance,
    threshold,
    title,
    value,
    isLoading,
}: {
    allowance: number;
    threshold: number;
    title: string;
    value: number;
    isLoading: boolean;
}) {
    const { address, signTx } = useWallet();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const queryClient = useQueryClient();

    const {
        register: registerSend,
        handleSubmit: handleSubmitSend,
        formState: { errors: errorsSend, isSubmitting: isSubmittingSend },
        setValue: setValueSend,
    } = useForm<DepositForm>({
        resolver: zodResolver(DepositSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const onSubmitDeposit = async function (data: DepositForm) {
        try {
            if (!address) {
                toast.error("Please connect your wallet");
                return;
            }
            if (data.amount <= 0) {
                toast.error("Please enter a valid amount");
                return;
            }

            const unsignedTx = await deposit({
                walletAddress: address,
                amount: data.amount * DECIMAL_PLACE,
                allowance: allowance,
                threshold: threshold,
                title: title,
            });
            if (typeof unsignedTx !== "string") {
                throw new Error("Invalid transaction format");
            }
            const signedTx = await signTx(unsignedTx);
            if (typeof signedTx !== "string") {
                throw new Error("Invalid signed transaction format");
            }
            await submitTx({
                signedTx,
            });
            setIsDialogOpen(false);
            toast.success("Tip sent successfully!");
            setValueSend("amount", 0);
            setAmount("");
            await Promise.allSettled([queryClient.invalidateQueries({ queryKey: ["treasury"] })]);
        } catch (error) {
            toast.error("Failed to send tip. Please try again.");
        }
    };

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (/^\d*\.?\d{0,6}$/.test(value) && Number(value) >= 0) {
                setAmount(value);
                setValueSend("amount", Number(value), { shouldValidate: true });
            }
        },
        [setValueSend],
    );

    return (
        <motion.div
            className="rounded-2xl border border-blue-200/50 bg-white p-6 shadow-lg dark:border-blue-900/30 dark:bg-slate-900"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            aria-label="Tip form card"
        >
            <div className="rounded-lg flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900/50 dark:to-purple-900/50">
                <div className="flex items-center gap-3">
                    <motion.div
                        className="rounded-full bg-white/90 p-2 dark:bg-slate-800/90"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </motion.div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Balance Of Treasury</p>
                        <motion.p
                            className="text-xl font-semibold text-blue-600 dark:text-blue-400"
                            variants={{
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                            }}
                            initial="initial"
                            animate="animate"
                        >
                            {isLoading ? (
                                "0.00"
                            ) : (
                                <CountUp
                                    start={0}
                                    end={((value / DECIMAL_PLACE) as number) || 0}
                                    duration={2.75}
                                    separator=" "
                                    decimals={4}
                                    decimal=","
                                />
                            )}{" "}
                            ADA
                        </motion.p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmitSend(onSubmitDeposit)} className="mt-4 rounded-lg bg-blue-50/80 p-4 dark:bg-slate-800/80">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Token</span>
                    <div className="flex items-center gap-2">
                        <Image src={images.cardano} alt="ADA" className="h-5 w-5" />
                        <span className="font-medium text-gray-800 dark:text-gray-300">ADA</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <label
                            htmlFor="amount"
                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                        >
                            Amount (ADA)
                        </label>
                        <input
                            {...registerSend("amount", {
                                setValueAs: (value) => Number(value),
                            })}
                            type="number"
                            id="amount"
                            placeholder="Enter amount in ADA"
                            step="0.000001"
                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                            disabled={isSubmittingSend}
                            onChange={handleChange}
                            value={amount}
                        />
                        {errorsSend.amount && (
                            <motion.p
                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                            >
                                {errorsSend.amount.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <motion.div
                        className="pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    disabled={isSubmittingSend || Number(amount) <= 0}
                                    onClick={() => Number(amount) >= 2 && setIsDialogOpen(true)}
                                    className="w-full rounded-md bg-blue-500 dark:bg-blue-600 py-3 px-8 text-base font-semibold text-white dark:text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {isSubmittingSend ? "Depositing..." : "Deposit"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Deposit</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Deposit will be sent to the CIP68 address. Requires {threshold} approval(s) from signers before funds are
                                        usable.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSubmitSend(onSubmitDeposit)} disabled={isSubmittingSend}>
                                        {isSubmittingSend ? "Processing Deposit..." : "Deposit to Treasury"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </motion.div>
                </div>
            </form>
        </motion.div>
    );
};

export default memo(FormTip);

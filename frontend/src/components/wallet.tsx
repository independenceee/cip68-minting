"use client";

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
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { WalletType } from "@/types";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";

type Props = {
    wallet: WalletType;
    session: Session | null;
};
export default function Wallet({ wallet, session }: Props) {
    const { signIn } = useWallet();
    const [isEnable, setIsEnable] = useState<boolean>(false);
    const [isDownload, setIsDownload] = useState<boolean>(false);

    useEffect(() => {
        (async function () {
            try {
                if (wallet?.isDownload) {
                    setIsDownload(await wallet.isDownload());
                } else {
                    setIsDownload(false);
                }

                if (wallet?.isEnable) {
                    setIsEnable(await wallet.isEnable());
                } else {
                    setIsEnable(false);
                }
            } catch (_) {
                setIsDownload(false);
                setIsEnable(false);
            }
        })();
    }, [wallet]);

    const handleDownload = async () => {
        if (wallet?.downloadApi) {
            if (
                typeof wallet?.downloadApi === "string" &&
                (wallet?.downloadApi.startsWith("http://") || wallet?.downloadApi.startsWith("https://"))
            ) {
                window.open(wallet?.downloadApi, "_blank");
            }
        }
    };

    const handleEnable = async function () {
        if (wallet?.enable && wallet.isEnable) {
            await wallet.enable();
            setIsEnable(true);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all",
                        "bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                        {
                            "cursor-not-allowed opacity-60": !isDownload,
                        },
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                            <Image src={wallet?.image} className="h-7 w-7 rounded-full" alt={wallet?.name || "wallet"} />
                        </div>
                        <div>
                            <p className="font-semibold">{wallet?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {isDownload ? (isEnable ? "Ready to connect" : "Needs browser permission") : "Install to continue"}
                            </p>
                        </div>
                    </div>
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            isDownload
                                ? isEnable
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600",
                        )}
                    >
                        {isDownload ? (isEnable ? "Ready" : "Pending") : "Install"}
                    </span>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isDownload
                            ? isEnable
                                ? "Continue with " + wallet?.name + "?"
                                : "Authorize " + wallet?.name + "?"
                            : "Download " + wallet?.name + "?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isDownload
                            ? isEnable
                                ? "This will connect your wallet to the interface and continue the signing flow."
                                : "Authorize the wallet so it can interact with the application securely."
                            : "Clicking Continue will open the wallet download page."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={
                            isDownload
                                ? isEnable
                                    ? async () => {
                                          await signIn(session, {
                                              icon: wallet.image,
                                              id: wallet.id,
                                              name: wallet.name,
                                              version: wallet.version || "",
                                          });
                                      }
                                    : handleEnable
                                : handleDownload
                        }
                    >
                        {isDownload ? (isEnable ? "Continue" : "Enable") : "Download"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

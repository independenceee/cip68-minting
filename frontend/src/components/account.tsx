"use client";

import { shortenString } from "@/lib/utils";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlineFeedback } from "react-icons/md";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useWallet } from "@/hooks/use-wallet";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { APP_NETWORK } from "@/constants/enviroments";
import Copy from "@/components/copy";
import { Separator } from "@/components/ui/separator";
import { DECIMAL_PLACE } from "@/constants/common";
import { Button } from "@/components/ui/button";

export default function Account() {
    const { wallet, address, browserWallet, stakeAddress } = useWallet();
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (browserWallet) {
                try {
                    const balance = await browserWallet.getLovelace();
                    setBalance(Number(balance));
                } catch (_) {
                    setTimeout(async () => {
                        try {
                            const retryBalance = await browserWallet.getLovelace();
                            setBalance(Number(retryBalance));
                        } catch (_) {}
                    }, 2000);
                }
            } else {
                setBalance(0);
            }
        })();
    }, [browserWallet, wallet]);

    return (
        <Popover>
            <PopoverTrigger className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1.5 pr-4 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 xl:inline-flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 p-1 dark:bg-slate-800">
                    <Image
                        className="h-full w-full rounded-full object-cover"
                        src={wallet?.icon || ""}
                        width={32}
                        height={32}
                        alt={`${wallet?.icon} icon`}
                    />
                </div>
                <div className="text-left">
                    <h2 className="text-[13px] leading-4 text-slate-900 dark:text-white">
                        {address?.slice(0, 12)}...{address?.slice(-4)}
                    </h2>
                    <p className="text-[12px] leading-4 text-slate-500 dark:text-slate-400">
                        <CountUp start={0} end={Number((balance / DECIMAL_PLACE).toFixed(6))} decimals={6} /> ₳
                    </p>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="mt-2 flex min-w-[320px] flex-col gap-4 rounded-[1.25rem] border border-slate-200/80 bg-white p-5 text-slate-700 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                align="end"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                        <Image
                            className="h-full w-full rounded-full object-cover"
                            src={wallet?.icon || ""}
                            alt={`${wallet?.name} icon`}
                            width={32}
                            height={32}
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">{wallet?.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{APP_NETWORK}</p>
                    </div>
                </div>
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Stake:</p>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{shortenString(stakeAddress || "", 11)}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            <Copy className="h-4 w-4" content={stakeAddress || ""} />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Address:</p>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{shortenString(address || "", 10)}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            <Copy className="h-4 w-4" content={address || ""} />
                        </Button>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                        <MdOutlineFeedback className="h-4 w-4" />
                        <Link className="transition hover:text-slate-900 dark:hover:text-white" href="/">
                            Feedback
                        </Link>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <IoIosHelpCircleOutline className="h-4 w-4" />
                        <Link className="transition hover:text-slate-900 dark:hover:text-white" href="/">
                            Help
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button
                        onClick={() => signOut()}
                        className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

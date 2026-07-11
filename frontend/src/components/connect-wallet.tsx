"use client";

import dynamic from "next/dynamic";
import { isNil } from "lodash";
import { useWallet } from "@/hooks/use-wallet";
import Account from "@/components/account";
import { ClipLoader } from "react-spinners";
import { routers } from "@/constants/routers";
import Link from "next/link";

const Wallet = () => {
    const { wallet } = useWallet();

    return (
        <div>
            {!isNil(wallet) ? (
                <Account />
            ) : (
                <section className="hidden xl:block">
                    <Link
                        href={routers.login}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </span>
                        <span>Connect Wallet</span>
                    </Link>
                </section>
            )}
        </div>
    );
};

export const ConnectWallet = dynamic(() => Promise.resolve(Wallet), {
    loading: () => <ClipLoader size={25} />,
    ssr: false,
});

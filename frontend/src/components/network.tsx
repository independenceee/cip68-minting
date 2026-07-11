"use client";

import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

export default function Network({
    image,
    name,
    isActive,
    setNetwork,
}: {
    image: StaticImageData;
    name: string;
    isActive: boolean;
    setNetwork: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <button
            onClick={() => {
                if (isActive) return;
                setNetwork(name.toLowerCase());
            }}
            className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                isActive
                    ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
            )}
        >
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", isActive ? "bg-white/15" : "bg-slate-100 dark:bg-slate-700")}>
                <Image src={image} alt={name} className="h-6 w-6 rounded-full" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{name}</span>
                    <span
                        className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                            isActive ? "bg-white/15" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                        )}
                    >
                        {isActive ? "Live" : "Switch"}
                    </span>
                </div>
                <p className={cn("mt-1 text-[11px]", isActive ? "text-blue-50" : "text-slate-500 dark:text-slate-400")}>Connect to {name} network</p>
            </div>
        </button>
    );
}

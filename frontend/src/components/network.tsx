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
            className={cn("flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-[10px] font-medium transition-all", {
                "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20": isActive,
                "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700":
                    !isActive,
            })}
        >
            <Image src={image} alt="Network" className="h-6 w-6 rounded-full" />
            <span>{name}</span>
        </button>
    );
}

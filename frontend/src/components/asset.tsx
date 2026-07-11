import { images } from "@/public/images";
import Link from "next/link";
import { useState } from "react";

export default function Asset({
    image,
    title,
    routes,
    description,
}: {
    title: string;
    image: string | { src: string };
    routes: string;
    description?: string;
}) {
    const [hasError, setHasError] = useState(false);
    const imageSrc = typeof image === "string" ? image : image.src;

    return (
        <div className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-20px_rgba(37,99,235,0.35)] dark:border-slate-800 dark:bg-slate-900/80">
            <Link className="block" href={routes} aria-label={`Read more about ${title}`}>
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[1.2rem]">
                    {!hasError ? (
                        <img
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={imageSrc || images.nami.src}
                            onError={() => setHasError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Image not available
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 backdrop-blur">
                        CIP68
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="line-clamp-2 text-xl font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                            {title}
                        </h2>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                            View
                        </span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {description || "Browse metadata details and manage the asset experience in a modern workspace."}
                    </p>
                </div>
            </Link>
        </div>
    );
}

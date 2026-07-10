import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export default function Mint({
    image,
    title,
    routes,
    description,
}: {
    title: string;
    image: string | StaticImageData;
    routes: string;
    description?: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-20px_rgba(37,99,235,0.3)] dark:border-slate-800 dark:bg-slate-900/80">
            <Link className="block" href={routes} aria-label={`Read more about ${title}`}>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-[1.1rem]">
                    <img
                        alt={title}
                        loading="lazy"
                        width={1200}
                        height={675}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={typeof image === "string" ? image : image.src}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
                </div>

                <div>
                    <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                        {title}
                    </h2>

                    <p className="mb-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2 font-medium text-blue-600 transition-colors duration-200 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                            <span>Explore flow</span>
                            <svg
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

import { StaticImageData } from "next/image";
import Link from "next/link";

export default function Asset({
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
        <div className="text-card-foreground px-5 py-3 group relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-gray-300 dark:hover:border-white/40 hover:shadow-2xl rounded-xl bg-white dark:bg-slate-900/50 p-6 shadow-md shadow-blue-200/30 dark:shadow-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600">
            <Link className="block" href={routes} aria-label={`Read more about ${title}`}>
                <div className="relative aspect-video overflow-hidden">
                    <img
                        alt={title}
                        loading="lazy"
                        width={1200}
                        height={675}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={typeof image === "string" ? image : image.src}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                                fallback.classList.remove("hidden");
                            }
                        }}
                    />
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Image not available</span>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 lg:text-2xl line-clamp-2 flex items-start">
                        {title}
                    </h2>

                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{description}</p>
                </div>
            </Link>
        </div>
    );
}

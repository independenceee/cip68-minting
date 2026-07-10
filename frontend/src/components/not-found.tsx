import Link from "next/link";
import { routers } from "@/constants/routers";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 dark:bg-slate-950">
            <div className="absolute inset-0 bg-linear-to-br from-blue-100/70 via-white to-violet-100/70 dark:from-slate-900 dark:via-blue-950/80 dark:to-slate-900" />
            <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
                <img
                    src="/images/common/loading.png"
                    alt="Cardano2VN Logo"
                    className="h-[800px] w-[800px] animate-spin-slow object-contain blur-md"
                    draggable={false}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-8 py-12 text-center shadow-[0_24px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:px-12">
                <img className="drop-shadow-2xl animate-bounce-slow" width={150} src="/images/common/logo.png" alt="Cardano2VN Logo" />
                <h1 className="text-5xl font-bold tracking-tight text-blue-600 drop-shadow-md dark:text-blue-300">404 - Page Not Found</h1>
                <p className="max-w-md text-lg text-slate-600 dark:text-slate-300">
                    Oops! The page you are looking for seems to have wandered off. Lets get you back on track!
                </p>

                <Link
                    href={routers.home}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-500 bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 dark:border-blue-400 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M6 4h12"
                        />
                    </svg>
                    Go Home
                </Link>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-blue-100/70 to-transparent opacity-50 dark:from-blue-950/70" />
        </div>
    );
}

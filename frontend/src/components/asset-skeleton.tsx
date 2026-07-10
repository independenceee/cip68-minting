export default function AssetSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-4 aspect-[16/10] rounded-[1.2rem] bg-slate-200 dark:bg-slate-800" />
            <div className="mb-3 h-6 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
                <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-4/6 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
        </div>
    );
}

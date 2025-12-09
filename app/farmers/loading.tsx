import { FarmersTableSkeleton } from "@/components/skeletons";

export default function FarmersLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
                </div>
            </div>
            <FarmersTableSkeleton />
        </div>
    );
}

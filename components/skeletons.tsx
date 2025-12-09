// Skeleton component library for loading states

export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-slate-200 rounded ${className}`}
            aria-hidden="true"
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
}

export function WeatherCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-10 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <Skeleton className="h-3 w-8 mx-auto mb-2" />
                        <Skeleton className="h-5 w-5 mx-auto mb-2 rounded-full" />
                        <Skeleton className="h-4 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-10 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <tr className="border-t border-slate-100">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </td>
            <td className="p-4">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
            </td>
            <td className="p-4">
                <Skeleton className="h-4 w-20" />
            </td>
            <td className="p-4">
                <Skeleton className="h-4 w-24" />
            </td>
            <td className="p-4">
                <div className="flex gap-1">
                    <Skeleton className="h-5 w-10 rounded" />
                    <Skeleton className="h-5 w-10 rounded" />
                </div>
            </td>
            <td className="p-4">
                <Skeleton className="h-5 w-16 rounded-full" />
            </td>
        </tr>
    );
}

export function FarmersTableSkeleton() {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        {["Farmer", "Village/Ward", "Land", "Variety", "Schemes", "Status"].map(h => (
                            <th key={h} className="text-left p-4 font-semibold text-slate-700">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function StatsCardSkeleton() {
    return (
        <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-4 rounded-xl animate-pulse">
            <div className="flex justify-between items-start">
                <div>
                    <Skeleton className="h-3 w-20 mb-2 bg-slate-300" />
                    <Skeleton className="h-8 w-16 bg-slate-300" />
                </div>
                <Skeleton className="h-7 w-7 rounded bg-slate-300" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header Skeleton */}
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <WeatherCardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}

export function AdvisorySkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

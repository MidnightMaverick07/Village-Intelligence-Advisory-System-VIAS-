"use client";

import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to an error reporting service
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-xl mx-auto text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Failed to Load Dashboard
                </h2>
                <p className="text-slate-600 mb-4">
                    We couldn&apos;t load the dashboard data. This might be due to a network issue or our weather service being temporarily unavailable.
                </p>

                <div className="bg-red-50 p-4 rounded-lg mb-6 text-left">
                    <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                    <p className="text-xs text-red-600 font-mono break-all">
                        {error.message || "Unknown error occurred"}
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 bg-paddy-green hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <RefreshCw size={18} />
                        Retry
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

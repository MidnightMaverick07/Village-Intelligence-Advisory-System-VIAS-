"use client";

import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AdvisoryError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Advisory error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 max-w-xl mx-auto text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-orange-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Advisory Service Unavailable
                </h2>
                <p className="text-slate-600 mb-4">
                    We couldn&apos;t fetch the weather data needed for your advisory. Please check your connection and try again.
                </p>

                <div className="bg-orange-50 p-4 rounded-lg mb-6 text-left">
                    <p className="text-sm font-medium text-orange-800 mb-1">What you can do:</p>
                    <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Check your internet connection</li>
                        <li>• Wait a moment and retry</li>
                        <li>• If problem persists, try again later</li>
                    </ul>
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
                        href="/dashboard"
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full text-center">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-600" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Something went wrong!
                        </h1>
                        <p className="text-slate-600 mb-6">
                            An unexpected error occurred. Please try again or contact support if the problem persists.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-slate-400 mb-4">
                                Error ID: {error.digest}
                            </p>
                        )}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={reset}
                                className="flex items-center gap-2 bg-paddy-green hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Home size={16} />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}

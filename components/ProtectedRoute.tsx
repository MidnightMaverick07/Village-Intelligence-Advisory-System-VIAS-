"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
    requireRole?: "farmer" | "officer" | "admin";
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Check role if required
    useEffect(() => {
        if (!isLoading && isAuthenticated && requireRole && user) {
            if (user.role !== requireRole && user.role !== "admin") {
                router.push("/unauthorized");
            }
        }
    }, [isLoading, isAuthenticated, requireRole, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-paddy-green animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    if (requireRole && user && user.role !== requireRole && user.role !== "admin") {
        return null; // Will redirect
    }

    return <>{children}</>;
}

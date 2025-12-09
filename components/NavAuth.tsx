"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

interface NavAuthProps {
    mobile?: boolean;
}

export default function NavAuth({ mobile = false }: NavAuthProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { t } = useLanguage();

    if (isLoading) {
        return (
            <div className="p-2">
                <Loader2 size={mobile ? 20 : 18} className="animate-spin opacity-60" />
            </div>
        );
    }

    if (isAuthenticated && user) {
        return (
            <Link
                href="/profile"
                className={`flex items-center gap-2 ${mobile ? 'p-2' : 'px-3 py-2'} rounded-lg hover:bg-white/10 transition-colors`}
                title={`Logged in as ${user.name}`}
            >
                <div className="bg-white/20 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0)}
                </div>
                {!mobile && <span className="text-sm">{user.name.split(' ')[0]}</span>}
            </Link>
        );
    }

    return (
        <Link
            href="/login"
            className={`flex items-center gap-2 ${mobile ? 'p-2' : 'px-3 py-2 bg-white/10'} rounded-lg hover:bg-white/20 transition-colors`}
        >
            <LogIn size={mobile ? 20 : 18} />
            {!mobile && <span>{t('login')}</span>}
        </Link>
    );
}

"use client";

import Link from "next/link";
import { LayoutDashboard, Compass, Users, ShieldCheck, Calculator, MessageSquare, Bug } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NavLinksProps {
    mobile?: boolean;
}

export default function NavLinks({ mobile = false }: NavLinksProps) {
    const { t } = useLanguage();

    const links = [
        { href: "/dashboard", icon: LayoutDashboard, label: t('dashboard') },
        { href: "/advisory", icon: Compass, label: t('advisory') },
        { href: "/pest-scan", icon: Bug, label: t('pestScan') || 'Pest Scan' },
        { href: "/expenses", icon: Calculator, label: t('expenses') },
        { href: "/farmers", icon: Users, label: t('farmers') },
        { href: "/schemes", icon: ShieldCheck, label: t('schemes') },
    ];

    if (mobile) {
        return (
            <>
                {links.slice(0, 4).map(({ href, icon: Icon }) => (
                    <Link key={href} href={href} className="p-2 rounded-lg hover:bg-white/10">
                        <Icon size={20} />
                    </Link>
                ))}
            </>
        );
    }

    return (
        <>
            {links.map(({ href, icon: Icon, label }) => (
                <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <Icon size={18} />
                    <span>{label}</span>
                </Link>
            ))}
        </>
    );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
import { getVillageKeys } from "@/data/villages";

export default function VillageSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlVillage = searchParams.get("village");

    // Get the village from URL or localStorage, fallback to "Bhatar"
    const currentVillage = urlVillage ||
        (typeof window !== 'undefined' ? localStorage.getItem('selectedVillage') : null) ||
        "Bhatar";

    // Sync URL with localStorage on mount
    useEffect(() => {
        const savedVillage = localStorage.getItem('selectedVillage');

        // If URL doesn't have a village but localStorage does, update URL
        if (!urlVillage && savedVillage) {
            router.replace(`/dashboard?village=${savedVillage}`);
        }

        // If URL has a village, save it to localStorage
        if (urlVillage) {
            localStorage.setItem('selectedVillage', urlVillage);
        }
    }, [urlVillage, router]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const village = e.target.value;
        // Save to localStorage for persistence
        localStorage.setItem('selectedVillage', village);
        router.push(`/dashboard?village=${village}`);
    };

    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <MapPin className="text-green-600" size={20} />
            <select
                value={currentVillage}
                onChange={handleChange}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
                {getVillageKeys().map((v) => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>
        </div>
    );
}

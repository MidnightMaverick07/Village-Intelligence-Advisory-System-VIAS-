"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div
            className="flex items-center overflow-hidden"
            style={{
                border: '2px solid white',
                borderRadius: '6px',
                height: '32px'
            }}
        >
            <button
                onClick={() => setLanguage("en")}
                className="h-full px-3 text-sm font-medium transition-colors"
                style={{
                    backgroundColor: language === "en" ? 'white' : 'transparent',
                    color: language === "en" ? '#1B5E20' : 'white',
                    minWidth: '60px'
                }}
                title="View in English"
            >
                English
            </button>
            <div style={{ width: '1px', height: '100%', backgroundColor: 'white' }}></div>
            <button
                onClick={() => setLanguage("bn")}
                className="h-full px-3 text-sm font-medium transition-colors"
                style={{
                    backgroundColor: language === "bn" ? 'white' : 'transparent',
                    color: language === "bn" ? '#1B5E20' : 'white',
                    minWidth: '60px'
                }}
                title="বাংলায় দেখুন"
            >
                বাংলা
            </button>
        </div>
    );
}

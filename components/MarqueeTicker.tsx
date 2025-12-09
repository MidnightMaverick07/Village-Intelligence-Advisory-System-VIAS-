"use client";

import { useState, useEffect } from "react";

export default function MarqueeTicker() {
    const [isVisible, setIsVisible] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    // Check if already dismissed in this session
    useEffect(() => {
        const wasDismissed = sessionStorage.getItem('alertDismissed');
        if (wasDismissed === 'true') {
            setDismissed(true);
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setDismissed(true);
        sessionStorage.setItem('alertDismissed', 'true');
    };

    const alerts = [
        "⚠️ জরুরি ঘোষণা: বাঁকুড়া জেলায় ভারী বৃষ্টির সতর্কতা। | Important Alert: Heavy rain warning for Bankura district.",
        "📢 নতুন MSP হার ঘোষণা - ধান ₹2,183/quintal | New MSP Rate Announced - Paddy ₹2,183/quintal",
        "🌾 PM-KISAN 16th Installment: Check your status now | পিএম-কিষাণ ১৬তম কিস্তি: আপনার স্ট্যাটাস দেখুন",
    ];

    if (!isVisible || dismissed) {
        return null;
    }

    return (
        <div
            className="py-2 overflow-hidden no-print"
            style={{ backgroundColor: '#F57C00', color: '#212121' }}
        >
            <div className="container mx-auto px-4 flex items-center gap-4">
                <span
                    className="px-3 py-1 rounded text-sm font-bold whitespace-nowrap"
                    style={{ backgroundColor: '#C62828', color: 'white' }}
                >
                    ⚠️ Alert
                </span>
                <div className="relative flex-1 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap font-medium" style={{ color: '#212121' }}>
                        {alerts.map((alert, idx) => (
                            <span key={idx} className="mx-8">
                                {alert}
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    className="text-xl font-bold hover:opacity-70 px-2"
                    style={{ color: '#212121' }}
                    onClick={handleClose}
                    aria-label="Close alert"
                    title="Close alert"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

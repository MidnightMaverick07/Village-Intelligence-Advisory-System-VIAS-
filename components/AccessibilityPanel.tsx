"use client";

import { useState } from "react";
import { Settings, Type, Sun, Zap, MessageSquare, X, Check } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function AccessibilityPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, setFontSize, toggleHighContrast, toggleReduceMotion, toggleTextLabels } = useAccessibility();

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                aria-label="Accessibility Settings"
                title="Accessibility Settings"
            >
                <Settings size={22} />
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Panel Content */}
                    <div className="relative bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Settings size={20} /> Accessibility
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Font Size */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Type size={18} className="text-slate-600" />
                                    <span className="font-medium text-slate-700">Text Size (অক্ষরের আকার)</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { value: 'small', label: 'A', size: 'text-sm' },
                                        { value: 'normal', label: 'A', size: 'text-base' },
                                        { value: 'large', label: 'A', size: 'text-lg' },
                                        { value: 'xlarge', label: 'A', size: 'text-xl' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setFontSize(opt.value as any)}
                                            className={`p-3 rounded-xl border-2 transition-colors ${settings.fontSize === opt.value
                                                    ? 'border-paddy-green bg-green-50 text-paddy-green'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            aria-label={`${opt.value} text size`}
                                        >
                                            <span className={`${opt.size} font-bold`}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* High Contrast */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Sun size={18} className="text-slate-600" />
                                    <div>
                                        <p className="font-medium text-slate-700">High Contrast</p>
                                        <p className="text-xs text-slate-500">উচ্চ বৈপরীত্য মোড</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleHighContrast}
                                    className={`w-14 h-8 rounded-full transition-colors ${settings.highContrast ? 'bg-paddy-green' : 'bg-slate-300'
                                        }`}
                                    aria-label="Toggle high contrast"
                                    role="switch"
                                    aria-checked={settings.highContrast}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                                        }`}></div>
                                </button>
                            </div>

                            {/* Reduce Motion */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Zap size={18} className="text-slate-600" />
                                    <div>
                                        <p className="font-medium text-slate-700">Reduce Motion</p>
                                        <p className="text-xs text-slate-500">অ্যানিমেশন বন্ধ করুন</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleReduceMotion}
                                    className={`w-14 h-8 rounded-full transition-colors ${settings.reduceMotion ? 'bg-paddy-green' : 'bg-slate-300'
                                        }`}
                                    aria-label="Toggle reduce motion"
                                    role="switch"
                                    aria-checked={settings.reduceMotion}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.reduceMotion ? 'translate-x-7' : 'translate-x-1'
                                        }`}></div>
                                </button>
                            </div>

                            {/* Text Labels for Emojis */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18} className="text-slate-600" />
                                    <div>
                                        <p className="font-medium text-slate-700">Show Text Labels</p>
                                        <p className="text-xs text-slate-500">ইমোজির পরিবর্তে টেক্সট দেখান</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTextLabels}
                                    className={`w-14 h-8 rounded-full transition-colors ${settings.showTextLabels ? 'bg-paddy-green' : 'bg-slate-300'
                                        }`}
                                    aria-label="Toggle text labels for emojis"
                                    role="switch"
                                    aria-checked={settings.showTextLabels}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.showTextLabels ? 'translate-x-7' : 'translate-x-1'
                                        }`}></div>
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-xs text-slate-500 mb-2">Preview:</p>
                                <p className="text-slate-700">
                                    {settings.showTextLabels ? '[Rice]' : '🌾'} Welcome to RiceAdvisor
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {settings.showTextLabels ? '[Weather]' : '☀️'} Current temperature: 28°C
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-6 py-3 bg-paddy-green hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> Done
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

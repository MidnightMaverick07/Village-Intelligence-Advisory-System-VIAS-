"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";
import { getTerm, GlossaryTerm } from "@/data/glossary";

interface TooltipProps {
    term: string; // glossary key
    children?: React.ReactNode; // text to display
    inline?: boolean; // inline or block
}

export default function Tooltip({ term, children, inline = true }: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const glossaryTerm = getTerm(term);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!glossaryTerm) {
        return <span>{children || term}</span>;
    }

    const Wrapper = inline ? 'span' : 'div';

    return (
        <Wrapper className="relative inline-flex items-center gap-1" ref={tooltipRef}>
            <span
                className="border-b border-dashed border-slate-400 cursor-help"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
            >
                {children || glossaryTerm.term}
            </span>
            <HelpCircle
                size={14}
                className="text-slate-400 cursor-pointer hover:text-paddy-green"
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white p-4 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-white md:hidden"
                    >
                        <X size={16} />
                    </button>

                    {/* Term */}
                    <p className="font-bold text-green-400 mb-1">{glossaryTerm.term}</p>
                    <p className="text-xs text-green-300 mb-2">{glossaryTerm.termBn}</p>

                    {/* Definition */}
                    <p className="text-sm text-slate-200 mb-2">{glossaryTerm.definition}</p>
                    <p className="text-xs text-slate-400 italic">{glossaryTerm.definitionBn}</p>

                    {/* Conversion if available */}
                    {glossaryTerm.conversion && (
                        <div className="mt-3 pt-2 border-t border-slate-600">
                            <p className="text-xs text-amber-400 font-medium">📐 Conversion:</p>
                            <p className="text-sm text-white font-mono">{glossaryTerm.conversion.formula}</p>
                        </div>
                    )}

                    {/* Arrow */}
                    <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-800"></div>
                </div>
            )}
        </Wrapper>
    );
}

// Quick unit display with conversion on hover
interface UnitDisplayProps {
    value: number;
    unit: 'quintal' | 'katha' | 'acre' | 'bigha';
    showConversion?: boolean;
}

export function UnitDisplay({ value, unit, showConversion = true }: UnitDisplayProps) {
    const [showConverted, setShowConverted] = useState(false);

    const conversions: Record<string, { converted: number; unit: string }> = {
        quintal: { converted: value * 100, unit: 'kg' },
        katha: { converted: value * 66.89, unit: 'sq m' },
        acre: { converted: value * 3.03, unit: 'bigha' },
        bigha: { converted: value * 0.33, unit: 'acre' },
    };

    const conv = conversions[unit];

    return (
        <span
            className="cursor-pointer"
            onClick={() => showConversion && setShowConverted(!showConverted)}
            title={showConversion ? "Click to convert" : undefined}
        >
            {showConverted ? (
                <span className="text-green-600 font-medium">
                    {conv.converted.toFixed(1)} {conv.unit}
                </span>
            ) : (
                <span>
                    {value} {unit}{value > 1 ? 's' : ''}
                </span>
            )}
            {showConversion && (
                <span className="text-xs text-slate-400 ml-1">🔄</span>
            )}
        </span>
    );
}

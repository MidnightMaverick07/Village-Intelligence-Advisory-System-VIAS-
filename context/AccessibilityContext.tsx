"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilitySettings {
    fontSize: 'small' | 'normal' | 'large' | 'xlarge';
    highContrast: boolean;
    reduceMotion: boolean;
    showTextLabels: boolean; // Show text instead of emojis
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    setFontSize: (size: AccessibilitySettings['fontSize']) => void;
    toggleHighContrast: () => void;
    toggleReduceMotion: () => void;
    toggleTextLabels: () => void;
    getFontSizeClass: () => string;
}

const defaultSettings: AccessibilitySettings = {
    fontSize: 'normal',
    highContrast: false,
    reduceMotion: false,
    showTextLabels: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
    const [mounted, setMounted] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('accessibility');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse accessibility settings');
            }
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('accessibility', JSON.stringify(settings));

            // Apply to document
            const root = document.documentElement;

            // Font size
            root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
            switch (settings.fontSize) {
                case 'small': root.style.fontSize = '14px'; break;
                case 'normal': root.style.fontSize = '16px'; break;
                case 'large': root.style.fontSize = '18px'; break;
                case 'xlarge': root.style.fontSize = '20px'; break;
            }

            // High contrast
            if (settings.highContrast) {
                root.classList.add('high-contrast');
            } else {
                root.classList.remove('high-contrast');
            }

            // Reduce motion
            if (settings.reduceMotion) {
                root.classList.add('reduce-motion');
            } else {
                root.classList.remove('reduce-motion');
            }
        }
    }, [settings, mounted]);

    const setFontSize = (size: AccessibilitySettings['fontSize']) => {
        setSettings(prev => ({ ...prev, fontSize: size }));
    };

    const toggleHighContrast = () => {
        setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
    };

    const toggleReduceMotion = () => {
        setSettings(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }));
    };

    const toggleTextLabels = () => {
        setSettings(prev => ({ ...prev, showTextLabels: !prev.showTextLabels }));
    };

    const getFontSizeClass = () => {
        switch (settings.fontSize) {
            case 'small': return 'text-sm';
            case 'large': return 'text-lg';
            case 'xlarge': return 'text-xl';
            default: return 'text-base';
        }
    };

    return (
        <AccessibilityContext.Provider value={{
            settings,
            setFontSize,
            toggleHighContrast,
            toggleReduceMotion,
            toggleTextLabels,
            getFontSizeClass,
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
}

// Emoji with text fallback component
interface EmojiTextProps {
    emoji: string;
    text: string;
    className?: string;
}

export function EmojiText({ emoji, text, className = '' }: EmojiTextProps) {
    const { settings } = useAccessibility();

    if (settings.showTextLabels) {
        return <span className={`font-medium ${className}`} aria-label={text}>[{text}]</span>;
    }

    return <span className={className} role="img" aria-label={text}>{emoji}</span>;
}

// Safe emoji component that always has aria-label
interface AccessibleEmojiProps {
    emoji: string;
    label: string;
    className?: string;
}

export function AccessibleEmoji({ emoji, label, className = '' }: AccessibleEmojiProps) {
    return (
        <span role="img" aria-label={label} className={className}>
            {emoji}
        </span>
    );
}

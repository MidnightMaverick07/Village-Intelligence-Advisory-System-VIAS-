"use client";

import { useAccessibility } from "@/context/AccessibilityContext";

export default function FontSizeControls() {
    const { settings, setFontSize } = useAccessibility();

    const sizes: Array<'small' | 'normal' | 'large' | 'xlarge'> = ['small', 'normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);

    const increase = () => {
        if (currentIndex < sizes.length - 1) {
            setFontSize(sizes[currentIndex + 1]);
        }
    };

    const decrease = () => {
        if (currentIndex > 0) {
            setFontSize(sizes[currentIndex - 1]);
        }
    };

    const buttonStyle = {
        width: '32px',
        height: '32px',
        backgroundColor: 'white',
        color: '#1B5E20',
        border: '2px solid white',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={decrease}
                disabled={currentIndex === 0}
                style={{
                    ...buttonStyle,
                    opacity: currentIndex === 0 ? 0.5 : 1,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                }}
                aria-label="Decrease font size"
                title="ছোট করুন | Decrease"
            >
                A-
            </button>
            <button
                onClick={increase}
                disabled={currentIndex === sizes.length - 1}
                style={{
                    ...buttonStyle,
                    opacity: currentIndex === sizes.length - 1 ? 0.5 : 1,
                    cursor: currentIndex === sizes.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                }}
                aria-label="Increase font size"
                title="বড় করুন | Increase"
            >
                A+
            </button>
        </div>
    );
}

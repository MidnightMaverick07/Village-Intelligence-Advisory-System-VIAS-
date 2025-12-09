import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./utils/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // WB Government Color Palette
                'wb-green': '#1B5E20',        // Primary - Nav, Footer
                'paper-white': '#F9FAFB',     // Background
                'harvest-gold': '#F57C00',    // Action buttons
                'charcoal': '#212121',        // Text
                'biswa-blue': '#0D47A1',      // Accent, links
                'profit-green': '#2E7D32',    // Price UP
                'loss-red': '#C62828',        // Price DOWN

                // Legacy (for backward compatibility)
                'paddy-green': '#1B5E20',
                'soil-brown': '#854d0e',
                'sky-blue': '#38bdf8',
                'alert-red': '#C62828',
                'warning-yellow': '#F57C00',
            },
            fontFamily: {
                'bengali': ['"Noto Sans Bengali"', 'sans-serif'],
            },
            lineHeight: {
                'bengali': '1.6',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'marquee': 'marquee 30s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;

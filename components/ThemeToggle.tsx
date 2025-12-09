"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    mobile?: boolean;
}

export default function ThemeToggle({ mobile = false }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`${mobile ? 'p-2' : 'p-2'} rounded-lg hover:bg-white/10 transition-colors`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === "light" ? (
                <Moon size={mobile ? 20 : 18} />
            ) : (
                <Sun size={mobile ? 20 : 18} />
            )}
        </button>
    );
}

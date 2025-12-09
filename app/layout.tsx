import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import NavAuth from "@/components/NavAuth";
import LanguageToggle from "@/components/LanguageToggle";
import NavLinks from "@/components/NavLinks";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import MarqueeTicker from "@/components/MarqueeTicker";
import FontSizeControls from "@/components/FontSizeControls";

const notoBengali = Noto_Sans_Bengali({
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "West Bengal Agriculture Portal | পশ্চিমবঙ্গ কৃষি পোর্টাল",
    description: "Smart climate-adaptive farming for smallholder paddy farmers in West Bengal",
    keywords: ["rice farming", "West Bengal", "climate advisor", "paddy", "agriculture", "India", "কৃষি"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${notoBengali.className} leading-relaxed`}>
                <ThemeProvider>
                    <LanguageProvider>
                        <AccessibilityProvider>
                            <AuthProvider>
                                {/* Government-Style Navigation Bar */}
                                <nav className="text-white shadow-lg sticky top-0 z-50 no-print" style={{ backgroundColor: '#1B5E20' }}>
                                    <div className="container mx-auto px-4">
                                        <div className="flex justify-between items-center py-3">
                                            {/* Logo with Emblem */}
                                            <Link href="/" className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">🌾</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg leading-tight">West Bengal Agriculture Portal</p>
                                                    <p className="text-sm opacity-90">পশ্চিমবঙ্গ কৃষি পোর্টাল</p>
                                                </div>
                                            </Link>

                                            {/* Right Side Controls */}
                                            <div className="flex items-center gap-3">
                                                {/* Bilingual Toggle */}
                                                <LanguageToggle />

                                                {/* A+/A- Font Size Controls */}
                                                <FontSizeControls />

                                                {/* Auth */}
                                                <NavAuth />
                                            </div>
                                        </div>

                                        {/* Navigation Links Row */}
                                        <div className="hidden md:flex gap-1 py-2 border-t border-white/20">
                                            <NavLinks />
                                        </div>
                                    </div>
                                </nav>

                                {/* Marquee Ticker - Government Style */}
                                <MarqueeTicker />

                                {/* Mobile Navigation */}
                                <div className="md:hidden border-t border-white/20 no-print" style={{ backgroundColor: '#1B5E20' }}>
                                    <div className="container mx-auto px-4 py-2 flex justify-center gap-2">
                                        <NavLinks mobile />
                                    </div>
                                </div>

                                <main className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
                                    {children}
                                </main>

                                <AccessibilityPanel />

                                {/* Government-Style Footer */}
                                <footer className="text-white py-6 no-print" style={{ backgroundColor: '#1B5E20' }}>
                                    <div className="container mx-auto px-4">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="text-center md:text-left">
                                                <p className="font-bold">West Bengal Agriculture Portal</p>
                                                <p className="text-sm opacity-80">পশ্চিমবঙ্গ কৃষি পোর্টাল</p>
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                                <Link href="#" className="hover:underline">Disclaimer | দায়মুক্তি</Link>
                                                <Link href="#" className="hover:underline">Contact Us | যোগাযোগ</Link>
                                            </div>
                                        </div>
                                        <p className="text-xs text-center mt-4 opacity-60">
                                            Weather data: Open-Meteo • Developed for West Bengal Farmers
                                        </p>
                                    </div>
                                </footer>
                            </AuthProvider>
                        </AccessibilityProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html >
    );
}

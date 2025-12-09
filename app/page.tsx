import Link from "next/link";
import { LayoutDashboard, Compass, Users, ShieldCheck, BookOpen, CloudRain, TrendingUp, AlertTriangle, Calendar, Sprout } from "lucide-react";

export default function HomePage() {
    const features = [
        {
            icon: <LayoutDashboard className="text-sky-600" size={28} />,
            title: "Village Dashboard",
            description: "Real-time weather, market prices, pest alerts, and crop status for your village",
            link: "/dashboard",
            color: "bg-sky-50 border-sky-100"
        },
        {
            icon: <Compass className="text-green-600" size={28} />,
            title: "Field Advisory",
            description: "Get personalized risk assessment and recommendations based on your field conditions",
            link: "/advisory",
            color: "bg-green-50 border-green-100"
        },
        {
            icon: <Users className="text-orange-600" size={28} />,
            title: "Farmer Directory",
            description: "View registered farmers, their crops, and scheme enrollment status",
            link: "/farmers",
            color: "bg-orange-50 border-orange-100"
        },
        {
            icon: <ShieldCheck className="text-indigo-600" size={28} />,
            title: "Government Schemes",
            description: "PM-KISAN, PMFBY, KCC and other schemes with deadlines and application links",
            link: "/schemes",
            color: "bg-indigo-50 border-indigo-100"
        },
        {
            icon: <BookOpen className="text-purple-600" size={28} />,
            title: "Knowledge Base",
            description: "Disease identification guides, pest management, and video tutorials",
            link: "/knowledge",
            color: "bg-purple-50 border-purple-100"
        }
    ];

    const highlights = [
        { icon: <CloudRain size={20} />, text: "7-Day Weather Forecast" },
        { icon: <AlertTriangle size={20} />, text: "9 Risk Types Detected" },
        { icon: <TrendingUp size={20} />, text: "Live Mandi Prices" },
        { icon: <Calendar size={20} />, text: "Crop Calendar & Fertilizer Schedule" },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-paddy-green via-green-600 to-emerald-700 text-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                            <Sprout size={20} />
                            <span className="text-sm font-medium">West Bengal Edition</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Village Intelligence & Climate Advisor
                        </h1>
                        <p className="text-xl text-green-100 mb-8">
                            Smart farming for smallholder paddy farmers. Get real-time weather alerts,
                            pest risk detection, market prices, and personalized advisories in one place.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/dashboard"
                                className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
                            >
                                🌾 View Dashboard
                            </Link>
                            <Link
                                href="/advisory"
                                className="bg-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-900 transition-colors border border-green-500"
                            >
                                📋 Get Advisory
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights Bar */}
            <section className="bg-white border-b border-slate-100 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-slate-600">
                                <span className="text-paddy-green">{item.icon}</span>
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
                        Everything You Need for Smart Farming
                    </h2>
                    <p className="text-slate-600 text-center mb-10">
                        Comprehensive tools designed for the needs of West Bengal rice farmers
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {features.map((feature, idx) => (
                            <Link
                                key={idx}
                                href={feature.link}
                                className={`p-6 rounded-2xl border-2 ${feature.color} hover:shadow-lg transition-all hover:-translate-y-1`}
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm">{feature.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Risk Detection Section */}
            <section className="bg-slate-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-6">Advanced Risk Detection Engine</h2>
                        <p className="text-slate-300 mb-8">
                            Our multi-risk detection system analyzes weather data alongside crop stage
                            to predict 9 types of risks including diseases, pests, and weather stress.
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
                            {[
                                { icon: "🍄", name: "Blast" },
                                { icon: "🟤", name: "Brown Spot" },
                                { icon: "🦠", name: "Sheath Blight" },
                                { icon: "🪲", name: "BPH" },
                                { icon: "🐛", name: "Stem Borer" },
                                { icon: "☀️", name: "Drought" },
                                { icon: "🌊", name: "Flood" },
                                { icon: "🥶", name: "Cold Stress" },
                                { icon: "🔥", name: "Heat Stress" },
                            ].map((risk, idx) => (
                                <div key={idx} className="bg-white/10 p-3 rounded-xl">
                                    <span className="text-2xl block mb-1">{risk.icon}</span>
                                    <span className="text-xs">{risk.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">
                        Ready to Make Data-Driven Farming Decisions?
                    </h2>
                    <p className="text-slate-600 mb-8">
                        Join thousands of farmers using RiceAdvisor for smarter paddy cultivation
                    </p>
                    <Link
                        href="/advisory"
                        className="inline-flex items-center gap-2 bg-paddy-green text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg"
                    >
                        <Compass size={24} />
                        Get Your Field Advisory Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

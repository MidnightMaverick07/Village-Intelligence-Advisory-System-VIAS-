import { CloudRain, ThermometerSun, AlertTriangle, Newspaper, TrendingUp, CalendarDays, Users, ShieldCheck, Droplets, Wind, Award, BookOpen, Sprout } from "lucide-react";
import { getFarmersByVillage, getVillageStats, getPestReports, getTopPerformers } from "@/data/mockVillage";
import { getUrgentSchemes, getPaddyMSP } from "@/data/governmentSchemes";
import { getCurrentActivity, getUpcomingActivities, getFertilizerDue } from "@/data/cropCalendar";
import Link from "next/link";
import VillageSelector from "./village-selector";
import { VILLAGES } from "@/data/villages";

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
}

async function getNews(): Promise<NewsItem[]> {
    try {
        const res = await fetch("https://eng.ruralvoice.in/rss/category/state", { next: { revalidate: 3600 } });
        const text = await res.text();
        const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
        return items.slice(0, 4).map(item => {
            const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "News Update";
            const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "#";
            const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
            return { title, link, pubDate };
        });
    } catch (error) {
        console.error("News fetch error:", error);
        return [];
    }
}

async function getWeather(lat: number, long: number) {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=rain_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=7&timezone=auto`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) throw new Error("Failed to fetch weather");
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function DashboardPage({ searchParams }: { searchParams: { village?: string } }) {
    const villageKey = searchParams.village || "Bhatar";
    // @ts-ignore
    const villageData = VILLAGES[villageKey] || VILLAGES["Bhatar"];

    const [weather, news] = await Promise.all([
        getWeather(villageData.lat, villageData.long),
        getNews()
    ]);

    const current = weather?.current || { temperature_2m: 32, relative_humidity_2m: 82, rain: 0, wind_speed_10m: 12 };
    const daily = weather?.daily || { time: [], temperature_2m_max: [], temperature_2m_min: [], rain_sum: [], uv_index_max: [] };

    // Get village statistics
    const stats = getVillageStats(villageKey);
    const pestReports = getPestReports(villageKey);
    const topPerformers = getTopPerformers(villageKey, 3);
    const urgentSchemes = getUrgentSchemes();
    const msp = getPaddyMSP();

    // Calculate average days since sowing for crop calendar
    const farmers = getFarmersByVillage(villageKey);
    const avgDaysSinceSowing = farmers.length > 0
        ? Math.round(farmers.reduce((sum, f) => {
            const days = Math.ceil((new Date().getTime() - f.sowingDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0) / farmers.length)
        : 60;

    const currentActivity = getCurrentActivity(avgDaysSinceSowing);
    const upcomingActivities = getUpcomingActivities(avgDaysSinceSowing, 3);
    const fertilizerDue = getFertilizerDue(avgDaysSinceSowing);

    // Simulated Market Prices
    const basePrice = msp?.mspPerQuintal || 2183;
    const fluctuation = Math.floor(Math.random() * 50) - 25;
    const currentPrice = basePrice + fluctuation;

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">🌾 {villageData.name}</h1>
                        <VillageSelector />
                    </div>
                    <p className="text-slate-600">{villageData.district}, West Bengal</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                        <p className="text-green-600 font-medium">{stats.totalFarmers} Farmers</p>
                    </div>
                    <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        <p className="text-blue-600 font-medium">{stats.totalAcreage} Acres</p>
                    </div>
                    {stats.activeAlerts > 0 && (
                        <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                            <p className="text-red-600 font-medium">{stats.activeAlerts} Alerts</p>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Weather Forecast Card - Enhanced */}
                <div className="p-4 rounded-xl text-white lg:col-span-2" style={{ backgroundColor: '#0D47A1' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <CloudRain size={20} />
                        <h3 className="font-bold">Weather Forecast | আবহাওয়ার পূর্বাভাস</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">☁️</div>
                        <div>
                            <p className="text-3xl font-bold">{current.temperature_2m}°C</p>
                            <p className="text-sm opacity-80">{Math.round(daily.temperature_2m_min?.[0] || 20)}°C - {Math.round(daily.temperature_2m_max?.[0] || 32)}°C</p>
                        </div>
                    </div>
                    <div className="mt-3 p-2 bg-white/20 rounded-lg">
                        <p className="text-sm font-medium">
                            {current.rain > 0
                                ? "আজ বৃষ্টির সম্ভাবনা | Chance of rain today"
                                : current.relative_humidity_2m > 80
                                    ? "কীটনাশক প্রয়োগের জন্য উপযুক্ত নয় | Not ideal for spraying"
                                    : "কীটনাশক প্রয়োগের জন্য উপযুক্ত | Ideal for spraying pesticides"
                            }
                        </p>
                    </div>
                </div>

                {/* Rain & Humidity - Larger Numbers */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-xl text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-teal-100 text-sm">আর্দ্রতা | Humidity</p>
                            <p className="text-4xl font-bold">{current.relative_humidity_2m}%</p>
                        </div>
                        <Droplets size={28} className="opacity-80" />
                    </div>
                    {current.relative_humidity_2m > 80 && (
                        <p className="text-xs mt-2 bg-white/20 px-2 py-1 rounded">⚠️ রোগের ঝুঁকি বেশি | High disease risk</p>
                    )}
                </div>

                {/* MSP Rate */}
                <div className="p-4 rounded-xl text-white" style={{ backgroundColor: '#1B5E20' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-green-100 text-sm">MSP Rate | ধানের দাম</p>
                            <p className="text-3xl font-bold">₹{msp?.mspPerQuintal || 2183}</p>
                        </div>
                        <TrendingUp size={28} className="opacity-80" />
                    </div>
                    <p className="text-xs mt-2 bg-white/20 px-2 py-1 rounded inline-block">
                        🔼 +₹{msp?.increaseFromLastYear || 117} গত বছরের তুলনায়
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 7-Day Forecast */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <CloudRain className="text-sky-500" /> 7-Day Weather Forecast
                    </h2>
                    <div className="grid grid-cols-7 gap-2">
                        {daily.time.map((date: string, i: number) => (
                            <div key={date} className="text-center p-2 rounded-lg bg-gradient-to-b from-slate-50 to-white border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium">
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                                <p className="text-lg font-bold text-slate-700">{Math.round(daily.temperature_2m_max[i])}°</p>
                                <p className="text-xs text-slate-400">{Math.round(daily.temperature_2m_min[i])}°</p>
                                <div className="mt-1 flex items-center justify-center gap-1">
                                    <Droplets size={12} className="text-sky-400" />
                                    <span className="text-xs text-sky-600">{daily.rain_sum[i]}mm</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mandi Prices - Card Layout */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
                            <TrendingUp className="text-wb-green" /> Mandi Prices | মান্ডির দাম
                        </h2>
                        <span className="text-xs text-slate-400">🕐 Updates hourly</span>
                    </div>

                    {/* Card Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'Potato', nameBn: 'আলু', emoji: '🥔', price: 14, lastDay: 12, mandi: 'Memari', mandiBn: 'মেমারি', dist: 18, distLevel: 'near', unit: '/kg', unitBn: 'কেজি' },
                            { name: 'Tomato', nameBn: 'টমেটো', emoji: '🍅', price: 8, lastDay: 10, mandi: 'Memari', mandiBn: 'মেমারি', dist: 18, distLevel: 'near', unit: '/kg', unitBn: 'কেজি' },
                            { name: 'Onion', nameBn: 'পেঁয়াজ', emoji: '🧅', price: 35, lastDay: 30, mandi: 'Bardhaman', mandiBn: 'বর্ধমান', dist: 25, distLevel: 'medium', unit: '/kg', unitBn: 'কেজি' },
                            { name: 'Rice (Paddy)', nameBn: 'ধান', emoji: '🌾', price: currentPrice, lastDay: currentPrice - 15, mandi: 'Nabadwip', mandiBn: 'নবদ্বীপ', dist: 45, distLevel: 'far', unit: '/quintal', unitBn: 'কুইন্টাল' },
                            { name: 'Cauliflower', nameBn: 'ফুলকপি', emoji: '🥬', price: 25, lastDay: 28, mandi: 'Katwa', mandiBn: 'কাটোয়া', dist: 32, distLevel: 'medium', unit: '/kg', unitBn: 'কেজি' },
                            { name: 'Cabbage', nameBn: 'বাঁধাকপি', emoji: '🥬', price: 18, lastDay: 18, mandi: 'Galsi', mandiBn: 'গালসী', dist: 15, distLevel: 'near', unit: '/kg', unitBn: 'কেজি' },
                        ].map((item, idx) => {
                            const trend = item.price > item.lastDay ? 'up' : item.price < item.lastDay ? 'down' : 'stable';
                            const distColor = item.distLevel === 'near' ? '🟢' : item.distLevel === 'medium' ? '🟡' : '🔴';

                            return (
                                <div key={idx} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Crop Image/Emoji */}
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 text-center">
                                        <span className="text-5xl">{item.emoji}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="p-3">
                                        <p className="text-xs text-slate-500">{item.name}</p>
                                        <p className="font-bold" style={{ color: '#212121' }}>{item.nameBn}</p>

                                        <div className="flex items-center gap-2 mt-2">
                                            <div>
                                                <span className="text-2xl font-bold" style={{ color: '#212121' }}>
                                                    ₹{item.price}
                                                </span>
                                                <span className="text-sm text-slate-600">{item.unit}</span>
                                            </div>
                                            <span className={`text-lg`} style={{ color: trend === 'up' ? '#2E7D32' : trend === 'down' ? '#C62828' : '#9CA3AF' }}>
                                                {trend === 'up' ? '🔼' : trend === 'down' ? '🔽' : '➡️'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">({item.unitBn})</p>

                                        <p className={`text-xs mt-1`} style={{ color: trend === 'up' ? '#2E7D32' : trend === 'down' ? '#C62828' : '#6B7280' }}>
                                            {trend === 'up' ? 'Increased from yesterday' : trend === 'down' ? 'Decreased from yesterday' : 'Stable'}
                                            <span className="block text-slate-400">
                                                {trend === 'up' ? 'গতকাল থেকে বেড়েছে' : trend === 'down' ? 'গতকাল থেকে কমেছে' : 'অপরিবর্তিত'}
                                            </span>
                                        </p>

                                        {/* Mandi Location */}
                                        <div className="mt-3 pt-2 border-t border-slate-100">
                                            <p className="text-xs text-slate-600 flex items-center gap-1">
                                                {distColor} {item.mandi} Mandi
                                            </p>
                                            <p className="text-xs text-slate-400">{item.mandiBn} • {item.dist}km</p>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            className="w-full mt-3 py-2 text-white text-sm font-medium rounded-lg transition-colors hover:opacity-90"
                                            style={{ backgroundColor: '#F57C00' }}
                                        >
                                            Check Details
                                            <span className="block text-xs opacity-80">বিস্তারিত দেখুন</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Crop Calendar */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <CalendarDays className="text-orange-500" /> Crop Calendar
                    </h2>

                    {/* Visual Timeline */}
                    <div className="mb-4 relative">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                            <span>Sowing</span>
                            <span>Tillering</span>
                            <span>Panicle</span>
                            <span>Harvest</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (avgDaysSinceSowing / 120) * 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Day 0</span>
                            <span>Day 35</span>
                            <span>Day 65</span>
                            <span>Day 120</span>
                        </div>
                        <p className="text-center text-sm text-paddy-green font-medium mt-2">
                            📍 Day {avgDaysSinceSowing} - {currentActivity?.name || 'Active Growth'}
                        </p>
                    </div>

                    {/* Current Activity - Enhanced */}
                    {
                        currentActivity && (
                            <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{currentActivity.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">NOW</span>
                                            <p className="font-bold text-slate-800">{currentActivity.name}</p>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">{currentActivity.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Fertilizer Alert */}
                    {
                        fertilizerDue && (
                            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-2 border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">🧪</span>
                                    <p className="font-bold text-purple-800">Fertilizer Due This Week</p>
                                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">ACTION</span>
                                </div>
                                <p className="text-sm text-slate-700 mb-2">{fertilizerDue.stage}</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white p-2 rounded-lg">
                                        <p className="text-lg font-bold text-slate-800">{fertilizerDue.ureaKgPerAcre}kg</p>
                                        <p className="text-xs text-slate-500">Urea/acre</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg">
                                        <p className="text-lg font-bold text-slate-800">{fertilizerDue.dapKgPerAcre}kg</p>
                                        <p className="text-xs text-slate-500">DAP/acre</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg">
                                        <p className="text-lg font-bold text-slate-800">{fertilizerDue.mopKgPerAcre}kg</p>
                                        <p className="text-xs text-slate-500">MOP/acre</p>
                                    </div>
                                </div>
                                {current.rain > 0 && (
                                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
                                        ⚠️ Rain detected today. Wait 24hrs after rain for fertilizer application.
                                    </p>
                                )}
                            </div>
                        )
                    }

                    {/* Upcoming Tasks */}
                    <div className="space-y-2">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">📅 Coming Up</p>
                        {upcomingActivities.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <span className="text-xl">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-700 text-sm">{activity.name}</p>
                                    <p className="text-xs text-slate-500">{activity.description?.slice(0, 40)}...</p>
                                </div>
                                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                                    Day {activity.dayRange[0]}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Expected Harvest */}
                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-center">
                        <p className="text-xs text-green-600 uppercase tracking-wide">Expected Harvest</p>
                        <p className="text-lg font-bold text-green-700">
                            🌾 {new Date(Date.now() + (120 - avgDaysSinceSowing) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-green-600">~{120 - avgDaysSinceSowing} days remaining</p>
                    </div>
                </div >

                {/* Government Schemes */}
                < div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2" >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                            <ShieldCheck className="text-indigo-500" /> Government Schemes
                        </h2>
                        <Link href="/schemes" className="text-sm text-indigo-600 hover:underline">View All →</Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        {urgentSchemes.slice(0, 4).map((scheme) => (
                            <div key={scheme.id} className={`p-3 rounded-xl border ${scheme.status === 'Closing Soon' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-start gap-2">
                                    <span className="text-2xl">{scheme.icon}</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-sm">{scheme.name}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{scheme.benefits[0]}</p>
                                        {scheme.deadline && (
                                            <p className="text-xs text-red-600 mt-1 font-medium">⏰ Deadline: {scheme.deadline}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div >

                {/* Pest Alerts - Enhanced */}
                < div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2" >
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" /> Active Pest Alerts
                    </h2>

                    {
                        pestReports.length > 0 ? (
                            <div className="space-y-4">
                                {pestReports.map((report, idx) => {
                                    // Generate realistic timestamps
                                    const hoursAgo = Math.floor(Math.random() * 48);
                                    const timeLabel = hoursAgo < 1 ? 'Just now' :
                                        hoursAgo < 24 ? `${hoursAgo} hours ago` :
                                            hoursAgo < 48 ? 'Yesterday' : '2 days ago';

                                    // Quick tips based on pest type
                                    const quickTips: Record<string, string> = {
                                        'Blast': '🌿 Apply Tricyclazole 0.6g/L spray. Drain excess water. Avoid late nitrogen.',
                                        'Brown Spot': '🍂 Spray Mancozeb 2.5g/L. Ensure balanced fertilization.',
                                        'BPH': '🪲 Drain field water. Install light traps. Avoid excess nitrogen.',
                                        'Stem Borer': '🐛 Install pheromone traps. Apply Carbofuran granules at base.',
                                        'Sheath Blight': '🌾 Spray Hexaconazole 1ml/L. Reduce planting density.',
                                    };
                                    const tip = quickTips[report.pest] || '⚠️ Contact Kisan Call Center: 1800-180-1551';

                                    return (
                                        <div key={idx} className="rounded-xl border-2 border-red-200 overflow-hidden">
                                            {/* Header */}
                                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle size={20} />
                                                    <span className="font-bold text-lg">{report.pest}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
                                                        Ward {report.ward}
                                                    </span>
                                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                                        🕐 {timeLabel}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="bg-red-50 p-4">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-slate-700">
                                                            <span className="font-bold text-red-700">{report.count} farmer(s)</span> reported this pest
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Reported by: {report.farmers.slice(0, 2).join(', ')}{report.farmers.length > 2 ? ` +${report.farmers.length - 2} more` : ''}
                                                        </p>
                                                    </div>
                                                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                                        ACTIVE
                                                    </span>
                                                </div>

                                                {/* Quick Tip */}
                                                <div className="bg-white p-3 rounded-lg border border-red-100">
                                                    <p className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                        💡 What to do:
                                                    </p>
                                                    <p className="text-sm text-slate-600">{tip}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl border-2 bg-green-50 border-green-200 text-center">
                                <div className="text-4xl mb-2">✅</div>
                                <p className="text-green-800 font-bold">No Active Pest Alerts</p>
                                <p className="text-green-600 text-sm">Your village is currently pest-free. Keep monitoring!</p>
                            </div>
                        )
                    }
                </div >

                {/* Top Performers */}
                < div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100" >
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Award className="text-yellow-500" /> Top Farmers (Yield/Acre)
                    </h2>
                    <div className="space-y-3">
                        {topPerformers.map((farmer, idx) => (
                            <div key={farmer.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    idx === 1 ? 'bg-slate-200 text-slate-600' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800 text-sm">{farmer.name}</p>
                                    <p className="text-xs text-slate-500">Ward {farmer.ward}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-paddy-green">{Math.round((farmer.lastYieldQtl || 0) / farmer.landAreaAcres)}</p>
                                    <p className="text-xs text-slate-400">q/acre</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/farmers" className="block text-center text-sm text-indigo-600 hover:underline mt-4">
                        View All Farmers →
                    </Link>
                </div >

                {/* Local Village Alerts - Replaced News */}
                < div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-3" >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                            <AlertTriangle className="text-amber-500" /> Alerts for {villageData.name}
                        </h2>
                        <Link href="/knowledge" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                            <BookOpen size={14} /> Knowledge Base →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Weather Alert */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🌧️</span>
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Weather</span>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Rain Expected Tomorrow</h3>
                            <p className="text-xs text-slate-600 mb-2">50-80mm rainfall predicted. Avoid fertilizer application.</p>
                            <p className="text-xs text-slate-400">🕐 2 hours ago</p>
                        </div>

                        {/* Pest Alert */}
                        {pestReports.length > 0 && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🐛</span>
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">Urgent</span>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1 text-sm">{pestReports[0].pest} in Ward {pestReports[0].ward}</h3>
                                <p className="text-xs text-slate-600 mb-2">{pestReports[0].count} farmers reported. Check your field!</p>
                                <p className="text-xs text-slate-400">🕐 Today</p>
                            </div>
                        )}

                        {/* Scheme Alert */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📋</span>
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">Scheme</span>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">PM-KISAN Verification</h3>
                            <p className="text-xs text-slate-600 mb-2">eKYC due before Dec 31. Visit CSC or use app.</p>
                            <p className="text-xs text-slate-400">🕐 1 day ago</p>
                        </div>

                        {/* Price Alert */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📈</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Price</span>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Paddy Price Up ₹25/q</h3>
                            <p className="text-xs text-slate-600 mb-2">Best today: ₹{currentPrice + 60}/q at Nabadwip.</p>
                            <p className="text-xs text-slate-400">🕐 3 hours ago</p>
                        </div>

                        {/* Advisory Reminder - only if no pest reports */}
                        {pestReports.length === 0 && (
                            <Link href="/advisory" className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">💡</span>
                                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Tip</span>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1 text-sm">Get Your Advisory</h3>
                                <p className="text-xs text-slate-600 mb-2">Enter field details for personalized crop recommendations.</p>
                                <p className="text-xs text-indigo-600 font-medium">Go to Advisory →</p>
                            </Link>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
}

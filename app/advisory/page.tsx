import AdvisoryForm from "./form";
import { WeatherData } from "@/utils/riskEngine";
import { AlertTriangle, Droplets, ThermometerSun, CloudRain, Wind } from "lucide-react";

async function getWeather(): Promise<WeatherData> {
    try {
        const res = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=22.98&longitude=87.85&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=rain_sum,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto",
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        const rainSum = data.daily?.rain_sum?.reduce((a: number, b: number) => a + b, 0) || 0;
        const rainyDays = data.daily?.rain_sum?.filter((r: number) => r > 1).length || 0;
        const temps = data.daily?.temperature_2m_max || [];
        const tempMin = data.daily?.temperature_2m_min || [];

        return {
            temp_avg: data.current?.temperature_2m || 28,
            temp_min: Math.min(...tempMin) || 20,
            temp_max: Math.max(...temps) || 35,
            humidity_avg: data.current?.relative_humidity_2m || 75,
            rainfall_mm: rainSum,
            forecast_days_rain: rainyDays,
            wind_speed_kmh: data.current?.wind_speed_10m || 10,
        };
    } catch {
        return {
            temp_avg: 28,
            temp_min: 22,
            temp_max: 34,
            humidity_avg: 78,
            rainfall_mm: 25,
            forecast_days_rain: 3,
            wind_speed_kmh: 12,
        };
    }
}

export default async function AdvisoryPage() {
    const weather = await getWeather();

    const getWeatherStatus = () => {
        if (weather.humidity_avg > 85 && weather.temp_avg >= 20 && weather.temp_avg <= 28) {
            return { text: "🍄 Blast-Favorable Conditions", color: "text-red-600 bg-red-50" };
        }
        if (weather.rainfall_mm < 10 && weather.temp_avg > 30) {
            return { text: "☀️ Drought Risk", color: "text-orange-600 bg-orange-50" };
        }
        if (weather.humidity_avg > 85) {
            return { text: "💧 High Humidity Alert", color: "text-yellow-600 bg-yellow-50" };
        }
        return { text: "✅ Normal Conditions", color: "text-green-600 bg-green-50" };
    };

    const status = getWeatherStatus();

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">🌾 Field Advisory</h1>
                <p className="text-slate-600">Get personalized recommendations based on your field conditions</p>
            </header>

            {/* Weather Summary Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ThermometerSun className="text-orange-500" size={20} />
                            <span className="font-medium text-slate-700">{weather.temp_avg}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Droplets className="text-blue-500" size={20} />
                            <span className="font-medium text-slate-700">{weather.humidity_avg}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CloudRain className="text-sky-500" size={20} />
                            <span className="font-medium text-slate-700">{weather.rainfall_mm}mm (7-day)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wind className="text-purple-500" size={20} />
                            <span className="font-medium text-slate-700">{weather.wind_speed_kmh} km/h</span>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-medium text-sm ${status.color}`}>
                        {status.text}
                    </div>
                </div>
            </div>

            <AdvisoryForm weather={weather} />
        </div>
    );
}

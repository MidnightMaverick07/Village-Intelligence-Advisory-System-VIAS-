import { NextResponse } from "next/server";

interface WeatherResponse {
    current: {
        temperature: number;
        humidity: number;
        rain: number;
        windSpeed: number;
    };
    daily: {
        time: string[];
        tempMax: number[];
        tempMin: number[];
        rainSum: number[];
        uvIndex: number[];
    };
    location: {
        lat: number;
        long: number;
        name: string;
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat") || "23.42";
    const long = searchParams.get("long") || "87.91";
    const village = searchParams.get("village") || "Bhatar";

    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=rain_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=7&timezone=auto`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );

        if (!res.ok) {
            throw new Error(`Weather API returned ${res.status}`);
        }

        const data = await res.json();

        const response: WeatherResponse = {
            current: {
                temperature: data.current?.temperature_2m ?? 28,
                humidity: data.current?.relative_humidity_2m ?? 75,
                rain: data.current?.rain ?? 0,
                windSpeed: data.current?.wind_speed_10m ?? 10,
            },
            daily: {
                time: data.daily?.time ?? [],
                tempMax: data.daily?.temperature_2m_max ?? [],
                tempMin: data.daily?.temperature_2m_min ?? [],
                rainSum: data.daily?.rain_sum ?? [],
                uvIndex: data.daily?.uv_index_max ?? [],
            },
            location: {
                lat: parseFloat(lat),
                long: parseFloat(long),
                name: village,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Weather API error:", error);

        // Return fallback data
        return NextResponse.json(
            {
                current: { temperature: 28, humidity: 75, rain: 0, windSpeed: 10 },
                daily: { time: [], tempMax: [], tempMin: [], rainSum: [], uvIndex: [] },
                location: { lat: parseFloat(lat), long: parseFloat(long), name: village },
                error: "Weather service temporarily unavailable",
            },
            { status: 503 }
        );
    }
}

import { NextResponse } from "next/server";

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description?: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    try {
        const res = await fetch("https://eng.ruralvoice.in/rss/category/state", {
            next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!res.ok) {
            throw new Error(`News RSS returned ${res.status}`);
        }

        const text = await res.text();
        const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];

        const news: NewsItem[] = items.slice(0, limit).map((item) => {
            const title =
                item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                item.match(/<title>(.*?)<\/title>/)?.[1] ||
                "News Update";
            const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "#";
            const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
            const description =
                item
                    .match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
                    ?.slice(0, 200) || "";

            return { title, link, pubDate, description };
        });

        return NextResponse.json({
            news,
            total: news.length,
            source: "Rural Voice",
            cachedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("News API error:", error);

        // Return fallback news
        return NextResponse.json(
            {
                news: [
                    {
                        title: "Agricultural news temporarily unavailable",
                        link: "https://eng.ruralvoice.in",
                        pubDate: new Date().toISOString(),
                    },
                ],
                total: 0,
                error: "News service temporarily unavailable",
            },
            { status: 503 }
        );
    }
}

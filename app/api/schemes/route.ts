import { NextResponse } from "next/server";
import { GOVERNMENT_SCHEMES, MSP_RATES, getUrgentSchemes, getSchemesByStatus, getPaddyMSP } from "@/data/governmentSchemes";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "all";
    const status = searchParams.get("status");

    try {
        switch (action) {
            case "all":
                return NextResponse.json({
                    schemes: GOVERNMENT_SCHEMES,
                    total: GOVERNMENT_SCHEMES.length,
                });

            case "urgent":
                const urgentSchemes = getUrgentSchemes();
                return NextResponse.json({
                    schemes: urgentSchemes,
                    total: urgentSchemes.length,
                });

            case "filter":
                if (!status) {
                    return NextResponse.json(
                        { error: "Status parameter required for filter action" },
                        { status: 400 }
                    );
                }
                const filteredSchemes = getSchemesByStatus(status as any);
                return NextResponse.json({
                    schemes: filteredSchemes,
                    total: filteredSchemes.length,
                });

            case "msp":
                return NextResponse.json({
                    rates: MSP_RATES,
                    paddyMsp: getPaddyMSP(),
                });

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Schemes API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch scheme data" },
            { status: 500 }
        );
    }
}

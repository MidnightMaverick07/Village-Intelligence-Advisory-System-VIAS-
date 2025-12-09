import { NextResponse } from "next/server";
import { MOCK_VILLAGE_DATA, getFarmersByVillage, getVillageStats, getPestReports, getTopPerformers, Farmer } from "@/data/mockVillage";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const village = searchParams.get("village");
    const action = searchParams.get("action") || "list";

    try {
        switch (action) {
            case "list": {
                const farmers = village ? getFarmersByVillage(village) : MOCK_VILLAGE_DATA;
                return NextResponse.json({
                    farmers: farmers.map(f => ({
                        ...f,
                        sowingDate: f.sowingDate.toISOString(),
                        pestReportDate: f.pestReportDate?.toISOString(),
                        registeredOn: f.registeredOn.toISOString(),
                    })),
                    total: farmers.length,
                });
            }

            case "stats": {
                if (!village) {
                    return NextResponse.json(
                        { error: "Village parameter required for stats" },
                        { status: 400 }
                    );
                }
                const stats = getVillageStats(village);
                return NextResponse.json(stats);
            }

            case "pests": {
                const reports = getPestReports(village || undefined);
                return NextResponse.json({ reports, total: reports.length });
            }

            case "top": {
                const limit = parseInt(searchParams.get("limit") || "5");
                const performers = getTopPerformers(village || undefined, limit);
                return NextResponse.json({
                    farmers: performers.map(f => ({
                        id: f.id,
                        name: f.name,
                        village: f.village,
                        ward: f.ward,
                        landAreaAcres: f.landAreaAcres,
                        lastYieldQtl: f.lastYieldQtl,
                        yieldPerAcre: Math.round((f.lastYieldQtl || 0) / f.landAreaAcres * 10) / 10,
                    })),
                });
            }

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Farmers API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch farmer data" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    // Simulate adding a new farmer (in production, this would write to DB)
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'village', 'landAreaAcres', 'variety'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Simulate created farmer
        const newFarmer = {
            id: `${Date.now()}`,
            ...body,
            registeredOn: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: "Farmer registered successfully",
            farmer: newFarmer,
        }, { status: 201 });
    } catch (error) {
        console.error("Farmer registration error:", error);
        return NextResponse.json(
            { error: "Failed to register farmer" },
            { status: 500 }
        );
    }
}

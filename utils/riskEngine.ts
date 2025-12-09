export interface WeatherData {
    temp_avg: number;
    temp_min: number;
    temp_max: number;
    humidity_avg: number;
    rainfall_mm: number;
    forecast_days_rain: number;
    wind_speed_kmh?: number;
    uv_index?: number;
}

export type CropStage = 'Nursery' | 'Tillering' | 'Panicle' | 'Flowering' | 'Grain Filling' | 'Maturity';

export type RiskType =
    | 'Blast'
    | 'Brown Spot'
    | 'Sheath Blight'
    | 'BPH'
    | 'Stem Borer'
    | 'Drought'
    | 'Flood'
    | 'Cold Stress'
    | 'Heat Stress'
    | 'None';

export interface CropData {
    stage: CropStage;
    sowingDate: Date;
    variety?: 'Short' | 'Medium' | 'Long';
    soilType?: 'Clay' | 'Loam' | 'Sandy';
}

export interface RiskResult {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    riskType: RiskType;
    severity: number; // 0-100
    recommendation: string;
    preventiveMeasures: string[];
    icon: string;
}

export interface MultiRiskResult {
    primaryRisk: RiskResult;
    secondaryRisks: RiskResult[];
    overallRiskScore: number;
    summary: string;
}

// Stage-specific vulnerability factors
const STAGE_VULNERABILITY: Record<CropStage, Record<RiskType, number>> = {
    'Nursery': { 'Blast': 0.9, 'Brown Spot': 0.5, 'Sheath Blight': 0.3, 'BPH': 0.4, 'Stem Borer': 0.6, 'Drought': 0.8, 'Flood': 0.9, 'Cold Stress': 0.8, 'Heat Stress': 0.7, 'None': 0 },
    'Tillering': { 'Blast': 0.8, 'Brown Spot': 0.7, 'Sheath Blight': 0.6, 'BPH': 0.7, 'Stem Borer': 0.8, 'Drought': 0.7, 'Flood': 0.6, 'Cold Stress': 0.5, 'Heat Stress': 0.6, 'None': 0 },
    'Panicle': { 'Blast': 0.7, 'Brown Spot': 0.8, 'Sheath Blight': 0.8, 'BPH': 0.9, 'Stem Borer': 0.7, 'Drought': 0.9, 'Flood': 0.7, 'Cold Stress': 0.6, 'Heat Stress': 0.8, 'None': 0 },
    'Flowering': { 'Blast': 0.9, 'Brown Spot': 0.6, 'Sheath Blight': 0.7, 'BPH': 0.8, 'Stem Borer': 0.5, 'Drought': 1.0, 'Flood': 0.8, 'Cold Stress': 0.9, 'Heat Stress': 1.0, 'None': 0 },
    'Grain Filling': { 'Blast': 0.4, 'Brown Spot': 0.7, 'Sheath Blight': 0.5, 'BPH': 0.6, 'Stem Borer': 0.4, 'Drought': 0.8, 'Flood': 0.9, 'Cold Stress': 0.7, 'Heat Stress': 0.8, 'None': 0 },
    'Maturity': { 'Blast': 0.2, 'Brown Spot': 0.3, 'Sheath Blight': 0.2, 'BPH': 0.3, 'Stem Borer': 0.2, 'Drought': 0.3, 'Flood': 1.0, 'Cold Stress': 0.4, 'Heat Stress': 0.5, 'None': 0 },
};

function checkBlastRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Blast favors: 20-28°C, >80% humidity, wet conditions
    const tempInRange = weather.temp_avg >= 20 && weather.temp_avg <= 28;
    const highHumidity = weather.humidity_avg > 80;
    const wetConditions = weather.forecast_days_rain >= 3;

    if (tempInRange && highHumidity && wetConditions && crop.stage !== 'Maturity') {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Blast'];
        const severity = Math.min(100, Math.round(vulnerability * 90 + (weather.humidity_avg - 80) * 2));

        return {
            riskLevel: severity > 75 ? 'HIGH' : 'MEDIUM',
            riskType: 'Blast',
            severity,
            recommendation: "Apply Tricyclazole 75 WP @ 0.6g/L or Isoprothiolane 40 EC @ 1.5ml/L within 48 hours. Avoid nitrogen application.",
            preventiveMeasures: [
                "Maintain field drainage",
                "Remove infected plant debris",
                "Use resistant varieties (Swarna Sub-1)"
            ],
            icon: "🍄"
        };
    }
    return null;
}

function checkBrownSpotRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Brown Spot favors: nutrient deficiency conditions, 25-30°C, high humidity
    const tempInRange = weather.temp_avg >= 25 && weather.temp_avg <= 30;
    const highHumidity = weather.humidity_avg > 75;
    const susceptibleStage = ['Tillering', 'Panicle', 'Grain Filling'].includes(crop.stage);

    if (tempInRange && highHumidity && susceptibleStage) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Brown Spot'];
        const severity = Math.min(100, Math.round(vulnerability * 70 + (weather.humidity_avg - 75)));

        return {
            riskLevel: severity > 60 ? 'MEDIUM' : 'LOW',
            riskType: 'Brown Spot',
            severity,
            recommendation: "Apply Mancozeb 75 WP @ 2.5g/L. Ensure balanced fertilizer application, especially potassium.",
            preventiveMeasures: [
                "Apply Potash @ 40kg/acre",
                "Ensure proper field drainage",
                "Seed treatment with fungicides"
            ],
            icon: "🟤"
        };
    }
    return null;
}

function checkSheathBlightRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Sheath Blight favors: >28°C, very high humidity, dense canopy
    const highTemp = weather.temp_avg > 28;
    const veryHighHumidity = weather.humidity_avg > 85;
    const susceptibleStage = ['Panicle', 'Flowering', 'Grain Filling'].includes(crop.stage);

    if (highTemp && veryHighHumidity && susceptibleStage) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Sheath Blight'];
        const severity = Math.min(100, Math.round(vulnerability * 80 + (weather.temp_avg - 28) * 3));

        return {
            riskLevel: severity > 70 ? 'HIGH' : 'MEDIUM',
            riskType: 'Sheath Blight',
            severity,
            recommendation: "Apply Hexaconazole 5 SC @ 2ml/L or Validamycin 3L @ 2.5ml/L. Reduce plant density.",
            preventiveMeasures: [
                "Maintain proper plant spacing",
                "Avoid excessive nitrogen",
                "Remove lower senescent leaves"
            ],
            icon: "🦠"
        };
    }
    return null;
}

function checkBPHRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // BPH favors: high humidity, moderate temp, excessive nitrogen
    const highHumidity = weather.humidity_avg > 85;
    const moderateTemp = weather.temp_avg >= 25 && weather.temp_avg <= 30;
    const susceptibleStage = ['Tillering', 'Panicle', 'Flowering'].includes(crop.stage);

    if (highHumidity && moderateTemp && susceptibleStage) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['BPH'];
        const severity = Math.min(100, Math.round(vulnerability * 75 + (weather.humidity_avg - 85) * 2));

        return {
            riskLevel: severity > 65 ? 'HIGH' : 'MEDIUM',
            riskType: 'BPH',
            severity,
            recommendation: "Apply Imidacloprid 17.8 SL @ 0.5ml/L. Drain field water to expose hoppers. Set up light traps.",
            preventiveMeasures: [
                "Install light traps (1 per acre)",
                "Avoid excess nitrogen application",
                "Maintain field bunds clean",
                "Encourage natural predators"
            ],
            icon: "🪲"
        };
    }
    return null;
}

function checkStemBorerRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Stem Borer: active in warm humid conditions
    const warmConditions = weather.temp_avg > 28;
    const highHumidity = weather.humidity_avg > 80;

    if (warmConditions && highHumidity) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Stem Borer'];
        const severity = Math.min(100, Math.round(vulnerability * 70));

        return {
            riskLevel: severity > 50 ? 'MEDIUM' : 'LOW',
            riskType: 'Stem Borer',
            severity,
            recommendation: "Monitor for egg masses and dead hearts. Apply Chlorantraniliprole 0.4 GR @ 4kg/acre.",
            preventiveMeasures: [
                "Set up pheromone traps",
                "Collect and destroy egg masses",
                "Stubble management after harvest"
            ],
            icon: "🐛"
        };
    }
    return null;
}

function checkDroughtRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Drought: low rainfall, high temp
    const lowRainfall = weather.rainfall_mm < 10;
    const highTemp = weather.temp_avg > 30;

    if (lowRainfall && highTemp) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Drought'];
        const severity = Math.min(100, Math.round(vulnerability * 85 + (weather.temp_avg - 30) * 3));

        return {
            riskLevel: severity > 80 ? 'CRITICAL' : severity > 60 ? 'HIGH' : 'MEDIUM',
            riskType: 'Drought',
            severity,
            recommendation: "Irrigate immediately to maintain 2-5cm standing water. Apply foliar spray of 2% KCl for stress mitigation.",
            preventiveMeasures: [
                "Ensure irrigation infrastructure ready",
                "Mulching to reduce evaporation",
                "Life-saving irrigation priority",
                "Consider drought-tolerant varieties"
            ],
            icon: "☀️"
        };
    }
    return null;
}

function checkFloodRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Flood: very high rainfall
    const veryHighRainfall = weather.rainfall_mm > 150;
    const manyRainyDays = weather.forecast_days_rain >= 5;

    if (veryHighRainfall || manyRainyDays) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Flood'];
        const severity = Math.min(100, Math.round(vulnerability * 90));

        return {
            riskLevel: severity > 80 ? 'CRITICAL' : 'HIGH',
            riskType: 'Flood',
            severity,
            recommendation: "Ensure drainage channels are clear. In case of submergence, apply 20kg Urea + 10kg MOP after water recedes.",
            preventiveMeasures: [
                "Clear drainage channels",
                "Consider Swarna Sub-1 (submergence tolerant)",
                "Prepare for replanting if needed",
                "Contact block agriculture office"
            ],
            icon: "🌊"
        };
    }
    return null;
}

function checkColdStressRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Cold Stress: <15°C, especially during flowering
    const coldTemp = weather.temp_min < 15;
    const criticalStage = ['Panicle', 'Flowering'].includes(crop.stage);

    if (coldTemp && criticalStage) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Cold Stress'];
        const severity = Math.min(100, Math.round(vulnerability * 85 + (15 - weather.temp_min) * 5));

        return {
            riskLevel: severity > 70 ? 'HIGH' : 'MEDIUM',
            riskType: 'Cold Stress',
            severity,
            recommendation: "Maintain deeper water level (10cm) in field to preserve warmth. Avoid irrigation with cold water.",
            preventiveMeasures: [
                "Increase water depth to 10cm",
                "Late evening irrigation preferred",
                "Smoke ropes in severe cases"
            ],
            icon: "🥶"
        };
    }
    return null;
}

function checkHeatStressRisk(weather: WeatherData, crop: CropData): RiskResult | null {
    // Heat Stress: >35°C during flowering
    const veryHighTemp = weather.temp_max > 35;
    const criticalStage = ['Flowering', 'Grain Filling'].includes(crop.stage);

    if (veryHighTemp && criticalStage) {
        const vulnerability = STAGE_VULNERABILITY[crop.stage]['Heat Stress'];
        const severity = Math.min(100, Math.round(vulnerability * 80 + (weather.temp_max - 35) * 5));

        return {
            riskLevel: severity > 75 ? 'HIGH' : 'MEDIUM',
            riskType: 'Heat Stress',
            severity,
            recommendation: "Maintain 5cm standing water. Apply potassium chloride 1% foliar spray. Irrigate during evening hours.",
            preventiveMeasures: [
                "Evening irrigation only",
                "Foliar spray of K₂SO₄",
                "Consider short-duration varieties"
            ],
            icon: "🔥"
        };
    }
    return null;
}

export function calculateMultiRisk(weather: WeatherData, crop: CropData): MultiRiskResult {
    const allRisks: RiskResult[] = [];

    // Check all risk types
    const risks = [
        checkBlastRisk(weather, crop),
        checkBrownSpotRisk(weather, crop),
        checkSheathBlightRisk(weather, crop),
        checkBPHRisk(weather, crop),
        checkStemBorerRisk(weather, crop),
        checkDroughtRisk(weather, crop),
        checkFloodRisk(weather, crop),
        checkColdStressRisk(weather, crop),
        checkHeatStressRisk(weather, crop),
    ];

    risks.forEach(risk => {
        if (risk) allRisks.push(risk);
    });

    // Sort by severity
    allRisks.sort((a, b) => b.severity - a.severity);

    // Calculate overall risk score
    const overallRiskScore = allRisks.length > 0
        ? Math.min(100, allRisks.reduce((sum, r) => sum + r.severity * 0.4, 0))
        : 0;

    const primaryRisk = allRisks[0] || {
        riskLevel: 'LOW' as const,
        riskType: 'None' as const,
        severity: 0,
        recommendation: "Conditions are favorable. Continue standard monitoring and follow the recommended crop calendar.",
        preventiveMeasures: ["Regular field scouting", "Maintain irrigation schedule", "Follow recommended fertilizer doses"],
        icon: "✅"
    };

    const summary = allRisks.length === 0
        ? "No significant risks detected. Conditions are favorable for rice cultivation."
        : allRisks.length === 1
            ? `Primary concern: ${primaryRisk.riskType}. Take immediate action.`
            : `Multiple risks detected (${allRisks.length}). Primary concern: ${primaryRisk.riskType}. Monitor closely.`;

    return {
        primaryRisk,
        secondaryRisks: allRisks.slice(1),
        overallRiskScore,
        summary
    };
}

// Legacy single-risk function for backward compatibility
export function calculateRisk(weather: WeatherData, crop: CropData): RiskResult {
    const result = calculateMultiRisk(weather, crop);
    return {
        riskLevel: result.primaryRisk.riskLevel === 'CRITICAL' ? 'HIGH' : result.primaryRisk.riskLevel,
        riskType: result.primaryRisk.riskType,
        severity: result.primaryRisk.severity,
        recommendation: result.primaryRisk.recommendation,
        preventiveMeasures: result.primaryRisk.preventiveMeasures,
        icon: result.primaryRisk.icon
    };
}

export function calculateCropStage(sowingDate: Date, variety: 'Short' | 'Medium' | 'Long' = 'Medium'): CropStage {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - sowingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Stage durations vary by variety
    const stageDurations = {
        'Short': { nursery: 25, tillering: 20, panicle: 15, flowering: 10, grainFilling: 20 },
        'Medium': { nursery: 30, tillering: 30, panicle: 20, flowering: 10, grainFilling: 25 },
        'Long': { nursery: 35, tillering: 35, panicle: 25, flowering: 12, grainFilling: 30 },
    };

    const d = stageDurations[variety];

    if (diffDays < d.nursery) return 'Nursery';
    if (diffDays < d.nursery + d.tillering) return 'Tillering';
    if (diffDays < d.nursery + d.tillering + d.panicle) return 'Panicle';
    if (diffDays < d.nursery + d.tillering + d.panicle + d.flowering) return 'Flowering';
    if (diffDays < d.nursery + d.tillering + d.panicle + d.flowering + d.grainFilling) return 'Grain Filling';
    return 'Maturity';
}

export function getExpectedHarvestDate(sowingDate: Date, variety: 'Short' | 'Medium' | 'Long' = 'Medium'): Date {
    const durations = { 'Short': 100, 'Medium': 130, 'Long': 155 };
    const harvestDate = new Date(sowingDate);
    harvestDate.setDate(harvestDate.getDate() + durations[variety]);
    return harvestDate;
}

export function estimateYield(
    landAreaAcres: number,
    riskScore: number,
    variety: 'Short' | 'Medium' | 'Long' = 'Medium'
): { minYield: number; maxYield: number; unit: string } {
    // Base yields in quintals per acre
    const baseYields = { 'Short': 16, 'Medium': 20, 'Long': 22 };
    const base = baseYields[variety];

    // Reduce yield based on risk score
    const riskFactor = 1 - (riskScore / 200); // 0-100 score reduces yield by 0-50%

    const estimatedYield = base * landAreaAcres * riskFactor;

    return {
        minYield: Math.round(estimatedYield * 0.85),
        maxYield: Math.round(estimatedYield * 1.15),
        unit: 'quintals'
    };
}

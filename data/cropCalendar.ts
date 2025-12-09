export interface CropActivity {
    name: string;
    stage: string;
    dayRange: [number, number];
    description: string;
    icon: string;
}

export interface FertilizerSchedule {
    stage: string;
    dayAfterSowing: number;
    ureaKgPerAcre: number;
    dapKgPerAcre: number;
    mopKgPerAcre: number;
    notes: string;
}

export interface VarietyInfo {
    name: string;
    duration: 'Short' | 'Medium' | 'Long';
    daysToMaturity: number;
    avgYieldQtlPerAcre: number;
    characteristics: string[];
    submergenceTolerant: boolean;
    droughtTolerant: boolean;
}

export const RICE_VARIETIES: VarietyInfo[] = [
    {
        name: "Swarna (MTU 7029)",
        duration: "Long",
        daysToMaturity: 140,
        avgYieldQtlPerAcre: 22,
        characteristics: ["High yield", "Fine grain", "Aromatic"],
        submergenceTolerant: false,
        droughtTolerant: false
    },
    {
        name: "Swarna Sub-1",
        duration: "Long",
        daysToMaturity: 145,
        avgYieldQtlPerAcre: 20,
        characteristics: ["Submergence tolerant (14-17 days)", "Good recovery"],
        submergenceTolerant: true,
        droughtTolerant: false
    },
    {
        name: "MTU 1010",
        duration: "Medium",
        daysToMaturity: 120,
        avgYieldQtlPerAcre: 20,
        characteristics: ["Early maturing", "Good grain quality"],
        submergenceTolerant: false,
        droughtTolerant: false
    },
    {
        name: "IR 64",
        duration: "Medium",
        daysToMaturity: 115,
        avgYieldQtlPerAcre: 18,
        characteristics: ["Wide adaptability", "Semi-dwarf"],
        submergenceTolerant: false,
        droughtTolerant: true
    },
    {
        name: "IR 36",
        duration: "Short",
        daysToMaturity: 105,
        avgYieldQtlPerAcre: 16,
        characteristics: ["Short duration", "Multiple cropping"],
        submergenceTolerant: false,
        droughtTolerant: true
    },
    {
        name: "Gobindobhog",
        duration: "Medium",
        daysToMaturity: 125,
        avgYieldQtlPerAcre: 12,
        characteristics: ["Premium aromatic", "Traditional", "High market value"],
        submergenceTolerant: false,
        droughtTolerant: false
    },
    {
        name: "Sahbhagi Dhan",
        duration: "Short",
        daysToMaturity: 100,
        avgYieldQtlPerAcre: 15,
        characteristics: ["Drought tolerant", "Rainfed areas"],
        submergenceTolerant: false,
        droughtTolerant: true
    }
];

export const CROP_CALENDAR: CropActivity[] = [
    { name: "Land Preparation", stage: "Pre-sowing", dayRange: [-15, -1], description: "Plough field 2-3 times, puddle and level", icon: "🚜" },
    { name: "Seed Treatment", stage: "Pre-sowing", dayRange: [-3, -1], description: "Treat seeds with Carbendazim 2g/kg", icon: "💊" },
    { name: "Nursery Sowing", stage: "Nursery", dayRange: [0, 1], description: "Sow pre-germinated seeds in wet nursery beds", icon: "🌱" },
    { name: "First DAP Application", stage: "Nursery", dayRange: [10, 15], description: "Apply DAP @ 10kg/acre in nursery", icon: "💧" },
    { name: "Transplanting", stage: "Nursery", dayRange: [21, 30], description: "Transplant 21-30 day old seedlings, 2-3 per hill", icon: "🌾" },
    { name: "First Weeding", stage: "Tillering", dayRange: [35, 40], description: "Manual or mechanical weeding", icon: "🧹" },
    { name: "First Urea Application", stage: "Tillering", dayRange: [30, 35], description: "Apply Urea @ 35kg/acre", icon: "🧪" },
    { name: "Second Weeding", stage: "Tillering", dayRange: [50, 55], description: "Second round of weeding", icon: "🧹" },
    { name: "Second Urea Application", stage: "Tillering", dayRange: [45, 50], description: "Apply Urea @ 25kg/acre", icon: "🧪" },
    { name: "Panicle Initiation Check", stage: "Panicle", dayRange: [55, 65], description: "Check for panicle initiation by splitting stem", icon: "🔍" },
    { name: "Third Urea Application", stage: "Panicle", dayRange: [60, 65], description: "Apply Urea @ 20kg/acre (if needed)", icon: "🧪" },
    { name: "Pest Monitoring Intensification", stage: "Panicle", dayRange: [60, 80], description: "Increase pest scouting frequency", icon: "🪲" },
    { name: "Flowering Period", stage: "Flowering", dayRange: [75, 85], description: "Critical period - maintain water level", icon: "🌸" },
    { name: "Stop Nitrogen Application", stage: "Flowering", dayRange: [75, 75], description: "No more urea after this point", icon: "⛔" },
    { name: "Grain Filling", stage: "Grain Filling", dayRange: [85, 110], description: "Maintain irrigation, monitor for diseases", icon: "🌾" },
    { name: "Drain Field", stage: "Maturity", dayRange: [110, 115], description: "Drain water 10-15 days before harvest", icon: "💧" },
    { name: "Harvest", stage: "Maturity", dayRange: [115, 145], description: "Harvest when 80% grains turn yellow", icon: "🚜" }
];

export const FERTILIZER_SCHEDULE: FertilizerSchedule[] = [
    { stage: "Basal (Before Transplanting)", dayAfterSowing: 0, ureaKgPerAcre: 0, dapKgPerAcre: 50, mopKgPerAcre: 25, notes: "Apply during final puddling" },
    { stage: "First Top Dressing", dayAfterSowing: 30, ureaKgPerAcre: 35, dapKgPerAcre: 0, mopKgPerAcre: 0, notes: "7-10 days after transplanting" },
    { stage: "Second Top Dressing", dayAfterSowing: 50, ureaKgPerAcre: 25, dapKgPerAcre: 0, mopKgPerAcre: 0, notes: "At active tillering" },
    { stage: "Third Top Dressing", dayAfterSowing: 65, ureaKgPerAcre: 20, dapKgPerAcre: 0, mopKgPerAcre: 15, notes: "At panicle initiation" }
];

export function getCurrentActivity(daysSinceSowing: number): CropActivity | null {
    return CROP_CALENDAR.find(activity =>
        daysSinceSowing >= activity.dayRange[0] && daysSinceSowing <= activity.dayRange[1]
    ) || null;
}

export function getUpcomingActivities(daysSinceSowing: number, count: number = 3): CropActivity[] {
    return CROP_CALENDAR
        .filter(activity => activity.dayRange[0] > daysSinceSowing)
        .slice(0, count);
}

export function getFertilizerDue(daysSinceSowing: number): FertilizerSchedule | null {
    const upcoming = FERTILIZER_SCHEDULE.find(f =>
        f.dayAfterSowing >= daysSinceSowing && f.dayAfterSowing <= daysSinceSowing + 7
    );
    return upcoming || null;
}

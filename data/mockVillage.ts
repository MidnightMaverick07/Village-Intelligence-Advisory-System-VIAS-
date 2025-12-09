import { CropStage } from "@/utils/riskEngine";

export interface Farmer {
    id: string;
    name: string;
    phone: string;
    aadhaarLast4?: string;
    village: string;
    district: string;
    ward: number;
    landAreaAcres: number;
    landType: 'Irrigated' | 'Rainfed' | 'Partially Irrigated';
    irrigationSource: 'Canal' | 'Tubewell' | 'Pond' | 'Rain-fed' | 'Mixed';
    soilType: 'Clay' | 'Loam' | 'Sandy' | 'Clay Loam';
    sowingDate: Date;
    variety: string;
    varietyDuration: 'Short' | 'Medium' | 'Long';
    reportedPest?: 'Blast' | 'Brown Spot' | 'Stem Borer' | 'BPH' | 'Sheath Blight' | 'None';
    pestReportDate?: Date;
    pmKisanRegistered: boolean;
    kccHolder: boolean;
    pmfbyEnrolled: boolean;
    lastYieldQtl?: number;
    fpoMember?: string;
    registeredOn: Date;
}

export interface VillageStats {
    village: string;
    district: string;
    totalFarmers: number;
    totalAcreage: number;
    activeAlerts: number;
    avgYieldLastYear: number;
    dominantVariety: string;
    irrigationCoverage: number;
}

// Expanded farmer database for multiple villages
export const MOCK_VILLAGE_DATA: Farmer[] = [
    // Bhatar Village (10 farmers)
    {
        id: '1',
        name: 'Ramesh Mondal',
        phone: '9832XXXX01',
        aadhaarLast4: '1234',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 2,
        landAreaAcres: 1.5,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Clay Loam',
        sowingDate: new Date('2024-07-15'),
        variety: 'Swarna',
        varietyDuration: 'Long',
        reportedPest: 'Blast',
        pestReportDate: new Date('2024-09-10'),
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 32,
        fpoMember: 'Bhatar Paddy FPO',
        registeredOn: new Date('2023-01-15')
    },
    {
        id: '2',
        name: 'Suresh Das',
        phone: '9832XXXX02',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 2,
        landAreaAcres: 0.8,
        landType: 'Rainfed',
        irrigationSource: 'Rain-fed',
        soilType: 'Loam',
        sowingDate: new Date('2024-07-20'),
        variety: 'MTU 7029',
        varietyDuration: 'Long',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: true,
        lastYieldQtl: 15,
        registeredOn: new Date('2023-03-22')
    },
    {
        id: '3',
        name: 'Amit Ghosh',
        phone: '9832XXXX03',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 5,
        landAreaAcres: 2.1,
        landType: 'Irrigated',
        irrigationSource: 'Tubewell',
        soilType: 'Clay',
        sowingDate: new Date('2024-07-10'),
        variety: 'Swarna Sub-1',
        varietyDuration: 'Long',
        reportedPest: 'Brown Spot',
        pestReportDate: new Date('2024-09-05'),
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 45,
        fpoMember: 'Bhatar Paddy FPO',
        registeredOn: new Date('2022-06-10')
    },
    {
        id: '4',
        name: 'Bimal Roy',
        phone: '9832XXXX04',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 3,
        landAreaAcres: 1.2,
        landType: 'Partially Irrigated',
        irrigationSource: 'Mixed',
        soilType: 'Loam',
        sowingDate: new Date('2024-08-01'),
        variety: 'IR 64',
        varietyDuration: 'Medium',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: false,
        lastYieldQtl: 22,
        registeredOn: new Date('2023-07-01')
    },
    {
        id: '5',
        name: 'Goutam Pal',
        phone: '9832XXXX05',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 5,
        landAreaAcres: 0.5,
        landType: 'Rainfed',
        irrigationSource: 'Rain-fed',
        soilType: 'Sandy',
        sowingDate: new Date('2024-07-25'),
        variety: 'Swarna',
        varietyDuration: 'Long',
        reportedPest: 'Stem Borer',
        pestReportDate: new Date('2024-09-12'),
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: true,
        lastYieldQtl: 8,
        registeredOn: new Date('2024-02-20')
    },
    {
        id: '6',
        name: 'Subhas Bose',
        phone: '9832XXXX06',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 1,
        landAreaAcres: 3.0,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Clay Loam',
        sowingDate: new Date('2024-07-05'),
        variety: 'Gobindobhog',
        varietyDuration: 'Medium',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 35,
        fpoMember: 'Bhatar Paddy FPO',
        registeredOn: new Date('2021-04-15')
    },
    {
        id: '7',
        name: 'Pradip Sen',
        phone: '9832XXXX07',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 2,
        landAreaAcres: 1.0,
        landType: 'Irrigated',
        irrigationSource: 'Tubewell',
        soilType: 'Clay',
        sowingDate: new Date('2024-07-18'),
        variety: 'Swarna',
        varietyDuration: 'Long',
        reportedPest: 'Blast',
        pestReportDate: new Date('2024-09-08'),
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: true,
        lastYieldQtl: 18,
        registeredOn: new Date('2023-08-10')
    },
    {
        id: '8',
        name: 'Rahim Sheikh',
        phone: '9832XXXX08',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 4,
        landAreaAcres: 1.8,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Loam',
        sowingDate: new Date('2024-07-12'),
        variety: 'MTU 1010',
        varietyDuration: 'Medium',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 38,
        fpoMember: 'Bhatar Paddy FPO',
        registeredOn: new Date('2022-02-28')
    },
    {
        id: '9',
        name: 'Kartik Majhi',
        phone: '9832XXXX09',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 5,
        landAreaAcres: 0.6,
        landType: 'Rainfed',
        irrigationSource: 'Rain-fed',
        soilType: 'Sandy',
        sowingDate: new Date('2024-08-05'),
        variety: 'IR 36',
        varietyDuration: 'Short',
        reportedPest: 'BPH',
        pestReportDate: new Date('2024-09-15'),
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: false,
        lastYieldQtl: 9,
        registeredOn: new Date('2024-01-05')
    },
    {
        id: '10',
        name: 'Dipak Bag',
        phone: '9832XXXX10',
        village: 'Bhatar',
        district: 'Purba Bardhaman',
        ward: 1,
        landAreaAcres: 1.4,
        landType: 'Irrigated',
        irrigationSource: 'Tubewell',
        soilType: 'Clay Loam',
        sowingDate: new Date('2024-07-22'),
        variety: 'Swarna',
        varietyDuration: 'Long',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 28,
        fpoMember: 'Bhatar Paddy FPO',
        registeredOn: new Date('2022-09-14')
    },

    // Memari Village (5 farmers)
    {
        id: '11',
        name: 'Tapan Sarkar',
        phone: '9733XXXX01',
        village: 'Memari',
        district: 'Purba Bardhaman',
        ward: 1,
        landAreaAcres: 2.5,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Clay',
        sowingDate: new Date('2024-07-08'),
        variety: 'Swarna',
        varietyDuration: 'Long',
        reportedPest: 'Sheath Blight',
        pestReportDate: new Date('2024-09-18'),
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 52,
        fpoMember: 'Memari Farmers Collective',
        registeredOn: new Date('2021-11-20')
    },
    {
        id: '12',
        name: 'Santosh Mahato',
        phone: '9733XXXX02',
        village: 'Memari',
        district: 'Purba Bardhaman',
        ward: 2,
        landAreaAcres: 1.2,
        landType: 'Rainfed',
        irrigationSource: 'Pond',
        soilType: 'Loam',
        sowingDate: new Date('2024-07-20'),
        variety: 'Sahbhagi Dhan',
        varietyDuration: 'Short',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: true,
        lastYieldQtl: 16,
        registeredOn: new Date('2023-05-10')
    },
    {
        id: '13',
        name: 'Nimai Halder',
        phone: '9733XXXX03',
        village: 'Memari',
        district: 'Purba Bardhaman',
        ward: 3,
        landAreaAcres: 0.8,
        landType: 'Partially Irrigated',
        irrigationSource: 'Mixed',
        soilType: 'Sandy',
        sowingDate: new Date('2024-07-25'),
        variety: 'IR 64',
        varietyDuration: 'Medium',
        reportedPest: 'Stem Borer',
        pestReportDate: new Date('2024-09-20'),
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: false,
        lastYieldQtl: 12,
        registeredOn: new Date('2024-03-01')
    },
    {
        id: '14',
        name: 'Ashok Pramanik',
        phone: '9733XXXX04',
        village: 'Memari',
        district: 'Purba Bardhaman',
        ward: 1,
        landAreaAcres: 3.5,
        landType: 'Irrigated',
        irrigationSource: 'Tubewell',
        soilType: 'Clay Loam',
        sowingDate: new Date('2024-07-05'),
        variety: 'Swarna Sub-1',
        varietyDuration: 'Long',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 72,
        fpoMember: 'Memari Farmers Collective',
        registeredOn: new Date('2020-08-15')
    },
    {
        id: '15',
        name: 'Ratan Biswas',
        phone: '9733XXXX05',
        village: 'Memari',
        district: 'Purba Bardhaman',
        ward: 4,
        landAreaAcres: 1.0,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Clay',
        sowingDate: new Date('2024-07-18'),
        variety: 'Gobindobhog',
        varietyDuration: 'Medium',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 11,
        registeredOn: new Date('2022-12-01')
    },

    // Galsi Village (5 farmers)
    {
        id: '16',
        name: 'Bikash Mondal',
        phone: '9635XXXX01',
        village: 'Galsi',
        district: 'Purba Bardhaman',
        ward: 1,
        landAreaAcres: 2.0,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Clay Loam',
        sowingDate: new Date('2024-07-10'),
        variety: 'Swarna',
        varietyDuration: 'Long',
        reportedPest: 'Blast',
        pestReportDate: new Date('2024-09-14'),
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 42,
        fpoMember: 'Galsi Agri Cooperative',
        registeredOn: new Date('2021-07-20')
    },
    {
        id: '17',
        name: 'Manik Saha',
        phone: '9635XXXX02',
        village: 'Galsi',
        district: 'Purba Bardhaman',
        ward: 2,
        landAreaAcres: 1.5,
        landType: 'Rainfed',
        irrigationSource: 'Rain-fed',
        soilType: 'Loam',
        sowingDate: new Date('2024-07-22'),
        variety: 'IR 36',
        varietyDuration: 'Short',
        reportedPest: 'BPH',
        pestReportDate: new Date('2024-09-16'),
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: true,
        lastYieldQtl: 22,
        registeredOn: new Date('2023-02-14')
    },
    {
        id: '18',
        name: 'Dulal Ghosh',
        phone: '9635XXXX03',
        village: 'Galsi',
        district: 'Purba Bardhaman',
        ward: 3,
        landAreaAcres: 0.6,
        landType: 'Partially Irrigated',
        irrigationSource: 'Pond',
        soilType: 'Sandy',
        sowingDate: new Date('2024-08-01'),
        variety: 'MTU 1010',
        varietyDuration: 'Medium',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: false,
        pmfbyEnrolled: false,
        lastYieldQtl: 10,
        registeredOn: new Date('2024-04-10')
    },
    {
        id: '19',
        name: 'Partha Das',
        phone: '9635XXXX04',
        village: 'Galsi',
        district: 'Purba Bardhaman',
        ward: 1,
        landAreaAcres: 4.0,
        landType: 'Irrigated',
        irrigationSource: 'Tubewell',
        soilType: 'Clay',
        sowingDate: new Date('2024-07-03'),
        variety: 'Swarna Sub-1',
        varietyDuration: 'Long',
        reportedPest: 'None',
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 85,
        fpoMember: 'Galsi Agri Cooperative',
        registeredOn: new Date('2019-10-05')
    },
    {
        id: '20',
        name: 'Sanjay Malik',
        phone: '9635XXXX05',
        village: 'Galsi',
        district: 'Purba Bardhaman',
        ward: 4,
        landAreaAcres: 1.8,
        landType: 'Irrigated',
        irrigationSource: 'Canal',
        soilType: 'Clay Loam',
        sowingDate: new Date('2024-07-15'),
        variety: 'MTU 7029',
        varietyDuration: 'Long',
        reportedPest: 'Brown Spot',
        pestReportDate: new Date('2024-09-10'),
        pmKisanRegistered: true,
        kccHolder: true,
        pmfbyEnrolled: true,
        lastYieldQtl: 38,
        registeredOn: new Date('2022-05-20')
    }
];

// Helper functions
export function getFarmersByVillage(village: string): Farmer[] {
    return MOCK_VILLAGE_DATA.filter(f => f.village === village);
}

export function getVillageStats(village: string): VillageStats {
    const farmers = getFarmersByVillage(village);

    if (farmers.length === 0) {
        return {
            village,
            district: 'Unknown',
            totalFarmers: 0,
            totalAcreage: 0,
            activeAlerts: 0,
            avgYieldLastYear: 0,
            dominantVariety: 'N/A',
            irrigationCoverage: 0
        };
    }

    const totalAcreage = farmers.reduce((sum, f) => sum + f.landAreaAcres, 0);
    const activeAlerts = farmers.filter(f => f.reportedPest && f.reportedPest !== 'None').length;
    const irrigatedAcres = farmers
        .filter(f => f.landType === 'Irrigated')
        .reduce((sum, f) => sum + f.landAreaAcres, 0);

    // Find dominant variety
    const varietyCounts: Record<string, number> = {};
    farmers.forEach(f => {
        varietyCounts[f.variety] = (varietyCounts[f.variety] || 0) + 1;
    });
    const dominantVariety = Object.entries(varietyCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculate average yield
    const yieldsReported = farmers.filter(f => f.lastYieldQtl !== undefined);
    const avgYield = yieldsReported.length > 0
        ? yieldsReported.reduce((sum, f) => sum + (f.lastYieldQtl || 0), 0) / yieldsReported.length
        : 0;

    return {
        village,
        district: farmers[0].district,
        totalFarmers: farmers.length,
        totalAcreage: Math.round(totalAcreage * 10) / 10,
        activeAlerts,
        avgYieldLastYear: Math.round(avgYield),
        dominantVariety,
        irrigationCoverage: Math.round((irrigatedAcres / totalAcreage) * 100)
    };
}

export function getTopPerformers(village?: string, limit: number = 5): Farmer[] {
    let farmers = village ? getFarmersByVillage(village) : MOCK_VILLAGE_DATA;
    return farmers
        .filter(f => f.lastYieldQtl !== undefined)
        .sort((a, b) => (b.lastYieldQtl || 0) / b.landAreaAcres - (a.lastYieldQtl || 0) / a.landAreaAcres)
        .slice(0, limit);
}

export function getPestReports(village?: string): { ward: number; pest: string; count: number; farmers: string[] }[] {
    let farmers = village ? getFarmersByVillage(village) : MOCK_VILLAGE_DATA;
    const reports: Record<string, { ward: number; pest: string; farmers: string[] }> = {};

    farmers
        .filter(f => f.reportedPest && f.reportedPest !== 'None')
        .forEach(f => {
            const key = `${f.ward}-${f.reportedPest}`;
            if (!reports[key]) {
                reports[key] = { ward: f.ward, pest: f.reportedPest!, farmers: [] };
            }
            reports[key].farmers.push(f.name);
        });

    return Object.values(reports).map(r => ({
        ...r,
        count: r.farmers.length
    }));
}

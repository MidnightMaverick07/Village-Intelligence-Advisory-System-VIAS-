// Enhanced Mandi (Market) data for West Bengal

export interface MandiRate {
    id: string;
    name: string;
    nameBn: string;
    district: string;
    todayRate: number;
    lastWeekRate: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: Date;
    distance?: number; // km from village
}

export interface VillageAlert {
    id: string;
    type: 'weather' | 'pest' | 'scheme' | 'price' | 'advisory';
    title: string;
    titleBn: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
    timestamp: Date;
    icon: string;
}

// Simulated mandi rates with realistic West Bengal markets
export function getMandiRates(villageName: string): MandiRate[] {
    const basePrice = 2320; // Current MSP for paddy
    const now = new Date();

    // Add some realistic variation based on time
    const hourVariation = (now.getHours() % 5) * 10;

    const markets: MandiRate[] = [
        {
            id: 'bardhaman',
            name: 'Bardhaman',
            nameBn: 'বর্ধমান',
            district: 'Purba Bardhaman',
            todayRate: basePrice + 45 + hourVariation,
            lastWeekRate: basePrice + 20,
            trend: 'up',
            lastUpdated: new Date(now.getTime() - 45 * 60 * 1000), // 45 min ago
            distance: 25,
        },
        {
            id: 'memari',
            name: 'Memari',
            nameBn: 'মেমারি',
            district: 'Purba Bardhaman',
            todayRate: basePrice + 30 + hourVariation,
            lastWeekRate: basePrice + 35,
            trend: 'down',
            lastUpdated: new Date(now.getTime() - 90 * 60 * 1000), // 1.5 hrs ago
            distance: 18,
        },
        {
            id: 'katwa',
            name: 'Katwa',
            nameBn: 'কাটোয়া',
            district: 'Purba Bardhaman',
            todayRate: basePrice + 55 + hourVariation,
            lastWeekRate: basePrice + 40,
            trend: 'up',
            lastUpdated: new Date(now.getTime() - 120 * 60 * 1000), // 2 hrs ago
            distance: 32,
        },
        {
            id: 'galsi',
            name: 'Galsi',
            nameBn: 'গালসী',
            district: 'Purba Bardhaman',
            todayRate: basePrice + 25 + hourVariation,
            lastWeekRate: basePrice + 25,
            trend: 'stable',
            lastUpdated: new Date(now.getTime() - 60 * 60 * 1000), // 1 hr ago
            distance: 15,
        },
        {
            id: 'ausgram',
            name: 'Ausgram',
            nameBn: 'আউশগ্রাম',
            district: 'Purba Bardhaman',
            todayRate: basePrice + 15 + hourVariation,
            lastWeekRate: basePrice + 30,
            trend: 'down',
            lastUpdated: new Date(now.getTime() - 180 * 60 * 1000), // 3 hrs ago
            distance: 22,
        },
        {
            id: 'nabadwip',
            name: 'Nabadwip',
            nameBn: 'নবদ্বীপ',
            district: 'Nadia',
            todayRate: basePrice + 60 + hourVariation,
            lastWeekRate: basePrice + 45,
            trend: 'up',
            lastUpdated: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
            distance: 45,
        },
    ];

    // Sort by today's rate (highest first)
    return markets.sort((a, b) => b.todayRate - a.todayRate);
}

export function getBestMandi(villageName: string): MandiRate {
    const rates = getMandiRates(villageName);
    return rates[0];
}

// Get local alerts for a village
export function getVillageAlerts(villageName: string, pestReports: any[]): VillageAlert[] {
    const now = new Date();
    const alerts: VillageAlert[] = [];

    // Weather-based alerts (simulated based on current conditions)
    const month = now.getMonth();
    if (month >= 5 && month <= 8) { // June-September (monsoon)
        alerts.push({
            id: 'monsoon-alert',
            type: 'weather',
            title: 'Heavy Rain Expected Tomorrow',
            titleBn: 'আগামীকাল ভারী বৃষ্টির সম্ভাবনা',
            description: 'IMD predicts 50-80mm rainfall. Avoid fertilizer application. Ensure drainage.',
            urgency: 'high',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            icon: '🌧️',
        });
    }

    // Pest alerts from actual reports
    if (pestReports && pestReports.length > 0) {
        pestReports.forEach((report, idx) => {
            alerts.push({
                id: `pest-${idx}`,
                type: 'pest',
                title: `${report.pest} Alert in Ward ${report.ward}`,
                titleBn: `ওয়ার্ড ${report.ward}-এ ${report.pest} সতর্কতা`,
                description: `${report.count} farmers reported. Take preventive measures immediately.`,
                urgency: 'high',
                timestamp: new Date(now.getTime() - (idx + 1) * 60 * 60 * 1000),
                icon: '🐛',
            });
        });
    }

    // Scheme deadline alerts
    alerts.push({
        id: 'pm-kisan',
        type: 'scheme',
        title: 'PM-KISAN Verification Due',
        titleBn: 'PM-KISAN যাচাইকরণ বাকি',
        description: 'eKYC verification required before Dec 31. Visit CSC center or use app.',
        urgency: 'medium',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        icon: '📋',
    });

    // Price alert
    const bestMandi = getBestMandi(villageName);
    if (bestMandi.trend === 'up') {
        alerts.push({
            id: 'price-up',
            type: 'price',
            title: `Paddy Price Up ₹${bestMandi.todayRate - bestMandi.lastWeekRate}/q`,
            titleBn: `ধানের দাম ₹${bestMandi.todayRate - bestMandi.lastWeekRate}/q বেড়েছে`,
            description: `Best rate today: ₹${bestMandi.todayRate}/q at ${bestMandi.name} mandi.`,
            urgency: 'medium',
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
            icon: '📈',
        });
    }

    // Advisory reminder
    alerts.push({
        id: 'advisory',
        type: 'advisory',
        title: 'Get Personalized Advisory',
        titleBn: 'আপনার জমির পরামর্শ নিন',
        description: 'Enter your field details to get crop-specific recommendations.',
        urgency: 'low',
        timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        icon: '💡',
    });

    // Sort by urgency and timestamp
    return alerts.sort((a, b) => {
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
    });
}

export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
}

export interface GovernmentScheme {
    id: string;
    name: string;
    nameHindi: string;
    description: string;
    eligibility: string[];
    benefits: string[];
    deadline?: string;
    applicationLink: string;
    documentsRequired: string[];
    status: 'Open' | 'Closing Soon' | 'Closed' | 'Year-round';
    icon: string;
    priority: number;
}

export interface MSPRate {
    crop: string;
    variety: string;
    mspPerQuintal: number;
    year: string;
    increaseFromLastYear: number;
}

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
    {
        id: "pmkisan",
        name: "PM-KISAN",
        nameHindi: "प्रधानमंत्री किसान सम्मान निधि",
        description: "Direct income support of ₹6,000 per year in 3 installments to landholding farmer families.",
        eligibility: [
            "Landholding farmer families",
            "Cultivable land up to 2 hectares",
            "Name in land records"
        ],
        benefits: [
            "₹2,000 every 4 months",
            "₹6,000 per year total",
            "Direct bank transfer"
        ],
        applicationLink: "https://pmkisan.gov.in",
        documentsRequired: ["Aadhaar Card", "Land Records (Patta/Khatian)", "Bank Passbook"],
        status: "Year-round",
        icon: "💰",
        priority: 1
    },
    {
        id: "pmfby",
        name: "PMFBY - Kharif 2024",
        nameHindi: "प्रधानमंत्री फसल बीमा योजना",
        description: "Crop insurance scheme to provide financial support in case of crop loss due to natural calamities.",
        eligibility: [
            "All farmers (loanee and non-loanee)",
            "Growing notified crops",
            "Valid land documents"
        ],
        benefits: [
            "Premium: 2% for Kharif, 1.5% for Rabi",
            "Full sum insured on crop loss",
            "Coverage for prevented sowing"
        ],
        deadline: "31st July 2024",
        applicationLink: "https://pmfby.gov.in",
        documentsRequired: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
        status: "Closing Soon",
        icon: "🛡️",
        priority: 1
    },
    {
        id: "rkvy",
        name: "RKVY-RAFTAAR",
        nameHindi: "राष्ट्रीय कृषि विकास योजना",
        description: "Support for agri-startups and infrastructure development in agriculture sector.",
        eligibility: [
            "Farmer Producer Organizations",
            "Agri-entrepreneurs",
            "Registered cooperatives"
        ],
        benefits: [
            "Up to ₹25 lakhs for startups",
            "Infrastructure development support",
            "Capacity building training"
        ],
        applicationLink: "https://rkvy.nic.in",
        documentsRequired: ["Registration Certificate", "Business Plan", "Bank Account"],
        status: "Open",
        icon: "🚀",
        priority: 3
    },
    {
        id: "pmksy",
        name: "PM Krishi Sinchai Yojana",
        nameHindi: "प्रधानमंत्री कृषि सिंचाई योजना",
        description: "Subsidy for micro-irrigation systems like drip and sprinkler irrigation.",
        eligibility: [
            "All categories of farmers",
            "Land ownership or lease documents",
            "Source of water available"
        ],
        benefits: [
            "55% subsidy for small/marginal farmers",
            "45% subsidy for other farmers",
            "Drip and sprinkler systems"
        ],
        applicationLink: "https://pmksy.gov.in",
        documentsRequired: ["Aadhaar Card", "Land Records", "Caste Certificate (if SC/ST)"],
        status: "Open",
        icon: "💧",
        priority: 2
    },
    {
        id: "kcc",
        name: "Kisan Credit Card",
        nameHindi: "किसान क्रेडिट कार्ड",
        description: "Provides farmers with timely access to credit at low interest rates for agricultural needs.",
        eligibility: [
            "Owner cultivators",
            "Tenant farmers, sharecroppers",
            "Self Help Groups"
        ],
        benefits: [
            "Interest rate: 7% (3% subsidy available)",
            "Effective rate: 4% with prompt repayment",
            "Credit limit based on landholding"
        ],
        applicationLink: "https://www.nabard.org",
        documentsRequired: ["Aadhaar Card", "Land Records", "Passport Photo", "Identity Proof"],
        status: "Year-round",
        icon: "💳",
        priority: 1
    },
    {
        id: "smam",
        name: "Sub-Mission on Agricultural Mechanization",
        nameHindi: "कृषि यंत्रीकरण उप-मिशन",
        description: "Subsidy for purchase of agricultural machinery and equipment.",
        eligibility: [
            "Individual farmers",
            "FPOs and cooperatives",
            "Custom Hiring Centers"
        ],
        benefits: [
            "40-50% subsidy on machinery",
            "Tractors, harvesters, transplanters",
            "Post-harvest equipment"
        ],
        applicationLink: "https://agrimachinery.nic.in",
        documentsRequired: ["Aadhaar Card", "Land Records", "Bank Account", "Quotation from dealer"],
        status: "Open",
        icon: "🚜",
        priority: 2
    }
];

export const MSP_RATES: MSPRate[] = [
    { crop: "Paddy (Common)", variety: "Common", mspPerQuintal: 2183, year: "2024-25", increaseFromLastYear: 117 },
    { crop: "Paddy (Grade A)", variety: "Grade A", mspPerQuintal: 2203, year: "2024-25", increaseFromLastYear: 117 },
    { crop: "Wheat", variety: "Common", mspPerQuintal: 2275, year: "2024-25", increaseFromLastYear: 150 },
    { crop: "Maize", variety: "Common", mspPerQuintal: 2225, year: "2024-25", increaseFromLastYear: 135 },
    { crop: "Tur (Arhar)", variety: "Common", mspPerQuintal: 7000, year: "2024-25", increaseFromLastYear: 400 },
    { crop: "Moong", variety: "Common", mspPerQuintal: 8558, year: "2024-25", increaseFromLastYear: 196 },
    { crop: "Groundnut", variety: "Common", mspPerQuintal: 6377, year: "2024-25", increaseFromLastYear: 200 },
    { crop: "Mustard", variety: "Common", mspPerQuintal: 5650, year: "2024-25", increaseFromLastYear: 200 }
];

export function getUrgentSchemes(): GovernmentScheme[] {
    return GOVERNMENT_SCHEMES.filter(s => s.status === 'Closing Soon' || s.priority === 1);
}

export function getSchemesByStatus(status: GovernmentScheme['status']): GovernmentScheme[] {
    return GOVERNMENT_SCHEMES.filter(s => s.status === status);
}

export function getPaddyMSP(): MSPRate | undefined {
    return MSP_RATES.find(m => m.crop === "Paddy (Common)");
}

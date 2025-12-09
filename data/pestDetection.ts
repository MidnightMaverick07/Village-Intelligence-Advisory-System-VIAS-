// Pest/Disease detection data for rice crops
// Mock data simulating ML model detection results

export interface PestDetection {
    id: string;
    name: string;
    nameBn: string;
    type: 'disease' | 'pest' | 'nutrient' | 'healthy';
    confidence: number; // 0-100
    severity: 'low' | 'medium' | 'high' | 'critical';
    symptoms: string[];
    treatment: string[];
    preventiveMeasures: string[];
    icon: string;
    color: string;
}

export const PEST_DATABASE: PestDetection[] = [
    {
        id: 'blast',
        name: 'Rice Blast',
        nameBn: 'ব্লাস্ট রোগ',
        type: 'disease',
        confidence: 85,
        severity: 'high',
        symptoms: [
            'Diamond-shaped lesions on leaves',
            'White/gray centers with brown borders',
            'Neck rot causing panicle breakage',
        ],
        treatment: [
            'Spray Tricyclazole 75% WP @ 0.6g/L',
            'Apply Carbendazim 50% WP @ 1g/L',
            'Drain excess water from field',
        ],
        preventiveMeasures: [
            'Use resistant varieties (Swarna-Sub1)',
            'Avoid excess nitrogen fertilizer',
            'Maintain proper spacing between plants',
        ],
        icon: '🍂',
        color: 'red',
    },
    {
        id: 'brown_spot',
        name: 'Brown Spot',
        nameBn: 'বাদামী দাগ রোগ',
        type: 'disease',
        confidence: 78,
        severity: 'medium',
        symptoms: [
            'Small brown spots on leaves',
            'Oval lesions with gray center',
            'Spots merge to form large patches',
        ],
        treatment: [
            'Spray Mancozeb 75% WP @ 2.5g/L',
            'Apply Propiconazole @ 1ml/L',
            'Foliar spray of potassium sulfate',
        ],
        preventiveMeasures: [
            'Use disease-free seeds',
            'Apply balanced fertilizers',
            'Avoid water stress',
        ],
        icon: '🟤',
        color: 'amber',
    },
    {
        id: 'sheath_blight',
        name: 'Sheath Blight',
        nameBn: 'শীথ ব্লাইট',
        type: 'disease',
        confidence: 82,
        severity: 'high',
        symptoms: [
            'Oval spots on sheath near water level',
            'Greenish-gray irregular lesions',
            'Web-like fungal growth in humid conditions',
        ],
        treatment: [
            'Spray Hexaconazole 5% EC @ 2ml/L',
            'Apply Validamycin 3L @ 2.5ml/L',
            'Reduce plant density',
        ],
        preventiveMeasures: [
            'Avoid dense planting',
            'Deep summer ploughing',
            'Remove crop residues',
        ],
        icon: '🌾',
        color: 'orange',
    },
    {
        id: 'bph',
        name: 'Brown Planthopper (BPH)',
        nameBn: 'বাদামী ঘাসফলি',
        type: 'pest',
        confidence: 88,
        severity: 'critical',
        symptoms: [
            'Yellowing and drying of tillers',
            'Hopper burn patches in field',
            'Presence of honeydew on plants',
        ],
        treatment: [
            'Spray Imidacloprid 17.8% SL @ 0.5ml/L',
            'Apply Thiamethoxam 25% WG @ 0.5g/L',
            'Drain water to expose hoppers',
        ],
        preventiveMeasures: [
            'Avoid excess nitrogen',
            'Install light traps',
            'Maintain 2-3 cm water level only',
        ],
        icon: '🪲',
        color: 'red',
    },
    {
        id: 'stem_borer',
        name: 'Stem Borer',
        nameBn: 'মাজরা পোকা',
        type: 'pest',
        confidence: 80,
        severity: 'medium',
        symptoms: [
            'Dead hearts in vegetative stage',
            'White ears (empty panicles)',
            'Bore holes at stem base',
        ],
        treatment: [
            'Apply Cartap Hydrochloride 4G @ 25kg/ha',
            'Spray Chlorantraniliprole @ 0.4ml/L',
            'Install pheromone traps',
        ],
        preventiveMeasures: [
            'Early transplanting',
            'Remove stubbles after harvest',
            'Clip seedling tips before transplanting',
        ],
        icon: '🐛',
        color: 'orange',
    },
    {
        id: 'nitrogen_deficiency',
        name: 'Nitrogen Deficiency',
        nameBn: 'নাইট্রোজেনের অভাব',
        type: 'nutrient',
        confidence: 75,
        severity: 'medium',
        symptoms: [
            'Pale yellow-green leaves',
            'Stunted plant growth',
            'Lower leaves turn yellow first',
        ],
        treatment: [
            'Apply Urea @ 30-40 kg/acre',
            'Use DAP for quick nitrogen boost',
            'Foliar spray of 2% Urea solution',
        ],
        preventiveMeasures: [
            'Soil testing before planting',
            'Split nitrogen application',
            'Use organic manures',
        ],
        icon: '💛',
        color: 'yellow',
    },
    {
        id: 'healthy',
        name: 'Healthy Plant',
        nameBn: 'সুস্থ গাছ',
        type: 'healthy',
        confidence: 92,
        severity: 'low',
        symptoms: [
            'Dark green leaves',
            'Strong tillers',
            'No visible damage',
        ],
        treatment: [],
        preventiveMeasures: [
            'Continue current practices',
            'Monitor regularly',
            'Maintain proper water management',
        ],
        icon: '✅',
        color: 'green',
    },
];

// Mock function to simulate image analysis
export function analyzeImage(imageFile: File): Promise<PestDetection> {
    return new Promise((resolve) => {
        // Simulate processing time
        const randomDelay = 2000 + Math.random() * 2000;

        setTimeout(() => {
            // Randomly select a detection (in real implementation, this would be ML model)
            const detections = PEST_DATABASE.filter(p => p.type !== 'healthy');
            const randomIndex = Math.floor(Math.random() * (detections.length + 1));

            if (randomIndex >= detections.length) {
                // 1 in N chance of healthy
                resolve(PEST_DATABASE.find(p => p.id === 'healthy')!);
            } else {
                // Add some variation to confidence
                const detection = { ...detections[randomIndex] };
                detection.confidence = Math.max(60, Math.min(95, detection.confidence + Math.floor(Math.random() * 20) - 10));
                resolve(detection);
            }
        }, randomDelay);
    });
}

export function getDetectionById(id: string): PestDetection | undefined {
    return PEST_DATABASE.find(p => p.id === id);
}

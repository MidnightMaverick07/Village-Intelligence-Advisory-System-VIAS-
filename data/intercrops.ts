// Common intercropping combinations for paddy farmers in West Bengal

export interface IntercropInfo {
    id: string;
    name: string;
    nameBn: string;
    type: 'main' | 'intercrop';
    category: 'cereal' | 'pulse' | 'vegetable' | 'oilseed';
    sowingOffset: number; // days after main crop sowing
    harvestDays: number;
    yieldPerAcre: number; // kg
    pricePerKg: number;
    tips: string;
}

export const CROP_OPTIONS: IntercropInfo[] = [
    // Main crops (Rice varieties)
    { id: 'swarna', name: 'Swarna (Rice)', nameBn: 'স্বর্ণা (ধান)', type: 'main', category: 'cereal', sowingOffset: 0, harvestDays: 140, yieldPerAcre: 1800, pricePerKg: 23, tips: 'Popular medium-duration variety, good for lowlands' },
    { id: 'mtuerathi', name: 'MTU-7029 (Rice)', nameBn: 'MTU-7029 (ধান)', type: 'main', category: 'cereal', sowingOffset: 0, harvestDays: 130, yieldPerAcre: 2000, pricePerKg: 23, tips: 'High-yielding, medium grain' },
    { id: 'gobindobhog', name: 'Gobindobhog (Rice)', nameBn: 'গোবিন্দভোগ (ধান)', type: 'main', category: 'cereal', sowingOffset: 0, harvestDays: 120, yieldPerAcre: 1200, pricePerKg: 80, tips: 'Premium aromatic variety' },
    { id: 'iri368', name: 'IR-36 (Rice)', nameBn: 'IR-36 (ধান)', type: 'main', category: 'cereal', sowingOffset: 0, harvestDays: 110, yieldPerAcre: 1600, pricePerKg: 22, tips: 'Short duration, drought resistant' },

    // Pulse intercrops
    { id: 'blackgram', name: 'Black Gram (Urad)', nameBn: 'কলাই (মাষকলাই)', type: 'intercrop', category: 'pulse', sowingOffset: 60, harvestDays: 80, yieldPerAcre: 300, pricePerKg: 90, tips: 'Sow on bunds after first weeding' },
    { id: 'greengram', name: 'Green Gram (Moong)', nameBn: 'মুগ ডাল', type: 'intercrop', category: 'pulse', sowingOffset: 0, harvestDays: 70, yieldPerAcre: 350, pricePerKg: 85, tips: 'Can be sown before rice transplanting' },
    { id: 'lentil', name: 'Lentil (Masoor)', nameBn: 'মসুর ডাল', type: 'intercrop', category: 'pulse', sowingOffset: 100, harvestDays: 120, yieldPerAcre: 400, pricePerKg: 70, tips: 'Sow after rice harvest in rabi season' },

    // Vegetable intercrops
    { id: 'cucumber', name: 'Cucumber', nameBn: 'শসা', type: 'intercrop', category: 'vegetable', sowingOffset: 30, harvestDays: 60, yieldPerAcre: 3000, pricePerKg: 25, tips: 'Grow on raised bunds' },
    { id: 'pumpkin', name: 'Pumpkin', nameBn: 'কুমড়ো', type: 'intercrop', category: 'vegetable', sowingOffset: 30, harvestDays: 90, yieldPerAcre: 5000, pricePerKg: 15, tips: 'Space plants on field edges' },
    { id: 'bottlegourd', name: 'Bottle Gourd', nameBn: 'লাউ', type: 'intercrop', category: 'vegetable', sowingOffset: 30, harvestDays: 70, yieldPerAcre: 4000, pricePerKg: 18, tips: 'Needs trellis on bund edges' },
    { id: 'spinach', name: 'Spinach', nameBn: 'পালং শাক', type: 'intercrop', category: 'vegetable', sowingOffset: 90, harvestDays: 45, yieldPerAcre: 2000, pricePerKg: 30, tips: 'Quick harvest after rice' },

    // Oilseed intercrops  
    { id: 'mustard', name: 'Mustard', nameBn: 'সরিষা', type: 'intercrop', category: 'oilseed', sowingOffset: 110, harvestDays: 100, yieldPerAcre: 500, pricePerKg: 55, tips: 'Best rabi crop after paddy' },
    { id: 'sesame', name: 'Sesame (Til)', nameBn: 'তিল', type: 'intercrop', category: 'oilseed', sowingOffset: 0, harvestDays: 90, yieldPerAcre: 200, pricePerKg: 120, tips: 'Can intercrop with rice in uplands' },
];

export const INTERCROP_COMBOS = [
    { main: 'swarna', intercrops: ['blackgram', 'pumpkin'], benefit: 'Pulses fix nitrogen, reduce fertilizer needs' },
    { main: 'swarna', intercrops: ['mustard'], benefit: 'Mustard after rice uses residual moisture' },
    { main: 'mtuerathi', intercrops: ['greengram', 'cucumber'], benefit: 'Quick moong harvest before transplanting' },
    { main: 'gobindobhog', intercrops: ['spinach', 'lentil'], benefit: 'Premium rice + vegetables for local market' },
];

export function getCropById(id: string): IntercropInfo | undefined {
    return CROP_OPTIONS.find(c => c.id === id);
}

export function getMainCrops(): IntercropInfo[] {
    return CROP_OPTIONS.filter(c => c.type === 'main');
}

export function getIntercrops(): IntercropInfo[] {
    return CROP_OPTIONS.filter(c => c.type === 'intercrop');
}

export function getIntercropsByCategory(category: IntercropInfo['category']): IntercropInfo[] {
    return CROP_OPTIONS.filter(c => c.type === 'intercrop' && c.category === category);
}

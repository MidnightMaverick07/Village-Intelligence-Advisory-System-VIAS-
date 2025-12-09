// Glossary of agricultural terms with definitions and conversions

export interface GlossaryTerm {
    term: string;
    termBn: string;
    definition: string;
    definitionBn: string;
    category: 'unit' | 'chemical' | 'pest' | 'disease' | 'scheme' | 'crop' | 'general';
    conversion?: {
        value: number;
        unit: string;
        formula: string;
    };
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
    // Units
    quintal: {
        term: 'Quintal',
        termBn: 'কুইন্টাল',
        definition: 'A unit of weight equal to 100 kilograms, commonly used for grains.',
        definitionBn: '১০০ কিলোগ্রামের সমান ওজনের একক, শস্যের জন্য ব্যবহৃত।',
        category: 'unit',
        conversion: { value: 100, unit: 'kg', formula: '1 quintal = 100 kg' },
    },
    katha: {
        term: 'Katha',
        termBn: 'কাঠা',
        definition: 'A unit of land area. In West Bengal, 1 katha = 720 sq feet = 66.89 sq meters.',
        definitionBn: 'জমির পরিমাপ একক। পশ্চিমবঙ্গে ১ কাঠা = ৭২০ বর্গফুট = ৬৬.৮৯ বর্গমিটার।',
        category: 'unit',
        conversion: { value: 66.89, unit: 'sq m', formula: '1 katha = 720 sq ft = 66.89 sq m' },
    },
    bigha: {
        term: 'Bigha',
        termBn: 'বিঘা',
        definition: 'A unit of land. In West Bengal, 1 bigha = 20 katha = 0.33 acres.',
        definitionBn: 'জমির একক। পশ্চিমবঙ্গে ১ বিঘা = ২০ কাঠা = ০.৩৩ একর।',
        category: 'unit',
        conversion: { value: 0.33, unit: 'acres', formula: '1 bigha = 20 katha = 0.33 acres' },
    },
    acre: {
        term: 'Acre',
        termBn: 'একর',
        definition: 'A unit of land equal to 4,047 sq meters or 100 decimals.',
        definitionBn: 'জমির একক, ৪,০৪৭ বর্গমিটার বা ১০০ শতাংশ।',
        category: 'unit',
        conversion: { value: 4047, unit: 'sq m', formula: '1 acre = 4047 sq m = 3 bigha' },
    },

    // Schemes
    msp: {
        term: 'MSP (Minimum Support Price)',
        termBn: 'ন্যূনতম সহায়ক মূল্য',
        definition: 'Government-guaranteed minimum price for crops. Paddy MSP 2024-25 is ₹2,320/quintal.',
        definitionBn: 'ফসলের জন্য সরকার নির্ধারিত সর্বনিম্ন মূল্য। ধানের MSP ২০২৪-২৫ হল ₹২,৩২০/কুইন্টাল।',
        category: 'scheme',
    },
    pmkisan: {
        term: 'PM-KISAN',
        termBn: 'প্রধানমন্ত্রী কিষাণ',
        definition: 'Direct cash transfer of ₹6,000/year to farmers in 3 installments of ₹2,000 each.',
        definitionBn: 'কৃষকদের প্রতি বছর ₹৬,০০০ সরাসরি ব্যাংকে, ৩টি কিস্তিতে।',
        category: 'scheme',
    },

    // Chemicals
    tricyclazole: {
        term: 'Tricyclazole 75% WP',
        termBn: 'ট্রাইসাইক্লাজোল',
        definition: 'A systemic fungicide used against Rice Blast disease. Use 0.6g per liter of water.',
        definitionBn: 'ব্লাস্ট রোগের বিরুদ্ধে ছত্রাকনাশক। প্রতি লিটার জলে ০.৬ গ্রাম ব্যবহার করুন।',
        category: 'chemical',
    },
    carbendazim: {
        term: 'Carbendazim 50% WP',
        termBn: 'কার্বেন্ডাজিম',
        definition: 'A broad-spectrum fungicide for rice diseases. Use 1g per liter of water.',
        definitionBn: 'ধানের রোগে ব্যবহৃত ছত্রাকনাশক। প্রতি লিটার জলে ১ গ্রাম।',
        category: 'chemical',
    },
    imidacloprid: {
        term: 'Imidacloprid 17.8% SL',
        termBn: 'ইমিডাক্লোপ্রিড',
        definition: 'An insecticide for BPH (Brown Planthopper) control. Use 0.5ml per liter.',
        definitionBn: 'বাদামী ঘাসফলি দমনে কীটনাশক। প্রতি লিটারে ০.৫ মিলি।',
        category: 'chemical',
    },
    urea: {
        term: 'Urea',
        termBn: 'ইউরিয়া',
        definition: 'Nitrogen fertilizer (46% N). Apply in 2-3 splits during crop growth.',
        definitionBn: 'নাইট্রোজেন সার (৪৬% N)। ফসল বৃদ্ধির সময় ২-৩ বারে দিন।',
        category: 'chemical',
    },
    dap: {
        term: 'DAP (Di-Ammonium Phosphate)',
        termBn: 'ডিএপি',
        definition: 'Phosphorus fertilizer containing 18% N and 46% P. Used as basal dose.',
        definitionBn: 'ফসফরাস সার, ১৮% নাইট্রোজেন ও ৪৬% ফসফরাস। মূল সার হিসেবে ব্যবহৃত।',
        category: 'chemical',
    },
    mop: {
        term: 'MOP (Muriate of Potash)',
        termBn: 'এমওপি (পটাশ)',
        definition: 'Potassium fertilizer (60% K2O). Improves grain filling and disease resistance.',
        definitionBn: 'পটাশিয়াম সার (৬০% K2O)। দানা ভরাট ও রোগ প্রতিরোধ বাড়ায়।',
        category: 'chemical',
    },

    // Pests & Diseases
    bph: {
        term: 'BPH (Brown Planthopper)',
        termBn: 'বাদামী ঘাসফলি',
        definition: 'A serious rice pest that sucks plant sap, causing "hopper burn" and crop death.',
        definitionBn: 'একটি মারাত্মক ধানের পোকা যা গাছের রস চুষে নেয়, ফসল মরে যায়।',
        category: 'pest',
    },
    stemborer: {
        term: 'Stem Borer (Majra Poka)',
        termBn: 'মাজরা পোকা',
        definition: 'Caterpillars that bore into rice stems, causing "dead hearts" and white ears.',
        definitionBn: 'শুঁয়োপোকা যা ধানের কাণ্ডে ছিদ্র করে, "মরা শীষ" তৈরি করে।',
        category: 'pest',
    },
    blast: {
        term: 'Rice Blast',
        termBn: 'ব্লাস্ট রোগ',
        definition: 'A fungal disease causing diamond-shaped lesions on leaves. Serious in humid weather.',
        definitionBn: 'পাতায় হীরা আকৃতির দাগ তৈরি করে। আর্দ্র আবহাওয়ায় মারাত্মক।',
        category: 'disease',
    },
    sheathblight: {
        term: 'Sheath Blight',
        termBn: 'শীথ ব্লাইট',
        definition: 'A fungal disease with oval lesions on leaf sheaths near water level.',
        definitionBn: 'পাতার খোলে ডিম্বাকার দাগ তৈরি করে, জলের কাছে বেশি হয়।',
        category: 'disease',
    },

    // Crop Terms
    tillering: {
        term: 'Tillering',
        termBn: 'কুশি স্তর',
        definition: 'The stage when rice plants produce side shoots (tillers). More tillers = more panicles.',
        definitionBn: 'যখন ধান গাছ পাশের শাখা (কুশি) তৈরি করে। বেশি কুশি = বেশি শীষ।',
        category: 'crop',
    },
    panicle: {
        term: 'Panicle',
        termBn: 'শীষ',
        definition: 'The grain-bearing structure of rice. One panicle can have 100-200 grains.',
        definitionBn: 'ধানের দানাযুক্ত অংশ। একটি শীষে ১০০-২০০ দানা থাকতে পারে।',
        category: 'crop',
    },
};

// Get a single term
export function getTerm(key: string): GlossaryTerm | undefined {
    return GLOSSARY[key.toLowerCase()];
}

// Search terms
export function searchGlossary(query: string): GlossaryTerm[] {
    const q = query.toLowerCase();
    return Object.values(GLOSSARY).filter(
        term => term.term.toLowerCase().includes(q) ||
            term.termBn.includes(query) ||
            term.definition.toLowerCase().includes(q)
    );
}

// Unit conversions
export const CONVERSIONS = {
    quintalToKg: (q: number) => q * 100,
    kgToQuintal: (kg: number) => kg / 100,
    kathaToSqM: (k: number) => k * 66.89,
    sqMToKatha: (m: number) => m / 66.89,
    bighaToAcre: (b: number) => b * 0.33,
    acreToBigha: (a: number) => a / 0.33,
    acreToKatha: (a: number) => a * 60.5, // WB specific
    kathaToAcre: (k: number) => k / 60.5,
};

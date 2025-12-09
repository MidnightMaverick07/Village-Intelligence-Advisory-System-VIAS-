// Village data that can be used by both server and client components

export interface VillageInfo {
    name: string;
    district: string;
    lat: number;
    long: number;
}

export const VILLAGES: Record<string, VillageInfo> = {
    "Bhatar": { name: "Bhatar", district: "Purba Bardhaman", lat: 23.42, long: 87.91 },
    "Memari": { name: "Memari", district: "Purba Bardhaman", lat: 23.19, long: 88.11 },
    "Galsi": { name: "Galsi", district: "Purba Bardhaman", lat: 23.33, long: 87.69 },
    "Garbeta": { name: "Garbeta", district: "Paschim Medinipur", lat: 22.86, long: 87.36 },
    "Sainthia": { name: "Sainthia", district: "Birbhum", lat: 23.94, long: 87.68 },
};

export function getVillageKeys(): string[] {
    return Object.keys(VILLAGES);
}

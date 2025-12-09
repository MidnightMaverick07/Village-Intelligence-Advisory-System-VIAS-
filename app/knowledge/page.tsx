import { BookOpen, Bug, Droplets, ThermometerSun, Sprout, Video, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface DiseaseGuide {
    name: string;
    icon: string;
    symptoms: string[];
    favorableConditions: string;
    management: string[];
    chemicals: string[];
}

const DISEASE_GUIDES: DiseaseGuide[] = [
    {
        name: "Blast Disease (ব্লাস্ট)",
        icon: "🍄",
        symptoms: [
            "Diamond-shaped lesions on leaves with gray center and brown margin",
            "Neck blast causes panicle to break at neck",
            "Whitehead formation (unfilled grains)"
        ],
        favorableConditions: "Temperature 20-28°C, high humidity (>80%), rainy weather, excess nitrogen",
        management: [
            "Use resistant varieties (Swarna Sub-1)",
            "Avoid excess nitrogen application",
            "Maintain proper plant spacing"
        ],
        chemicals: [
            "Tricyclazole 75 WP @ 0.6g/L",
            "Isoprothiolane 40 EC @ 1.5ml/L",
            "Carbendazim 50 WP @ 1g/L"
        ]
    },
    {
        name: "Brown Spot (বাদামী দাগ)",
        icon: "🟤",
        symptoms: [
            "Oval brown spots with gray center on leaves",
            "Spots on glumes cause spotted/discolored grains",
            "Seedling blight in nursery"
        ],
        favorableConditions: "Temperature 25-30°C, nutrient deficiency (especially K), drought stress",
        management: [
            "Apply balanced fertilizers especially potassium",
            "Seed treatment before sowing",
            "Proper field drainage"
        ],
        chemicals: [
            "Mancozeb 75 WP @ 2.5g/L",
            "Propiconazole 25 EC @ 1ml/L",
            "Carbendazim 50 WP @ 1g/L"
        ]
    },
    {
        name: "Sheath Blight (শিথ ব্লাইট)",
        icon: "🦠",
        symptoms: [
            "Oval/irregular greenish-gray lesions on leaf sheath",
            "Lesions enlarge and coalesce",
            "Lodging in severe cases"
        ],
        favorableConditions: "Temperature >28°C, very high humidity (>85%), dense plant population",
        management: [
            "Maintain proper plant spacing",
            "Avoid excess nitrogen",
            "Remove lower senescent leaves"
        ],
        chemicals: [
            "Hexaconazole 5 SC @ 2ml/L",
            "Validamycin 3L @ 2.5ml/L",
            "Propiconazole 25 EC @ 1ml/L"
        ]
    },
    {
        name: "Brown Planthopper (BPH) (বাদামী ফড়িং)",
        icon: "🪲",
        symptoms: [
            "'Hopper burn' - circular patches of dried plants",
            "Honeydew secretion leads to sooty mold",
            "Plants dry and turn brown"
        ],
        favorableConditions: "High humidity, moderate temperature (25-30°C), excess nitrogen",
        management: [
            "Install light traps (1 per acre)",
            "Drain field water to expose hoppers",
            "Avoid excess nitrogen"
        ],
        chemicals: [
            "Imidacloprid 17.8 SL @ 0.5ml/L",
            "Buprofezin 25 SC @ 1ml/L",
            "Pymetrozine 50 WG @ 0.3g/L"
        ]
    },
    {
        name: "Stem Borer (মাজরা পোকা)",
        icon: "🐛",
        symptoms: [
            "'Dead heart' in vegetative stage",
            "'White ear' in reproductive stage",
            "Caterpillar bore holes visible on stem"
        ],
        favorableConditions: "Warm humid conditions, stubble left after harvest",
        management: [
            "Set up pheromone traps (5 per acre)",
            "Collect and destroy egg masses",
            "Clip tips of seedlings before transplanting"
        ],
        chemicals: [
            "Chlorantraniliprole 0.4 GR @ 4kg/acre",
            "Fipronil 0.3 GR @ 10kg/acre",
            "Cartap hydrochloride 4G @ 7kg/acre"
        ]
    }
];

const VIDEO_RESOURCES = [
    { title: "Blast Disease Management in Rice", url: "https://www.youtube.com/results?search_query=rice+blast+disease+management+india" },
    { title: "BPH Control in Paddy", url: "https://www.youtube.com/results?search_query=BPH+brown+planthopper+control+paddy" },
    { title: "Stem Borer Prevention", url: "https://www.youtube.com/results?search_query=stem+borer+paddy+control" },
    { title: "Integrated Pest Management in Rice", url: "https://www.youtube.com/results?search_query=IPM+rice+farming+india" },
];

const USEFUL_LINKS = [
    { name: "ICAR-NRRI (National Rice Research Institute)", url: "https://icar-nrri.in/" },
    { name: "West Bengal Agriculture Department", url: "https://wb.gov.in/department-agriculture.aspx" },
    { name: "PM-KISAN Portal", url: "https://pmkisan.gov.in/" },
    { name: "PMFBY Portal", url: "https://pmfby.gov.in/" },
    { name: "Kisan Call Center: 1800-180-1551", url: "tel:18001801551" },
    { name: "mKisan Portal", url: "https://mkisan.gov.in/" },
];

export default function KnowledgePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <BookOpen className="text-indigo-600" /> Knowledge Base
                </h1>
                <p className="text-slate-600 mt-2">
                    Learn about rice diseases, pests, and best farming practices
                </p>
            </header>

            {/* Disease Identification Guides */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Bug className="text-red-500" /> Disease & Pest Identification Guide
                </h2>
                <div className="space-y-6">
                    {DISEASE_GUIDES.map((disease, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-start gap-4 mb-4">
                                <span className="text-4xl">{disease.icon}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{disease.name}</h3>
                                    <p className="text-sm text-slate-600">{disease.favorableConditions}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-red-50 p-4 rounded-xl">
                                    <h4 className="font-semibold text-red-800 mb-2">Symptoms</h4>
                                    <ul className="space-y-1 text-sm text-slate-700">
                                        {disease.symptoms.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-red-500 mt-1">•</span>
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-4 rounded-xl">
                                    <h4 className="font-semibold text-green-800 mb-2">Management</h4>
                                    <ul className="space-y-1 text-sm text-slate-700">
                                        {disease.management.map((m, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-500 mt-1">✓</span>
                                                <span>{m}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-xl">
                                    <h4 className="font-semibold text-purple-800 mb-2">Chemical Control</h4>
                                    <ul className="space-y-1 text-sm text-slate-700">
                                        {disease.chemicals.map((c, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-purple-500 mt-1">💊</span>
                                                <span>{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Video Resources */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Video className="text-red-600" /> Video Tutorials
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {VIDEO_RESOURCES.map((video, idx) => (
                        <Link
                            key={idx}
                            href={video.url}
                            target="_blank"
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors"
                        >
                            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                                <Video className="text-red-600" />
                            </div>
                            <p className="font-medium text-slate-800">{video.title}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                Watch on YouTube <ExternalLink size={10} />
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Useful Links */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Useful Resources
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {USEFUL_LINKS.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url}
                            target="_blank"
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between"
                        >
                            <span className="font-medium text-slate-700">{link.name}</span>
                            <ExternalLink size={14} className="text-slate-400" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Emergency Contact */}
            <section className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Need Expert Help?</h3>
                        <p className="opacity-90">Contact Kisan Call Center for free advice</p>
                    </div>
                    <Link
                        href="tel:18001801551"
                        className="bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
                    >
                        📞 1800-180-1551 (Toll Free)
                    </Link>
                </div>
            </section>
        </div>
    );
}

"use client";

import { MOCK_VILLAGE_DATA, Farmer } from "@/data/mockVillage";
import { Users, Search, Phone, Sprout, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, CreditCard, Shield, Home } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FarmersPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [villageFilter, setVillageFilter] = useState<string>("All");
    const [statusFilter, setStatusFilter] = useState<string>("all"); // healthy, problem, all
    const [expandedFarmer, setExpandedFarmer] = useState<string | null>(null);

    const villages = Array.from(new Set(MOCK_VILLAGE_DATA.map(f => f.village)));

    const filteredFarmers = MOCK_VILLAGE_DATA.filter(farmer => {
        const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.phone.includes(searchTerm);
        const matchesVillage = villageFilter === "All" || farmer.village === villageFilter;
        const hasProblem = farmer.reportedPest && farmer.reportedPest !== 'None';
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "healthy" && !hasProblem) ||
            (statusFilter === "problem" && hasProblem);
        return matchesSearch && matchesVillage && matchesStatus;
    });

    const problemCount = MOCK_VILLAGE_DATA.filter(f => f.reportedPest && f.reportedPest !== 'None').length;
    const healthyCount = MOCK_VILLAGE_DATA.length - problemCount;

    const toggleExpand = (farmerId: string) => {
        setExpandedFarmer(expandedFarmer === farmerId ? null : farmerId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <Users className="text-paddy-green" /> {t('farmerDirectory')}
                </h1>
                <p className="text-slate-600 mt-2">
                    {MOCK_VILLAGE_DATA.length} {t('registeredFarmers')}
                </p>
            </header>

            {/* Quick Status Pills */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${statusFilter === "all"
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                >
                    👥 {t('total')} ({MOCK_VILLAGE_DATA.length})
                </button>
                <button
                    onClick={() => setStatusFilter("healthy")}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${statusFilter === "healthy"
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                        }`}
                >
                    <CheckCircle size={16} /> Healthy ({healthyCount})
                </button>
                <button
                    onClick={() => setStatusFilter("problem")}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${statusFilter === "problem"
                        ? "bg-red-600 text-white"
                        : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        }`}
                >
                    <AlertTriangle size={16} /> Problem ({problemCount})
                </button>
            </div>

            {/* Search & Village Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('searchFarmers')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-paddy-green"
                        />
                    </div>
                    <select
                        value={villageFilter}
                        onChange={(e) => setVillageFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-paddy-green"
                    >
                        <option value="All">{t('allVillages')}</option>
                        {villages.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-slate-600 mb-4">{filteredFarmers.length} {t('farmers')}</p>

            {/* Farmer Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFarmers.map((farmer) => {
                    const hasProblem = farmer.reportedPest && farmer.reportedPest !== 'None';
                    const isExpanded = expandedFarmer === farmer.id;

                    return (
                        <div
                            key={farmer.id}
                            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${hasProblem ? 'border-red-200' : 'border-slate-100'
                                }`}
                        >
                            {/* Main Card - Always Visible */}
                            <div
                                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => toggleExpand(farmer.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${hasProblem
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {farmer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{farmer.name}</p>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Phone size={12} /> {farmer.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {hasProblem ? (
                                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <AlertTriangle size={12} /> {farmer.reportedPest}
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle size={12} /> Healthy
                                            </span>
                                        )}
                                        {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="pt-4 space-y-3">
                                        {/* Location */}
                                        <div className="flex items-center gap-3 text-sm">
                                            <Home size={16} className="text-slate-400" />
                                            <span className="text-slate-700">{farmer.village}, Ward {farmer.ward}</span>
                                        </div>

                                        {/* Crop Info */}
                                        <div className="flex items-center gap-3 text-sm">
                                            <Sprout size={16} className="text-green-500" />
                                            <span className="text-slate-700">{farmer.variety} ({farmer.varietyDuration})</span>
                                        </div>

                                        {/* Land */}
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <p className="text-xs text-slate-500 mb-1">{t('landArea')}</p>
                                            <p className="font-bold text-slate-800">{farmer.landAreaAcres} {t('acres')}</p>
                                            <p className="text-xs text-slate-500">{farmer.landType}</p>
                                        </div>

                                        {/* Schemes with Icons */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {farmer.pmKisanRegistered && (
                                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs" title="PM-KISAN">
                                                    <CreditCard size={14} />
                                                    <span>PM-KISAN</span>
                                                </div>
                                            )}
                                            {farmer.kccHolder && (
                                                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs" title="Kisan Credit Card">
                                                    <CreditCard size={14} />
                                                    <span>KCC</span>
                                                </div>
                                            )}
                                            {farmer.pmfbyEnrolled && (
                                                <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs" title="Crop Insurance">
                                                    <Shield size={14} />
                                                    <span>Insurance</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Call Button */}
                                        <a
                                            href={`tel:${farmer.phone}`}
                                            className="block w-full bg-paddy-green hover:bg-green-600 text-white text-center py-2 rounded-lg font-medium transition-colors mt-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            📞 Call {farmer.name.split(' ')[0]}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredFarmers.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-white rounded-xl">
                    {t('noData')}
                </div>
            )}
        </div>
    );
}

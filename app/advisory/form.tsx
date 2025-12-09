"use client";

import { useState } from "react";
import { calculateCropStage, calculateMultiRisk, getExpectedHarvestDate, estimateYield, WeatherData, CropStage, MultiRiskResult } from "@/utils/riskEngine";
import { RICE_VARIETIES, getFertilizerDue, FERTILIZER_SCHEDULE } from "@/data/cropCalendar";
import { AlertTriangle, Droplets, Sprout, CheckCircle2, Calendar, TrendingUp, Beaker, Download, Printer, Loader2, CheckCircle, Plus, X, Leaf } from "lucide-react";
import { format } from "date-fns";
import { printAdvisory, downloadAdvisoryHTML } from "@/utils/pdfGenerator";
import { getIntercrops, getCropById, IntercropInfo } from "@/data/intercrops";

interface AdvisoryFormProps {
    weather: WeatherData;
}

export default function AdvisoryForm({ weather }: AdvisoryFormProps) {
    const [formData, setFormData] = useState({
        village: "Bhatar",
        sowingDate: "",
        variety: "Medium" as 'Short' | 'Medium' | 'Long',
        varietyName: "Swarna",
        landArea: "",
        soilType: "Clay Loam" as 'Clay' | 'Loam' | 'Sandy' | 'Clay Loam',
        irrigationType: "Irrigated" as 'Irrigated' | 'Rainfed',
    });

    const [result, setResult] = useState<{
        stage: CropStage;
        risk: MultiRiskResult;
        harvestDate: Date;
        yield: { minYield: number; maxYield: number; unit: string };
        daysSinceSowing: number;
    } | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedIntercrops, setSelectedIntercrops] = useState<string[]>([]);
    const [showIntercropSelector, setShowIntercropSelector] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.sowingDate) return;

        setIsLoading(true);
        setResult(null);

        // Simulate processing delay for better UX feedback
        await new Promise(resolve => setTimeout(resolve, 800));

        const sowingDate = new Date(formData.sowingDate);
        const stage = calculateCropStage(sowingDate, formData.variety);
        const daysSinceSowing = Math.ceil((new Date().getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24));

        const risk = calculateMultiRisk(weather, {
            stage,
            sowingDate,
            variety: formData.variety,
            soilType: formData.soilType as 'Clay' | 'Loam' | 'Sandy'
        });

        const harvestDate = getExpectedHarvestDate(sowingDate, formData.variety);
        const yieldEstimate = estimateYield(
            parseFloat(formData.landArea) || 1,
            risk.overallRiskScore,
            formData.variety
        );

        setResult({
            stage,
            risk,
            harvestDate,
            yield: yieldEstimate,
            daysSinceSowing
        });

        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'bg-red-600 text-white';
            case 'HIGH': return 'bg-red-500 text-white';
            case 'MEDIUM': return 'bg-yellow-500 text-white';
            default: return 'bg-green-500 text-white';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Example Preview - Shows what farmer will get */}
            {!result && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl">💡</div>
                        <div>
                            <p className="font-bold text-green-800">What you will get:</p>
                            <ul className="text-sm text-green-700 mt-1 space-y-1">
                                <li>✓ Current crop stage & expected harvest date</li>
                                <li>✓ Weather-based risk alerts (Blast, BPH, Drought)</li>
                                <li>✓ Personalized treatment recommendations</li>
                                <li>✓ Estimated yield for your land</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Sprout className="text-paddy-green" /> Enter Your Field Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select Village</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-paddy-green"
                                value={formData.village}
                                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                            >
                                <option value="Bhatar">Bhatar</option>
                                <option value="Memari">Memari</option>
                                <option value="Galsi">Galsi</option>
                                <option value="Garbeta">Garbeta</option>
                                <option value="Sainthia">Sainthia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Sowing Date (বপনের তারিখ)
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-paddy-green"
                                value={formData.sowingDate}
                                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                            />
                            <p className="text-xs text-slate-400 mt-1">📅 When did you transplant seedlings?</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Variety Name</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-paddy-green"
                                value={formData.varietyName}
                                onChange={(e) => {
                                    const selected = RICE_VARIETIES.find(v => v.name === e.target.value);
                                    setFormData({
                                        ...formData,
                                        varietyName: e.target.value,
                                        variety: selected?.duration || 'Medium'
                                    });
                                }}
                            >
                                {RICE_VARIETIES.map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Land Area (জমির পরিমাণ)
                            </label>
                            <input
                                type="number"
                                step="0.05"
                                min="0.05"
                                placeholder="e.g. 0.5, 1.2"
                                required
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-paddy-green"
                                value={formData.landArea}
                                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                            />
                            <p className="text-xs text-slate-400 mt-1">📏 Even 0.1 acre (4 katha) is supported</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Soil Type</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-paddy-green"
                                value={formData.soilType}
                                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                            >
                                <option value="Clay">Clay (ভারী মাটি)</option>
                                <option value="Loam">Loam (দোআঁশ)</option>
                                <option value="Sandy">Sandy (বালি মাটি)</option>
                                <option value="Clay Loam">Clay Loam (এঁটেল দোআঁশ)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Irrigation Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="irrigation"
                                    value="Irrigated"
                                    checked={formData.irrigationType === "Irrigated"}
                                    onChange={(e) => setFormData({ ...formData, irrigationType: "Irrigated" })}
                                    className="text-paddy-green focus:ring-paddy-green"
                                />
                                <span>Irrigated (সেচ আছে)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="irrigation"
                                    value="Rainfed"
                                    checked={formData.irrigationType === "Rainfed"}
                                    onChange={(e) => setFormData({ ...formData, irrigationType: "Rainfed" })}
                                    className="text-paddy-green focus:ring-paddy-green"
                                />
                                <span>Rainfed (বৃষ্টি নির্ভর)</span>
                            </label>
                        </div>
                    </div>

                    {/* Intercropping Section */}
                    <div className="border-t border-slate-100 pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-700">
                                <span className="flex items-center gap-2">
                                    <Leaf size={16} className="text-green-600" />
                                    Additional Crops / Intercropping (অতিরিক্ত ফসল)
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowIntercropSelector(!showIntercropSelector)}
                                className="text-sm text-paddy-green hover:text-green-600 flex items-center gap-1"
                            >
                                <Plus size={16} />
                                {showIntercropSelector ? 'Hide' : 'Add Crop'}
                            </button>
                        </div>

                        {/* Selected Intercrops */}
                        {selectedIntercrops.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedIntercrops.map(id => {
                                    const crop = getCropById(id);
                                    if (!crop) return null;
                                    return (
                                        <span key={id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {crop.name.split(' ')[0]} ({crop.nameBn.split(' ')[0]})
                                            <button
                                                type="button"
                                                onClick={() => setSelectedIntercrops(prev => prev.filter(c => c !== id))}
                                                className="hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Intercrop Selector */}
                        {showIntercropSelector && (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                <p className="text-xs text-slate-500">Select crops you plan to grow with rice:</p>

                                {/* Pulses */}
                                <div>
                                    <p className="text-xs font-bold text-slate-600 mb-2">🫘 Pulses (ডাল)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {getIntercrops().filter(c => c.category === 'pulse').map(crop => (
                                            <button
                                                key={crop.id}
                                                type="button"
                                                onClick={() => {
                                                    if (selectedIntercrops.includes(crop.id)) {
                                                        setSelectedIntercrops(prev => prev.filter(c => c !== crop.id));
                                                    } else {
                                                        setSelectedIntercrops(prev => [...prev, crop.id]);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedIntercrops.includes(crop.id)
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-green-400'
                                                    }`}
                                            >
                                                {crop.name.replace(/ \(.*\)/, '')} ({crop.nameBn.split(' ')[0]})
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Vegetables */}
                                <div>
                                    <p className="text-xs font-bold text-slate-600 mb-2">🥬 Vegetables (সবজি)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {getIntercrops().filter(c => c.category === 'vegetable').map(crop => (
                                            <button
                                                key={crop.id}
                                                type="button"
                                                onClick={() => {
                                                    if (selectedIntercrops.includes(crop.id)) {
                                                        setSelectedIntercrops(prev => prev.filter(c => c !== crop.id));
                                                    } else {
                                                        setSelectedIntercrops(prev => [...prev, crop.id]);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedIntercrops.includes(crop.id)
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-green-400'
                                                    }`}
                                            >
                                                {crop.name} ({crop.nameBn})
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Oilseeds */}
                                <div>
                                    <p className="text-xs font-bold text-slate-600 mb-2">🌻 Oilseeds (তেল বীজ)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {getIntercrops().filter(c => c.category === 'oilseed').map(crop => (
                                            <button
                                                key={crop.id}
                                                type="button"
                                                onClick={() => {
                                                    if (selectedIntercrops.includes(crop.id)) {
                                                        setSelectedIntercrops(prev => prev.filter(c => c !== crop.id));
                                                    } else {
                                                        setSelectedIntercrops(prev => [...prev, crop.id]);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedIntercrops.includes(crop.id)
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-green-400'
                                                    }`}
                                            >
                                                {crop.name} ({crop.nameBn})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">🌱 Intercropping increases income and improves soil health</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-paddy-green hover:bg-green-600 disabled:bg-green-400 text-white font-bold py-4 rounded-xl transition-colors shadow-md mt-4 text-lg flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Analyzing your field...
                            </>
                        ) : (
                            <>🌾 Get Personalized Advisory</>
                        )}
                    </button>
                </form >
            </div >

            {/* Success Banner */}
            {
                showSuccess && result && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <CheckCircle className="text-green-600" size={24} />
                        <div>
                            <p className="font-bold text-green-800">Advisory Generated Successfully!</p>
                            <p className="text-sm text-green-600">Scroll down to see your personalized recommendations</p>
                        </div>
                    </div>
                )
            }

            {
                result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Cards */}
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="text-sm text-slate-500 mb-1">Crop Stage</p>
                                <p className="text-xl font-bold text-slate-800">{result.stage}</p>
                                <p className="text-xs text-slate-400">Day {result.daysSinceSowing}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="text-sm text-slate-500 mb-1">Expected Harvest</p>
                                <p className="text-xl font-bold text-slate-800">{format(result.harvestDate, 'dd MMM yyyy')}</p>
                                <p className="text-xs text-slate-400">~{Math.ceil((result.harvestDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="text-sm text-slate-500 mb-1">Est. Yield</p>
                                <p className="text-xl font-bold text-paddy-green">{result.yield.minYield}-{result.yield.maxYield} q</p>
                                <p className="text-xs text-slate-400">For {formData.landArea} acres</p>
                            </div>
                            <div className={`p-4 rounded-xl ${getRiskColor(result.risk.primaryRisk.riskLevel)}`}>
                                <p className="text-sm opacity-80 mb-1">Risk Score</p>
                                <p className="text-xl font-bold">{Math.round(result.risk.overallRiskScore)}/100</p>
                                <p className="text-xs opacity-80">{result.risk.primaryRisk.riskLevel} Risk</p>
                            </div>
                        </div>

                        {/* ⚠️ Yield Validation & Comparison */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                <AlertTriangle size={18} /> Yield Estimate Disclaimer
                            </h3>

                            {/* Ward Average Comparison */}
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white p-3 rounded-xl text-center">
                                    <p className="text-xs text-slate-500 mb-1">Your Estimate</p>
                                    <p className="text-lg font-bold text-paddy-green">{result.yield.minYield}-{result.yield.maxYield} q</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl text-center">
                                    <p className="text-xs text-slate-500 mb-1">Ward Average (Last 3 yrs)</p>
                                    <p className="text-lg font-bold text-slate-700">{Math.round((parseFloat(formData.landArea) || 1) * 17.5)} q</p>
                                    <p className="text-xs text-slate-400">~17.5 q/acre</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl text-center">
                                    <p className="text-xs text-slate-500 mb-1">District Best</p>
                                    <p className="text-lg font-bold text-blue-600">{Math.round((parseFloat(formData.landArea) || 1) * 22)} q</p>
                                    <p className="text-xs text-slate-400">Irrigated, Swarna</p>
                                </div>
                            </div>

                            {/* Conservative vs Optimistic */}
                            <div className="bg-white p-4 rounded-xl mb-4">
                                <p className="text-sm font-medium text-slate-700 mb-2">📊 Scenario Analysis:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">🔴 Conservative (if weather issues)</span>
                                        <span className="font-bold text-red-600">{Math.round(result.yield.minYield * 0.75)} q</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">🟡 Expected (normal conditions)</span>
                                        <span className="font-bold text-amber-600">{result.yield.minYield}-{result.yield.maxYield} q</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">🟢 Optimistic (ideal conditions)</span>
                                        <span className="font-bold text-green-600">{Math.round(result.yield.maxYield * 1.15)} q</span>
                                    </div>
                                </div>
                            </div>

                            {/* Risk Factors */}
                            <div className="text-sm text-amber-700 space-y-1">
                                <p className="font-medium">⚠️ Factors that may reduce yield:</p>
                                <ul className="text-xs space-y-1 ml-4">
                                    <li>• Unexpected heavy rainfall or drought</li>
                                    <li>• Pest/disease outbreak (BPH, Blast)</li>
                                    <li>• Delayed fertilizer application</li>
                                    <li>• Quality of seeds and inputs</li>
                                </ul>
                                <p className="text-xs italic mt-2 pt-2 border-t border-amber-200">
                                    💡 These estimates are based on historical data. Actual results depend on weather, care, and inputs.
                                </p>
                            </div>
                        </div>

                        {/* WhatsApp & SMS Share */}
                        <div className="flex flex-wrap gap-3 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 no-print">
                            <p className="text-sm text-slate-600">📤 Share this advisory:</p>
                            <div className="flex gap-2">
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(
                                        `🌾 My Crop Advisory\n\n` +
                                        `📍 Village: ${formData.village}\n` +
                                        `🌱 Stage: ${result.stage} (Day ${result.daysSinceSowing})\n` +
                                        `📅 Harvest: ${format(result.harvestDate, 'dd MMM yyyy')}\n` +
                                        `📊 Est. Yield: ${result.yield.minYield}-${result.yield.maxYield} quintals\n` +
                                        `⚠️ Risk: ${result.risk.primaryRisk.riskType} (${result.risk.primaryRisk.riskLevel})\n\n` +
                                        `Get your advisory: ${typeof window !== 'undefined' ? window.location.origin : ''}/advisory`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    WhatsApp
                                </a>
                                <button
                                    onClick={() => {
                                        const smsText = `Crop Advisory: ${result.stage}, Harvest ${format(result.harvestDate, 'dd MMM')}, Risk: ${result.risk.primaryRisk.riskType}`;
                                        window.open(`sms:?body=${encodeURIComponent(smsText)}`, '_blank');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    📱 SMS
                                </button>
                            </div>
                        </div>

                        {/* Download/Print Buttons */}
                        <div className="flex gap-3 justify-end no-print">
                            <button
                                onClick={() => {
                                    const pdfData = {
                                        village: formData.village,
                                        sowingDate: formData.sowingDate,
                                        variety: formData.varietyName,
                                        stage: result.stage,
                                        landArea: parseFloat(formData.landArea) || 1,
                                        riskType: result.risk.primaryRisk.riskType,
                                        riskLevel: result.risk.primaryRisk.riskLevel,
                                        recommendation: result.risk.primaryRisk.recommendation,
                                        preventiveMeasures: result.risk.primaryRisk.preventiveMeasures,
                                        harvestDate: format(result.harvestDate, 'dd MMM yyyy'),
                                        yieldEstimate: { min: result.yield.minYield, max: result.yield.maxYield },
                                        weather: {
                                            temp: weather.temp_avg,
                                            humidity: weather.humidity_avg,
                                            rainfall: weather.rainfall_mm,
                                        },
                                        generatedAt: new Date(),
                                    };
                                    downloadAdvisoryHTML(pdfData);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
                            >
                                <Download size={18} />
                                Download
                            </button>
                            <button
                                onClick={() => {
                                    const pdfData = {
                                        village: formData.village,
                                        sowingDate: formData.sowingDate,
                                        variety: formData.varietyName,
                                        stage: result.stage,
                                        landArea: parseFloat(formData.landArea) || 1,
                                        riskType: result.risk.primaryRisk.riskType,
                                        riskLevel: result.risk.primaryRisk.riskLevel,
                                        recommendation: result.risk.primaryRisk.recommendation,
                                        preventiveMeasures: result.risk.primaryRisk.preventiveMeasures,
                                        harvestDate: format(result.harvestDate, 'dd MMM yyyy'),
                                        yieldEstimate: { min: result.yield.minYield, max: result.yield.maxYield },
                                        weather: {
                                            temp: weather.temp_avg,
                                            humidity: weather.humidity_avg,
                                            rainfall: weather.rainfall_mm,
                                        },
                                        generatedAt: new Date(),
                                    };
                                    printAdvisory(pdfData);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-paddy-green hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
                            >
                                <Printer size={18} />
                                Print Advisory
                            </button>
                        </div>

                        {/* Primary Risk Alert */}
                        <div className={`p-6 rounded-2xl ${result.risk.primaryRisk.riskLevel === 'CRITICAL' || result.risk.primaryRisk.riskLevel === 'HIGH'
                            ? 'bg-red-50 border-2 border-red-200'
                            : result.risk.primaryRisk.riskLevel === 'MEDIUM'
                                ? 'bg-yellow-50 border-2 border-yellow-200'
                                : 'bg-green-50 border-2 border-green-200'
                            }`}>
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{result.risk.primaryRisk.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                                        {result.risk.primaryRisk.riskType !== 'None'
                                            ? `⚠️ ${result.risk.primaryRisk.riskType} Risk Detected`
                                            : '✅ No Major Risks Detected'}
                                    </h3>
                                    <p className="text-slate-700 mb-4">{result.risk.primaryRisk.recommendation}</p>

                                    {result.risk.primaryRisk.preventiveMeasures.length > 0 && (
                                        <div className="bg-white/50 p-4 rounded-lg">
                                            <p className="font-semibold text-slate-700 mb-2">Preventive Measures:</p>
                                            <ul className="space-y-1">
                                                {result.risk.primaryRisk.preventiveMeasures.map((measure, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                        <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                                                        {measure}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Secondary Risks */}
                        {result.risk.secondaryRisks.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4">Other Risks to Monitor</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {result.risk.secondaryRisks.map((risk, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <span className="text-2xl">{risk.icon}</span>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{risk.riskType}</p>
                                                <p className="text-xs text-slate-500">Severity: {risk.severity}/100</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${getRiskColor(risk.riskLevel)}`}>
                                                {risk.riskLevel}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fertilizer Recommendation */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Beaker className="text-purple-500" /> Fertilizer Schedule (for {formData.landArea} acres)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left p-3 font-medium text-slate-600">Stage</th>
                                            <th className="text-right p-3 font-medium text-slate-600">Urea (kg)</th>
                                            <th className="text-right p-3 font-medium text-slate-600">DAP (kg)</th>
                                            <th className="text-right p-3 font-medium text-slate-600">MOP (kg)</th>
                                            <th className="text-left p-3 font-medium text-slate-600">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FERTILIZER_SCHEDULE.map((f, idx) => {
                                            const landArea = parseFloat(formData.landArea) || 1;
                                            const isPast = f.dayAfterSowing < result.daysSinceSowing;
                                            return (
                                                <tr key={idx} className={`border-t border-slate-100 ${isPast ? 'opacity-50' : ''}`}>
                                                    <td className="p-3 font-medium text-slate-700">
                                                        {isPast && '✓ '}{f.stage}
                                                        <span className="text-xs text-slate-400 ml-2">(Day {f.dayAfterSowing})</span>
                                                    </td>
                                                    <td className="p-3 text-right font-bold text-slate-800">{Math.round(f.ureaKgPerAcre * landArea)}</td>
                                                    <td className="p-3 text-right font-bold text-slate-800">{Math.round(f.dapKgPerAcre * landArea)}</td>
                                                    <td className="p-3 text-right font-bold text-slate-800">{Math.round(f.mopKgPerAcre * landArea)}</td>
                                                    <td className="p-3 text-sm text-slate-600">{f.notes}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Weather Context */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Current Weather Context</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-slate-800">{weather.temp_avg}°C</p>
                                    <p className="text-xs text-slate-500">Avg Temperature</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-slate-800">{weather.humidity_avg}%</p>
                                    <p className="text-xs text-slate-500">Humidity</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-slate-800">{weather.rainfall_mm}mm</p>
                                    <p className="text-xs text-slate-500">Rainfall (7-day)</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-slate-800">{weather.forecast_days_rain}</p>
                                    <p className="text-xs text-slate-500">Rainy Days Ahead</p>
                                </div>
                            </div>
                        </div>

                        {/* Intercrop Advisory */}
                        {selectedIntercrops.length > 0 && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                    <Leaf className="text-green-600" />
                                    Intercrop Advisory ({selectedIntercrops.length} crops selected)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {selectedIntercrops.map(id => {
                                        const crop = getCropById(id);
                                        if (!crop) return null;
                                        const landAcres = parseFloat(formData.landArea) || 1;
                                        const estimatedYield = crop.yieldPerAcre * landAcres * 0.3; // 30% of land for intercrop
                                        const estimatedRevenue = estimatedYield * crop.pricePerKg;
                                        const sowingDate = formData.sowingDate ? new Date(formData.sowingDate) : new Date();
                                        const intercropSowDate = new Date(sowingDate.getTime() + crop.sowingOffset * 24 * 60 * 60 * 1000);
                                        const harvestDate = new Date(intercropSowDate.getTime() + crop.harvestDays * 24 * 60 * 60 * 1000);

                                        return (
                                            <div key={id} className="bg-white p-4 rounded-xl border border-green-100">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="font-bold text-slate-800">{crop.name}</p>
                                                        <p className="text-sm text-green-600">{crop.nameBn}</p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${crop.category === 'pulse' ? 'bg-orange-100 text-orange-700' :
                                                        crop.category === 'vegetable' ? 'bg-green-100 text-green-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {crop.category}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                                    <div className="bg-slate-50 p-2 rounded">
                                                        <p className="text-xs text-slate-500">Sow After</p>
                                                        <p className="font-medium text-slate-700">{crop.sowingOffset} days</p>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded">
                                                        <p className="text-xs text-slate-500">Harvest In</p>
                                                        <p className="font-medium text-slate-700">{crop.harvestDays} days</p>
                                                    </div>
                                                </div>

                                                <div className="bg-green-50 p-3 rounded-lg mb-3">
                                                    <p className="text-xs text-green-600 mb-1">Expected Extra Income (30% land)</p>
                                                    <p className="text-lg font-bold text-green-700">
                                                        ₹{Math.round(estimatedRevenue).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        ~{Math.round(estimatedYield)}kg × ₹{crop.pricePerKg}/kg
                                                    </p>
                                                </div>

                                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                                    <span className="text-yellow-500">💡</span>
                                                    <p>{crop.tips}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                                    <p className="text-sm text-green-800">
                                        <strong>🌾 Total Potential:</strong> Rice + {selectedIntercrops.length} intercrop(s) =
                                        <strong> ₹{Math.round(
                                            (result.yield.minYield + result.yield.maxYield) / 2 * 2320 +
                                            selectedIntercrops.reduce((sum, id) => {
                                                const crop = getCropById(id);
                                                if (!crop) return sum;
                                                return sum + (crop.yieldPerAcre * (parseFloat(formData.landArea) || 1) * 0.3 * crop.pricePerKg);
                                            }, 0)
                                        ).toLocaleString()}</strong> estimated
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    );
}

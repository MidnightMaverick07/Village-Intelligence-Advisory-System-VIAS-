"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, AlertTriangle, CheckCircle2, Bug, Leaf, Info, ChevronDown, ChevronUp } from "lucide-react";
import { analyzeImage, PestDetection } from "@/data/pestDetection";

export default function PestScannerPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<PestDetection | null>(null);
    const [showTreatment, setShowTreatment] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setResult(null);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setResult(null);
        }
    }, []);

    const handleAnalyze = async () => {
        if (!imageFile) return;

        setIsAnalyzing(true);
        try {
            const detection = await analyzeImage(imageFile);
            setResult(detection);
            setShowTreatment(true);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImageFile(null);
        setResult(null);
        setShowTreatment(false);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-600';
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-amber-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <header className="mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    <Bug className="text-red-500" /> Pest Scanner
                </h1>
                <p className="text-slate-600 mt-1">Upload a photo of your crop to detect pests & diseases</p>
            </header>

            {/* Upload Area */}
            {!selectedImage ? (
                <div
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <Camera className="text-green-600" size={40} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 text-lg">Take Photo or Upload</p>
                            <p className="text-slate-500 text-sm mt-1">ছবি তুলুন বা আপলোড করুন</p>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-paddy-green text-white rounded-lg font-medium">
                                <Camera size={18} /> Camera
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium">
                                <Upload size={18} /> Gallery
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200">
                        <img
                            src={selectedImage}
                            alt="Selected crop"
                            className="w-full h-64 object-cover"
                        />
                        <button
                            onClick={clearImage}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Analyze Button */}
                    {!result && (
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full py-4 bg-paddy-green hover:bg-green-600 disabled:bg-green-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    Analyzing... (বিশ্লেষণ করা হচ্ছে)
                                </>
                            ) : (
                                <>
                                    <Bug size={24} />
                                    Scan for Pests & Diseases
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Main Result Card */}
                    <div className={`rounded-2xl overflow-hidden border-2 ${result.type === 'healthy' ? 'border-green-200' :
                            result.severity === 'critical' || result.severity === 'high' ? 'border-red-200' : 'border-amber-200'
                        }`}>
                        {/* Header */}
                        <div className={`p-4 text-white ${result.type === 'healthy' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                result.severity === 'critical' || result.severity === 'high' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                                    'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{result.icon}</span>
                                    <div>
                                        <p className="text-lg font-bold">{result.name}</p>
                                        <p className="text-sm opacity-80">{result.nameBn}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{result.confidence}%</p>
                                    <p className="text-xs opacity-80">Confidence</p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className={`p-4 ${result.type === 'healthy' ? 'bg-green-50' :
                                result.severity === 'critical' || result.severity === 'high' ? 'bg-red-50' : 'bg-amber-50'
                            }`}>
                            {/* Severity Badge */}
                            {result.type !== 'healthy' && (
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getSeverityColor(result.severity)}`}>
                                        {result.severity.toUpperCase()} Severity
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {result.type === 'disease' ? '🦠 Disease' : result.type === 'pest' ? '🐛 Pest' : '🌿 Nutrient'}
                                    </span>
                                </div>
                            )}

                            {/* Symptoms */}
                            <div className="mb-4">
                                <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                                    <Info size={14} /> {result.type === 'healthy' ? 'Signs of Healthy Plant:' : 'Symptoms Detected:'}
                                </p>
                                <ul className="space-y-1">
                                    {result.symptoms.map((symptom, idx) => (
                                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                            <span className={result.type === 'healthy' ? 'text-green-500' : 'text-red-500'}>•</span>
                                            {symptom}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Treatment Section (Collapsible) */}
                            {result.type !== 'healthy' && result.treatment.length > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => setShowTreatment(!showTreatment)}
                                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50"
                                    >
                                        <span className="font-bold text-slate-700 flex items-center gap-2">
                                            💊 Treatment (চিকিৎসা)
                                        </span>
                                        {showTreatment ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {showTreatment && (
                                        <div className="p-3 pt-0 border-t border-slate-100">
                                            <ul className="space-y-2">
                                                {result.treatment.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                                        <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Preventive Measures */}
                            <div className="mt-3 p-3 bg-white/50 rounded-xl">
                                <p className="text-xs font-bold text-slate-600 mb-2">
                                    🛡️ Preventive Measures:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.preventiveMeasures.slice(0, 3).map((measure, idx) => (
                                        <span key={idx} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                                            {measure}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scan Another */}
                    <button
                        onClick={clearImage}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Camera size={20} /> Scan Another Image
                    </button>

                    {/* Disclaimer */}
                    <p className="text-xs text-slate-400 text-center">
                        ⚠️ This is a mock detection for demo purposes. For accurate diagnosis, consult your local Agricultural Extension Officer.
                    </p>
                </div>
            )}

            {/* Tips Section */}
            {!selectedImage && (
                <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
                    <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                        <Leaf size={18} /> Tips for Best Results
                    </h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>📸 Take clear, close-up photos of affected leaves</li>
                        <li>☀️ Ensure good lighting (avoid shadows)</li>
                        <li>🎯 Focus on the damaged/discolored area</li>
                        <li>📐 Hold phone steady and parallel to leaf</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

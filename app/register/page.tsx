"use client";

import { useState } from "react";
import { Phone, User, MapPin, Ruler, Check, ArrowRight, ArrowLeft, Loader2, CheckCircle, Home, Wheat, FileText } from "lucide-react";
import Link from "next/link";
import { RICE_VARIETIES } from "@/data/cropCalendar";

type Step = 'phone' | 'otp' | 'personal' | 'land' | 'success';

interface FormData {
    phone: string;
    otp: string;
    name: string;
    fatherName: string;
    village: string;
    ward: string;
    aadharLast4: string;
    landArea: string;
    landUnit: 'acre' | 'bigha' | 'katha';
    riceVariety: string;
    irrigationType: 'irrigated' | 'rainfed';
    ownLand: boolean;
}

export default function RegisterPage() {
    const [step, setStep] = useState<Step>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        phone: '',
        otp: '',
        name: '',
        fatherName: '',
        village: 'Kamalpur',
        ward: '',
        aadharLast4: '',
        landArea: '',
        landUnit: 'bigha',
        riceVariety: '',
        irrigationType: 'rainfed',
        ownLand: true,
    });

    const handleSendOTP = async () => {
        if (formData.phone.length !== 10) return;
        setIsLoading(true);
        // Mock OTP send
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep('otp');
    };

    const handleVerifyOTP = async () => {
        if (formData.otp.length !== 4) return;
        setIsLoading(true);
        // Mock OTP verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setStep('personal');
    };

    const handlePersonalSubmit = () => {
        if (!formData.name || !formData.ward) return;
        setStep('land');
    };

    const handleFinalSubmit = async () => {
        if (!formData.landArea) return;
        setIsLoading(true);
        // Mock registration
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setStep('success');
    };

    const villages = ['Kamalpur', 'Shantipur', 'Nabadwip', 'Memari'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-paddy-green rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wheat className="text-white" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Farmer Registration</h1>
                    <p className="text-slate-600 mt-1">কৃষক নিবন্ধন</p>
                </div>

                {/* Progress Steps */}
                {step !== 'success' && (
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {['phone', 'otp', 'personal', 'land'].map((s, idx) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-paddy-green text-white' :
                                        ['phone', 'otp', 'personal', 'land'].indexOf(step) > idx ? 'bg-green-200 text-green-700' :
                                            'bg-slate-200 text-slate-500'
                                    }`}>
                                    {['phone', 'otp', 'personal', 'land'].indexOf(step) > idx ? <Check size={16} /> : idx + 1}
                                </div>
                                {idx < 3 && <div className={`w-8 h-1 ${['phone', 'otp', 'personal', 'land'].indexOf(step) > idx ? 'bg-green-200' : 'bg-slate-200'}`}></div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 1: Phone */}
                {step === 'phone' && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Phone className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Enter Mobile Number</h2>
                                <p className="text-sm text-slate-500">মোবাইল নম্বর দিন</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-paddy-green">
                                <span className="bg-slate-100 px-3 py-3 text-slate-600 font-medium">+91</span>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                    placeholder="Enter 10 digit number"
                                    className="flex-1 px-4 py-3 outline-none text-lg"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">📱 OTP will be sent to this number for verification</p>
                        </div>

                        <button
                            onClick={handleSendOTP}
                            disabled={formData.phone.length !== 10 || isLoading}
                            className="w-full py-4 bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Sending OTP...</>
                            ) : (
                                <>Send OTP <ArrowRight size={20} /></>
                            )}
                        </button>

                        <p className="text-center text-sm text-slate-500 mt-4">
                            Already registered? <Link href="/login" className="text-paddy-green font-medium hover:underline">Login</Link>
                        </p>
                    </div>
                )}

                {/* Step 2: OTP */}
                {step === 'otp' && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <button onClick={() => setStep('phone')} className="text-slate-500 mb-4 flex items-center gap-1 hover:text-slate-700">
                            <ArrowLeft size={16} /> Back
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="font-bold text-slate-800 text-lg">Enter OTP</h2>
                            <p className="text-sm text-slate-500">Sent to +91 {formData.phone}</p>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                maxLength={4}
                                value={formData.otp}
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                placeholder="Enter 4-digit OTP"
                                className="w-full text-center text-2xl tracking-widest border-2 border-slate-200 rounded-xl py-4 outline-none focus:border-paddy-green"
                            />
                            <p className="text-xs text-slate-400 mt-2 text-center">📍 Demo: Enter any 4 digits</p>
                        </div>

                        <button
                            onClick={handleVerifyOTP}
                            disabled={formData.otp.length !== 4 || isLoading}
                            className="w-full py-4 bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Verifying...</>
                            ) : (
                                <>Verify OTP <Check size={20} /></>
                            )}
                        </button>

                        <button className="w-full py-2 text-sm text-paddy-green hover:underline mt-3">
                            Resend OTP
                        </button>
                    </div>
                )}

                {/* Step 3: Personal Info */}
                {step === 'personal' && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <button onClick={() => setStep('otp')} className="text-slate-500 mb-4 flex items-center gap-1 hover:text-slate-700">
                            <ArrowLeft size={16} /> Back
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Personal Details</h2>
                                <p className="text-sm text-slate-500">ব্যক্তিগত তথ্য</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name (পূর্ণ নাম) *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Father&apos;s Name (পিতার নাম)</label>
                                <input
                                    type="text"
                                    value={formData.fatherName}
                                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                    placeholder="Enter father's name"
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Village (গ্রাম) *</label>
                                    <select
                                        value={formData.village}
                                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green bg-white"
                                    >
                                        {villages.map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ward No. *</label>
                                    <select
                                        value={formData.ward}
                                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green bg-white"
                                    >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(w => (
                                            <option key={w} value={w}>Ward {w}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Last 4 Digits</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={formData.aadharLast4}
                                    onChange={(e) => setFormData({ ...formData, aadharLast4: e.target.value.replace(/\D/g, '') })}
                                    placeholder="XXXX"
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green"
                                />
                                <p className="text-xs text-slate-400 mt-1">🔒 Used only for verification</p>
                            </div>
                        </div>

                        <button
                            onClick={handlePersonalSubmit}
                            disabled={!formData.name || !formData.ward}
                            className="w-full py-4 bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
                        >
                            Next: Land Details <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 4: Land Details */}
                {step === 'land' && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <button onClick={() => setStep('personal')} className="text-slate-500 mb-4 flex items-center gap-1 hover:text-slate-700">
                            <ArrowLeft size={16} /> Back
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <Ruler className="text-amber-600" size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Land Details</h2>
                                <p className="text-sm text-slate-500">জমির তথ্য</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Land Area (মোট জমি) *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.landArea}
                                        onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                                        placeholder="Enter area"
                                        className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green"
                                    />
                                    <select
                                        value={formData.landUnit}
                                        onChange={(e) => setFormData({ ...formData, landUnit: e.target.value as any })}
                                        className="border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green bg-white"
                                    >
                                        <option value="bigha">Bigha (বিঘা)</option>
                                        <option value="katha">Katha (কাঠা)</option>
                                        <option value="acre">Acre (একর)</option>
                                    </select>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">📐 1 bigha = 20 katha = 0.33 acre</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Rice Variety</label>
                                <select
                                    value={formData.riceVariety}
                                    onChange={(e) => setFormData({ ...formData, riceVariety: e.target.value })}
                                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-paddy-green bg-white"
                                >
                                    <option value="">Select variety</option>
                                    {RICE_VARIETIES.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.nameBn})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Irrigation Type</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-colors ${formData.irrigationType === 'irrigated' ? 'border-paddy-green bg-green-50' : 'border-slate-200'}`}>
                                        <input
                                            type="radio"
                                            name="irrigation"
                                            value="irrigated"
                                            checked={formData.irrigationType === 'irrigated'}
                                            onChange={() => setFormData({ ...formData, irrigationType: 'irrigated' })}
                                            className="sr-only"
                                        />
                                        <p className="font-medium text-center">💧 Irrigated</p>
                                        <p className="text-xs text-slate-500 text-center">সেচযুক্ত</p>
                                    </label>
                                    <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-colors ${formData.irrigationType === 'rainfed' ? 'border-paddy-green bg-green-50' : 'border-slate-200'}`}>
                                        <input
                                            type="radio"
                                            name="irrigation"
                                            value="rainfed"
                                            checked={formData.irrigationType === 'rainfed'}
                                            onChange={() => setFormData({ ...formData, irrigationType: 'rainfed' })}
                                            className="sr-only"
                                        />
                                        <p className="font-medium text-center">🌧️ Rainfed</p>
                                        <p className="text-xs text-slate-500 text-center">বৃষ্টি নির্ভর</p>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="ownLand"
                                    checked={formData.ownLand}
                                    onChange={(e) => setFormData({ ...formData, ownLand: e.target.checked })}
                                    className="w-5 h-5 text-paddy-green"
                                />
                                <label htmlFor="ownLand" className="text-sm text-slate-700">
                                    I own this land / আমি এই জমির মালিক
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleFinalSubmit}
                            disabled={!formData.landArea || isLoading}
                            className="w-full py-4 bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Registering...</>
                            ) : (
                                <>Complete Registration <Check size={20} /></>
                            )}
                        </button>
                    </div>
                )}

                {/* Step 5: Success */}
                {step === 'success' && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-green-700 mb-2">Registration Complete!</h2>
                        <p className="text-slate-600 mb-6">নিবন্ধন সম্পন্ন হয়েছে!</p>

                        <div className="bg-slate-50 p-4 rounded-xl text-left mb-6">
                            <p className="text-sm text-slate-500 mb-2">Your Details:</p>
                            <p className="font-bold text-slate-800">{formData.name}</p>
                            <p className="text-slate-600">{formData.village}, Ward {formData.ward}</p>
                            <p className="text-slate-600">{formData.landArea} {formData.landUnit} | {formData.irrigationType}</p>
                            <p className="text-slate-500 text-sm mt-2">📱 +91 {formData.phone}</p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="block w-full py-3 bg-paddy-green hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                            >
                                <Home className="inline mr-2" size={18} />
                                Go to Dashboard
                            </Link>
                            <Link
                                href="/advisory"
                                className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                            >
                                <FileText className="inline mr-2" size={18} />
                                Get Crop Advisory
                            </Link>
                        </div>
                    </div>
                )}

                {/* Help Text */}
                {step !== 'success' && (
                    <p className="text-center text-xs text-slate-400 mt-6">
                        🆘 Need help? Call <a href="tel:1800-180-1551" className="text-paddy-green">Kisan Helpline 1800-180-1551</a>
                    </p>
                )}
            </div>
        </div>
    );
}

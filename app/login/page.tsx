"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

type Step = "phone" | "otp";

export default function LoginPage() {
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login, requestOTP } = useAuth();
    const router = useRouter();

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await requestOTP(phone);

        if (result.success) {
            setStep("otp");
        } else {
            setError(result.error || "Failed to send OTP");
        }

        setIsLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await login(phone, otp);

        if (result.success) {
            router.push("/profile");
        } else {
            setError(result.error || "Login failed");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-paddy-green to-green-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="bg-paddy-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🌾</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                    <p className="text-slate-600 mt-2">
                        {step === "phone"
                            ? "Enter your registered phone number"
                            : "Enter the OTP sent to your phone"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {step === "phone" ? (
                    <form onSubmit={handleRequestOTP} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-paddy-green"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || phone.length < 10}
                            className="w-full bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    Get OTP <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                OTP
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-paddy-green text-center text-xl tracking-widest"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 text-center">
                                Demo OTP: <span className="font-mono font-bold">123456</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Login <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                            className="w-full text-slate-600 hover:text-paddy-green transition-colors text-sm"
                        >
                            ← Change phone number
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
                    <p className="text-slate-700">
                        New farmer? <Link href="/register" className="text-paddy-green font-bold hover:underline">Register here →</Link>
                    </p>
                    <p className="text-sm text-slate-500">
                        নতুন কৃষক? <Link href="/register" className="text-paddy-green hover:underline">এখানে নিবন্ধন করুন</Link>
                    </p>
                    <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Demo accounts: <span className="font-mono">9832XXXX01</span> or <span className="font-mono">9832XXXX06</span>
                        </p>
                        <Link href="/" className="text-xs text-paddy-green hover:underline mt-2 inline-block">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { User, MapPin, Phone, Calendar, LogOut, Sprout, Award, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ProfileContent() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <User className="text-paddy-green" /> My Profile
                </h1>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                    <div className="flex items-start gap-6">
                        <div className="bg-paddy-green/10 w-20 h-20 rounded-full flex items-center justify-center">
                            <span className="text-4xl">{user.role === "farmer" ? "👨‍🌾" : "👨‍💼"}</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                            <div className="flex flex-wrap gap-4 mt-3 text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-slate-400" />
                                    <span>{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span>{user.village}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span>Registered: {format(user.registeredOn, 'dd MMM yyyy')}</span>
                                </div>
                            </div>
                            <span className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium ${user.role === "farmer" ? "bg-green-100 text-green-700" :
                                    user.role === "officer" ? "bg-blue-100 text-blue-700" :
                                        "bg-purple-100 text-purple-700"
                                }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Sprout size={20} className="text-green-600" />
                            </div>
                            <span className="font-medium text-slate-700">View Dashboard</span>
                        </Link>
                        <Link
                            href="/advisory"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Award size={20} className="text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-700">Get Advisory</span>
                        </Link>
                        <Link
                            href="/schemes"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <ShieldCheck size={20} className="text-purple-600" />
                            </div>
                            <span className="font-medium text-slate-700">View Schemes</span>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                {user.role === "farmer" && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-3">
                        <h3 className="font-bold text-slate-800 mb-4">My Farm Stats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-paddy-green">1.5</p>
                                <p className="text-sm text-slate-600">Acres</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-paddy-green">Swarna</p>
                                <p className="text-sm text-slate-600">Variety</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-paddy-green">32</p>
                                <p className="text-sm text-slate-600">Last Yield (q)</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-green-500">✓</p>
                                <p className="text-sm text-slate-600">PM-KISAN Active</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}

"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Clock, CheckCircle, AlertTriangle, Users, Filter, RefreshCw } from "lucide-react";
import { MOCK_VILLAGE_DATA } from "@/data/mockVillage";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";

interface SMSAlert {
    id: string;
    farmerId: string;
    farmerName: string;
    phone: string;
    village: string;
    message: string;
    type: 'risk' | 'weather' | 'scheme' | 'price' | 'reminder';
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    scheduledAt: Date;
    sentAt?: Date;
}

const ALERT_TEMPLATES = {
    blast: "⚠️ BLAST ALERT: High humidity & temp 20-28°C detected. Spray Tricyclazole 0.6g/L. Monitor field closely. -RiceAdvisor",
    drought: "🌡️ DROUGHT ALERT: No rain expected for 5 days. Ensure field has 5cm water. Schedule irrigation. -RiceAdvisor",
    bph: "🪲 BPH ALERT: Brown Planthopper risk high. Drain field water, install light traps. Spray Imidacloprid if needed. -RiceAdvisor",
    flood: "🌊 FLOOD ALERT: Heavy rainfall expected. Ensure proper drainage. Delay fertilizer application. -RiceAdvisor",
    price: "📈 PRICE UPDATE: Paddy MSP ₹2320/qtl. Nearest procurement center: Burdwan. Contact: 1800-180-1551 -RiceAdvisor",
    scheme: "📋 SCHEME REMINDER: PMFBY enrollment closes Dec 31. Visit bank with Aadhaar & land records. -RiceAdvisor",
    fertilizer: "🌱 FERTILIZER REMINDER: Apply 2nd dose urea (25kg/acre) this week. Field should have thin water layer. -RiceAdvisor",
    harvest: "🌾 HARVEST REMINDER: Your crop (Swarna) is nearing maturity. Expected harvest in 15 days. Plan labor. -RiceAdvisor",
};

export default function AlertsPage() {
    const { t } = useLanguage();
    const [alerts, setAlerts] = useState<SMSAlert[]>([]);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedVillage, setSelectedVillage] = useState<string>("all");
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        const generatedAlerts: SMSAlert[] = MOCK_VILLAGE_DATA.slice(0, 12).map((farmer, idx) => {
            const types: SMSAlert['type'][] = ['risk', 'weather', 'scheme', 'price', 'reminder'];
            const type = types[idx % types.length];
            const templates = Object.values(ALERT_TEMPLATES);
            const message = templates[idx % templates.length];

            return {
                id: `alert-${idx}`,
                farmerId: farmer.id,
                farmerName: farmer.name,
                phone: farmer.phone,
                village: farmer.village,
                message,
                type,
                status: idx < 4 ? 'delivered' : idx < 8 ? 'sent' : 'pending',
                scheduledAt: new Date(Date.now() - (idx * 3600000)),
                sentAt: idx < 8 ? new Date(Date.now() - (idx * 3600000) + 5000) : undefined,
            };
        });
        setAlerts(generatedAlerts);
    }, []);

    const simulateSending = () => {
        setIsSimulating(true);
        let idx = 0;

        const interval = setInterval(() => {
            setAlerts(prev => prev.map(alert => {
                if (alert.status === 'pending' && prev.indexOf(alert) === prev.findIndex(a => a.status === 'pending')) {
                    return { ...alert, status: 'sent', sentAt: new Date() };
                }
                if (alert.status === 'sent' && !alert.sentAt) {
                    return { ...alert, status: 'delivered' };
                }
                return alert;
            }));

            idx++;
            if (idx > 5) {
                clearInterval(interval);
                setIsSimulating(false);
            }
        }, 800);
    };

    const filteredAlerts = alerts.filter(alert => {
        if (selectedType !== "all" && alert.type !== selectedType) return false;
        if (selectedVillage !== "all" && alert.village !== selectedVillage) return false;
        return true;
    });

    const stats = {
        total: alerts.length,
        pending: alerts.filter(a => a.status === 'pending').length,
        sent: alerts.filter(a => a.status === 'sent').length,
        delivered: alerts.filter(a => a.status === 'delivered').length,
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="text-yellow-500" size={16} />;
            case 'sent': return <Send className="text-blue-500" size={16} />;
            case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
            default: return <AlertTriangle className="text-red-500" size={16} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'risk': return 'bg-red-100 text-red-700';
            case 'weather': return 'bg-blue-100 text-blue-700';
            case 'scheme': return 'bg-purple-100 text-purple-700';
            case 'price': return 'bg-green-100 text-green-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const villages = [...new Set(MOCK_VILLAGE_DATA.map(f => f.village))];

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <MessageSquare className="text-blue-600" /> {t('smsAlerts')}
                </h1>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">{t('total')}</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <Users className="text-slate-400" size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">{t('pending')}</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <Clock className="text-yellow-500" size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">{t('sent')}</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
                        </div>
                        <Send className="text-blue-500" size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">{t('delivered')}</p>
                            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        </div>
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">{t('filter')}</option>
                            <option value="risk">{t('riskLevel')}</option>
                            <option value="weather">{t('weather')}</option>
                            <option value="scheme">{t('schemes')}</option>
                            <option value="price">{t('mspRate')}</option>
                        </select>
                    </div>
                    <select
                        value={selectedVillage}
                        onChange={(e) => setSelectedVillage(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="all">{t('allVillages')}</option>
                        {villages.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={simulateSending}
                    disabled={isSimulating || stats.pending === 0}
                    className="flex items-center gap-2 bg-paddy-green hover:bg-green-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {isSimulating ? (
                        <>
                            <RefreshCw size={18} className="animate-spin" />
                            {t('loading')}
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            {t('sendAll')}
                        </>
                    )}
                </button>
            </div>

            {/* Alert Templates */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
                <h2 className="font-bold text-slate-800 mb-4">{t('alertTemplates')}</h2>
                <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(ALERT_TEMPLATES).slice(0, 4).map(([key, template]) => (
                        <div key={key} className="bg-slate-50 p-3 rounded-lg text-sm">
                            <p className="font-medium text-slate-700 capitalize mb-1">{key}</p>
                            <p className="text-slate-600 text-xs">{template}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alerts Queue */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 font-semibold text-slate-700">{t('farmers')}</th>
                                <th className="text-left p-4 font-semibold text-slate-700">{t('village')}</th>
                                <th className="text-left p-4 font-semibold text-slate-700">{t('category')}</th>
                                <th className="text-left p-4 font-semibold text-slate-700">{t('description')}</th>
                                <th className="text-left p-4 font-semibold text-slate-700">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="p-4">
                                        <p className="font-medium text-slate-800">{alert.farmerName}</p>
                                        <p className="text-xs text-slate-500">{alert.phone}</p>
                                    </td>
                                    <td className="p-4 text-slate-600">{alert.village}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(alert.type)}`}>
                                            {alert.type}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-sm text-slate-600 truncate" title={alert.message}>
                                            {alert.message}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(alert.status)}
                                            <span className="text-sm text-slate-600 capitalize">{alert.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import { GOVERNMENT_SCHEMES, MSP_RATES } from "@/data/governmentSchemes";
import { ShieldCheck, ExternalLink, FileText, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SchemesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <ShieldCheck className="text-indigo-600" /> Government Schemes
                </h1>
                <p className="text-slate-600 mt-2">
                    Important schemes and subsidies for farmers in West Bengal
                </p>
            </header>

            {/* MSP Rates Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Minimum Support Prices (MSP) 2024-25</h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl shadow-sm border border-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 font-semibold text-slate-700">Crop</th>
                                <th className="text-left p-4 font-semibold text-slate-700">Variety</th>
                                <th className="text-right p-4 font-semibold text-slate-700">MSP (₹/Quintal)</th>
                                <th className="text-right p-4 font-semibold text-slate-700">Increase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MSP_RATES.map((rate, idx) => (
                                <tr key={idx} className={`border-t border-slate-100 ${rate.crop.includes('Paddy') ? 'bg-green-50' : ''}`}>
                                    <td className="p-4 font-medium text-slate-800">{rate.crop}</td>
                                    <td className="p-4 text-slate-600">{rate.variety}</td>
                                    <td className="p-4 text-right font-bold text-paddy-green">₹{rate.mspPerQuintal}</td>
                                    <td className="p-4 text-right text-green-600">+₹{rate.increaseFromLastYear}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* All Schemes */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">🛡️ Available Schemes</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {GOVERNMENT_SCHEMES.map((scheme) => (
                        <div
                            key={scheme.id}
                            className={`bg-white p-6 rounded-2xl shadow-sm border ${scheme.status === 'Closing Soon' ? 'border-red-200 bg-red-50/30' : 'border-slate-100'
                                }`}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <span className="text-4xl">{scheme.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-slate-800">{scheme.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scheme.status === 'Closing Soon' ? 'bg-red-100 text-red-700' :
                                                scheme.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                    scheme.status === 'Year-round' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {scheme.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium">{scheme.nameHindi}</p>
                                </div>
                            </div>

                            <p className="text-slate-700 mb-4">{scheme.description}</p>

                            {scheme.deadline && (
                                <div className="flex items-center gap-2 text-red-600 mb-4 p-2 bg-red-50 rounded-lg">
                                    <Clock size={16} />
                                    <span className="font-medium text-sm">Deadline: {scheme.deadline}</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="text-sm font-semibold text-slate-700 mb-2">Benefits:</p>
                                <ul className="space-y-1">
                                    {scheme.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-semibold text-slate-700 mb-2">Documents Required:</p>
                                <div className="flex flex-wrap gap-2">
                                    {scheme.documentsRequired.map((doc, idx) => (
                                        <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center gap-1">
                                            <FileText size={12} />
                                            {doc}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href={scheme.applicationLink}
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Apply Now <ExternalLink size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

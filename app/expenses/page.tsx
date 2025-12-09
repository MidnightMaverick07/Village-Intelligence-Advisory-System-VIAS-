"use client";

import { useState } from "react";
import {
    Calculator, IndianRupee, TrendingUp, TrendingDown, Plus, Trash2,
    Sprout, Droplets, Bug, Users, Tractor, Package, PiggyBank
} from "lucide-react";
import { getPaddyMSP } from "@/data/governmentSchemes";
import { useLanguage } from "@/context/LanguageContext";

interface ExpenseItem {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
}

const SAMPLE_EXPENSES: ExpenseItem[] = [
    { id: '1', category: 'seeds', description: 'Swarna seeds - 20kg', amount: 1200, date: '2024-07-01' },
    { id: '2', category: 'fertilizer', description: 'Urea 50kg + DAP 25kg', amount: 2100, date: '2024-07-15' },
    { id: '3', category: 'labor', description: 'Transplanting labor - 5 days', amount: 3500, date: '2024-07-20' },
    { id: '4', category: 'irrigation', description: 'Diesel pump - first month', amount: 800, date: '2024-08-01' },
    { id: '5', category: 'pesticide', description: 'Tricyclazole spray', amount: 450, date: '2024-08-15' },
    { id: '6', category: 'fertilizer', description: 'MOP 25kg', amount: 700, date: '2024-09-01' },
];

export default function ExpensesPage() {
    const { t } = useLanguage();
    const [expenses, setExpenses] = useState<ExpenseItem[]>(SAMPLE_EXPENSES);
    const [landArea, setLandArea] = useState(1.5);
    const [expectedYield, setExpectedYield] = useState(30);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        category: 'seeds',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    const EXPENSE_CATEGORIES = [
        { id: 'seeds', name: t('seeds'), icon: <Sprout size={16} /> },
        { id: 'fertilizer', name: t('fertilizer'), icon: <Package size={16} /> },
        { id: 'pesticide', name: t('pesticide'), icon: <Bug size={16} /> },
        { id: 'irrigation', name: t('irrigation'), icon: <Droplets size={16} /> },
        { id: 'labor', name: t('labor'), icon: <Users size={16} /> },
        { id: 'machinery', name: t('machinery'), icon: <Tractor size={16} /> },
        { id: 'other', name: t('other'), icon: <Package size={16} /> },
    ];

    const msp = getPaddyMSP();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const expectedRevenue = expectedYield * (msp?.price || 2320);
    const profit = expectedRevenue - totalExpenses;
    const profitPerAcre = profit / landArea;

    const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
        ...cat,
        total: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
    })).filter(cat => cat.total > 0);

    const handleAddExpense = () => {
        if (!newExpense.description || !newExpense.amount) return;
        setExpenses(prev => [...prev, {
            id: Date.now().toString(),
            ...newExpense,
            amount: parseFloat(newExpense.amount),
        }]);
        setNewExpense({
            category: 'seeds',
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
        });
        setShowAddForm(false);
    };

    const handleDeleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <Calculator className="text-purple-600" /> {t('expenseTracker')}
                </h1>
            </header>

            {/* Farm Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <h2 className="font-bold text-slate-800 mb-4">{t('farmDetails')}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('landArea')} ({t('acres')})
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={landArea}
                            onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('estimatedYield')} ({t('quintals')})
                        </label>
                        <input
                            type="number"
                            value={expectedYield}
                            onChange={(e) => setExpectedYield(parseFloat(e.target.value) || 0)}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {t('mspRate')} (₹/{t('quintals')})
                        </label>
                        <input
                            type="text"
                            value={`₹${msp?.price || 2320}`}
                            disabled
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-80">{t('totalExpenses')}</p>
                        <IndianRupee size={20} className="opacity-60" />
                    </div>
                    <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
                    <p className="text-xs mt-1 opacity-70">₹{Math.round(totalExpenses / landArea).toLocaleString()}/{t('acres')}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-80">{t('expectedRevenue')}</p>
                        <TrendingUp size={20} className="opacity-60" />
                    </div>
                    <p className="text-2xl font-bold">₹{expectedRevenue.toLocaleString()}</p>
                    <p className="text-xs mt-1 opacity-70">{expectedYield}q × ₹{msp?.price || 2320}</p>
                </div>

                <div className={`bg-gradient-to-br ${profit >= 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} p-5 rounded-xl text-white`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-80">{profit >= 0 ? t('profit') : t('loss')}</p>
                        {profit >= 0 ? <TrendingUp size={20} className="opacity-60" /> : <TrendingDown size={20} className="opacity-60" />}
                    </div>
                    <p className="text-2xl font-bold">{profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}</p>
                    <p className="text-xs mt-1 opacity-70">{((profit / totalExpenses) * 100).toFixed(0)}% ROI</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-80">{t('profitPerAcre')}</p>
                        <PiggyBank size={20} className="opacity-60" />
                    </div>
                    <p className="text-2xl font-bold">₹{Math.round(profitPerAcre).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-4">{t('breakdownByCategory')}</h2>
                    <div className="space-y-3">
                        {expensesByCategory.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="text-slate-600">{cat.icon}</div>
                                    <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">₹{cat.total.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">{((cat.total / totalExpenses) * 100).toFixed(0)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 h-4 rounded-full overflow-hidden bg-slate-200 flex">
                        {expensesByCategory.map((cat, idx) => {
                            const colors = ['bg-green-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-slate-500'];
                            return (
                                <div
                                    key={cat.id}
                                    className={colors[idx % colors.length]}
                                    style={{ width: `${(cat.total / totalExpenses) * 100}%` }}
                                    title={cat.name}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Expense List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-800">{t('expenses')}</h2>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 bg-paddy-green hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus size={16} />
                            {t('addExpense')}
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                            <div className="grid md:grid-cols-4 gap-3">
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                                    className="p-2 rounded-lg border border-slate-200"
                                >
                                    {EXPENSE_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder={t('description')}
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                                    className="p-2 rounded-lg border border-slate-200"
                                />
                                <input
                                    type="number"
                                    placeholder={`${t('amount')} (₹)`}
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                                    className="p-2 rounded-lg border border-slate-200"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddExpense} className="flex-1 bg-paddy-green text-white rounded-lg font-medium hover:bg-green-600">
                                        {t('add')}
                                    </button>
                                    <button onClick={() => setShowAddForm(false)} className="px-3 bg-slate-200 rounded-lg hover:bg-slate-300">×</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left p-3 font-medium text-slate-600">{t('category')}</th>
                                    <th className="text-left p-3 font-medium text-slate-600">{t('description')}</th>
                                    <th className="text-left p-3 font-medium text-slate-600">{t('date')}</th>
                                    <th className="text-right p-3 font-medium text-slate-600">{t('amount')}</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => {
                                    const cat = EXPENSE_CATEGORIES.find(c => c.id === expense.category);
                                    return (
                                        <tr key={expense.id} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    {cat?.icon}
                                                    <span>{cat?.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm text-slate-700">{expense.description}</td>
                                            <td className="p-3 text-sm text-slate-500">{expense.date}</td>
                                            <td className="p-3 text-right font-medium text-slate-800">₹{expense.amount.toLocaleString()}</td>
                                            <td className="p-3">
                                                <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 hover:text-red-600 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-slate-50">
                                <tr>
                                    <td colSpan={3} className="p-3 font-bold text-slate-700">{t('total')}</td>
                                    <td className="p-3 text-right font-bold text-slate-800">₹{totalExpenses.toLocaleString()}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

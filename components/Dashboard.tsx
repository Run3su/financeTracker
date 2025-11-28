import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal, 
  CreditCard,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { formatCurrency } from '../constants';
import { FinancialData } from '../types';
import SpendingChart from './SpendingChart';
import AddExpensePanel from './AddExpensePanel';
import AddIncomePanel from './AddIncomePanel';
import { getFinancialInsights } from '../services/geminiService';
import IncomeChart from './IncomeChart';

interface DashboardProps {
  data: FinancialData;
  onAddExpense: (category: string, amount: number) => void;
  onAddIncome: (category: string, amount: number) => void;
  onDeleteTransaction: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onAddExpense, onAddIncome, onDeleteTransaction }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const result = await getFinancialInsights(data);
    setInsights(result);
    setLoadingInsights(false);
  };

  const displayedTransactions = showAllTransactions 
    ? data.recentTransactions 
    : data.recentTransactions.slice(0, 3);
  
  // --- Personal Spending Logic ---
  const personalCategoryNames = ['Housing', 'Food', 'Transport', 'Leisure'];

  // Define colors for consistency
  const categoryColors: { [key: string]: string } = {
    'Housing': '#6366f1',   // indigo-500
    'Food': '#8b5cf6',      // violet-500
    'Transport': '#ec4899', // pink-500
    'Leisure': '#10b981'    // emerald-500
  };

  // Calculate personal spending totals directly from the transaction list
  const personalSpendingMap = data.recentTransactions
    .filter(tx => tx.type === 'expense' && personalCategoryNames.includes(tx.category))
    .reduce((acc, tx) => {
      if (!acc[tx.category]) {
        acc[tx.category] = {
          name: tx.category,
          amount: 0,
          color: categoryColors[tx.category] || '#e2e8f0' // slate-200 fallback
        };
      }
      acc[tx.category].amount += tx.amount;
      return acc;
    }, {} as { [key: string]: { name: string; amount: number; color: string } });

  const personalSpendingData = Object.values(personalSpendingMap);
  const totalPersonalSpending = personalSpendingData.reduce((acc, curr) => acc + curr.amount, 0);

  const displayCategories = [
    { name: 'Housing', label: 'Housing' },
    { name: 'Food', label: 'Food' },
    { name: 'Transport', label: 'Transport' },
    { name: 'Leisure', label: 'Extras' }
  ];
  // --- End Personal Spending Logic ---

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fade-in">
      
      {/* Header / Total Balance Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl shadow-blue-900/20 text-white">
        {/* Decorative Circles */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-400/20 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 text-sm font-medium tracking-wide">Total Balance</p>
              <h1 className="text-4xl font-bold mt-1 tracking-tight">{formatCurrency(data.totalBalance)}</h1>
            </div>
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
               <Wallet className="w-6 h-6 text-blue-50" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1 bg-green-400/20 px-3 py-1 rounded-full border border-green-400/20">
              <ArrowUpRight className="w-4 h-4 text-green-300" />
              <span className="text-xs font-semibold text-green-100">+12.5%</span>
            </div>
            <span className="text-xs text-blue-200">vs last month</span>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg font-bold text-slate-800">Smart Insights</h2>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={loadingInsights}
            className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            {loadingInsights ? <RefreshCw className="w-4 h-4 animate-spin"/> : 'Refresh'}
          </button>
        </div>
        
        {insights ? (
          <div className="prose prose-sm prose-slate">
            <ul className="space-y-2 pl-0 list-none" dangerouslySetInnerHTML={{ __html: insights }} />
          </div>
        ) : (
          <div className="text-slate-500 text-sm">
            Tap refresh to get AI-powered financial advice based on your current spending.
          </div>
        )}
      </div>

      {/* Add Income Panel */}
      <AddIncomePanel onAddIncome={onAddIncome} />

      {/* Income Sources Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800">Income Sources</h2>
           <button className="p-1 hover:bg-slate-50 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <IncomeChart data={data.incomeSources} />
      </div>


      {/* Add Expense Panel */}
      <AddExpensePanel onAddExpense={onAddExpense} />

      {/* Spending Analysis */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800">Personal Spending</h2>
          <button className="p-1 hover:bg-slate-50 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <SpendingChart data={personalSpendingData} />
        <div className="grid grid-cols-4 gap-2 mt-4">
          {displayCategories.map((displayCat) => {
            const catData = personalSpendingData.find(c => c.name === displayCat.name);
            const amount = catData ? catData.amount : 0;
            const color = catData ? catData.color : '#e2e8f0'; // slate-200 as fallback
            const percentage = totalPersonalSpending > 0 
              ? Math.round((amount / totalPersonalSpending) * 100) 
              : 0;

            return (
              <div key={displayCat.name} className="flex flex-col items-center p-2 bg-slate-50 rounded-xl">
                 <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: color }}></div>
                 <span className="text-xs text-slate-500">{displayCat.label}</span>
                 <span className="text-xs font-bold text-slate-700">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
          <button 
            onClick={() => setShowAllTransactions(!showAllTransactions)}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            {showAllTransactions ? 'Show Less' : 'See All'}
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {displayedTransactions.length > 0 ? (
            displayedTransactions.map((tx, idx) => (
              <div key={tx.id} className={`group flex items-center justify-between p-5 ${idx !== displayedTransactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-green-50' : 'bg-slate-50'
                  }`}>
                     {tx.type === 'income' ? <ArrowDownRight className="w-5 h-5 text-green-500" /> : <ArrowUpRight className="w-5 h-5 text-slate-500" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{tx.title}</h4>
                    <p className="text-xs text-slate-400">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <button 
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    aria-label="Remove transaction"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No recent transactions
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

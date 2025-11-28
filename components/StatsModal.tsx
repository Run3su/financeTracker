import React from 'react';
import { X, PieChart, ArrowUp, ArrowDown, DollarSign, Hash } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, transactions }) => {
  if (!isOpen) return null;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const netFlow = totalIncome - totalExpenses;
  const totalTransactions = transactions.length;
  const avgTransaction = totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0;

  const chartData = [
    { name: 'Income', value: totalIncome, color: '#22c55e' }, // green-500
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' }, // red-500
  ];
  
  const statCards = [
    { label: 'Total Income', value: formatCurrency(totalIncome), icon: ArrowUp, color: 'text-green-500' },
    { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: ArrowDown, color: 'text-red-500' },
    { label: 'Net Flow', value: formatCurrency(netFlow), icon: DollarSign, color: netFlow >= 0 ? 'text-blue-500' : 'text-orange-500' },
    { label: 'Transactions', value: totalTransactions, icon: Hash, color: 'text-slate-500' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PieChart className="w-6 h-6" /> Transaction Statistics
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
           <p className="text-slate-300 text-sm">An overview of your financial activity.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            {statCards.map(card => {
              const Icon = card.icon;
              return (
                 <div key={card.label} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                      <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                    </div>
                    <p className={`text-lg font-bold ${card.color} mt-1`}>{card.value}</p>
                 </div>
              );
            })}
          </div>
          
          {/* Comparison Chart */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Income vs. Expenses</h3>
            <div className="h-40 w-full bg-slate-50 rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(241, 245, 249, 1)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), null]}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" barSize={25} radius={[6, 6, 6, 6]}>
                     {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsModal;

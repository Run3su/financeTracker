import React, { useState } from 'react';
import { Briefcase, CreditCard, Layers, Plus } from 'lucide-react';

interface AddIncomePanelProps {
  onAddIncome: (category: string, amount: number) => void;
}

const INCOME_CATEGORIES = [
  { id: 'Business Income', label: 'Business', icon: Briefcase, activeBg: 'bg-blue-600', color: 'text-blue-600' },
  { id: 'Salary', label: 'Salary', icon: CreditCard, activeBg: 'bg-indigo-600', color: 'text-indigo-600' },
  { id: 'Side Hustle', label: 'Side Hustle', icon: Layers, activeBg: 'bg-emerald-600', color: 'text-emerald-600' },
];

const AddIncomePanel: React.FC<AddIncomePanelProps> = ({ onAddIncome }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected && amount) {
      onAddIncome(selected, Number(amount));
      setAmount('');
      setSelected(null);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 animate-fade-in mt-6">
        <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800">Quick Income</h2>
            <span className="text-xs text-slate-400 font-medium">Add earnings</span>
        </div>
      
      {/* Category Selector */}
      <div className="flex justify-start gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {INCOME_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              type="button"
              className={`flex flex-col items-center gap-2 min-w-[4.5rem] transition-all duration-300 group ${isActive ? 'scale-105' : 'hover:opacity-80'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                isActive 
                  ? `${cat.activeBg} text-white shadow-lg shadow-blue-900/10` 
                  : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
              }`}>
                <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Amount Input & Button */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-slate-50 p-2 pr-2 pl-5 rounded-2xl border border-slate-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
        <span className="text-slate-400 font-bold text-lg">K</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800 placeholder:text-slate-300 w-full"
        />
        <button
          type="submit"
          disabled={!selected || !amount}
          className="bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20 disabled:shadow-none hover:scale-105 active:scale-95 transition-all"
        >
          {selected && amount ? <Plus className="w-6 h-6" /> : <div className="w-2 h-2 bg-current rounded-full opacity-50" />}
        </button>
      </form>
    </div>
  );
};

export default AddIncomePanel;
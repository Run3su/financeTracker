import React from 'react';
import { X, Wallet as WalletIcon, ArrowDownRight } from 'lucide-react';
import { IncomeSource } from '../types';
import { formatCurrency } from '../constants';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalBalance: number;
  incomeSources: IncomeSource[];
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, totalBalance, incomeSources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <WalletIcon className="w-6 h-6" /> Wallet Summary
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
           <p className="text-emerald-100 text-sm">A quick look at your balance and earnings.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Total Balance Card */}
          <div className="text-center bg-slate-50 p-6 rounded-2xl">
            <p className="text-sm text-slate-500 font-medium">Total Balance</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{formatCurrency(totalBalance)}</p>
          </div>

          {/* Income Sources List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Income Sources</h3>
            <div className="space-y-2">
              {incomeSources.map(source => (
                <div key={source.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <ArrowDownRight className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{source.name}</span>
                  </div>
                  <span className="font-bold text-green-600 text-sm">
                    {formatCurrency(source.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;

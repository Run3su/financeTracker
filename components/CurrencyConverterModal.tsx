import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { ExchangeRates } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: ExchangeRates | null;
  onRefreshRates: () => void;
  isRefreshing: boolean;
}

const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({ isOpen, onClose, rates, onRefreshRates, isRefreshing }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('ZMW');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState<string>('');

  useEffect(() => {
    if (!rates || !amount) {
      setConvertedAmount('');
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setConvertedAmount('');
      return;
    }

    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];

    if (!rateFrom || !rateTo) {
      setConvertedAmount('N/A');
      return;
    }
    
    // All rates are based on USD. Convert from the source currency to USD, then from USD to the target currency.
    const amountInUSD = numAmount / rateFrom;
    const finalAmount = amountInUSD * rateTo;

    setConvertedAmount(finalAmount.toFixed(2));
  }, [amount, fromCurrency, toCurrency, rates]);

  if (!isOpen) return null;
  
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
        setAmount(value);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Currency Converter</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-indigo-100 text-sm">Real-time exchange rates.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-5 gap-2 items-center">
            {/* From */}
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-500">From</label>
              <select 
                value={fromCurrency} 
                onChange={e => setFromCurrency(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-800"
              >
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            {/* Swap */}
            <div className="flex justify-center">
              <button 
                onClick={handleSwap} 
                className="mt-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div className="col-span-2 space-y-1">
               <label className="text-xs font-semibold text-slate-500">To</label>
               <select 
                value={toCurrency} 
                onChange={e => setToCurrency(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-800"
              >
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          {/* Amount and Result */}
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Amount</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full p-3 text-2xl font-bold text-slate-800 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
             </div>
             <div className="space-y-1">
                 <label className="text-xs font-semibold text-slate-500">Converted Amount</label>
                 <div className="w-full p-3 text-2xl font-bold text-indigo-600 rounded-lg bg-indigo-50 border border-indigo-100 min-h-[56px] flex items-center">
                    {rates ? convertedAmount : 'Loading rates...'}
                 </div>
             </div>
          </div>

          <div className="text-center">
            <button 
              onClick={onRefreshRates} 
              disabled={isRefreshing}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Update rates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterModal;

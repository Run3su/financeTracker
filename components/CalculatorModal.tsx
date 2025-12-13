import React, { useState } from 'react';
import { X, Delete, Equal } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [resetNext, setResetNext] = useState(false);

  if (!isOpen) return null;

  const handleNum = (num: string) => {
    if (display === '0' || resetNext) {
      setDisplay(num);
      setResetNext(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setResetNext(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setResetNext(false);
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleEqual = () => {
    try {
      // Evaluate the expression. 
      // Note: For a production app, a custom parser is safer than eval/Function, 
      // but strictly controlled button inputs make this reasonably safe for a personal tool.
      const fullExp = expression + display;
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + fullExp)();
      
      const formattedResult = String(Number(result.toFixed(4))); // Limit decimals
      setDisplay(formattedResult);
      setExpression('');
      setResetNext(true);
    } catch (e) {
      setDisplay('Error');
      setResetNext(true);
    }
  };

  const buttons = [
    { label: 'C', onClick: handleClear, className: 'text-red-500 bg-red-50' },
    { label: '÷', onClick: () => handleOp('/'), className: 'text-blue-600 bg-blue-50' },
    { label: '×', onClick: () => handleOp('*'), className: 'text-blue-600 bg-blue-50' },
    { label: <Delete className="w-5 h-5" />, onClick: handleBackspace, className: 'text-slate-600 bg-slate-100' },
    { label: '7', onClick: () => handleNum('7'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '8', onClick: () => handleNum('8'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '9', onClick: () => handleNum('9'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '-', onClick: () => handleOp('-'), className: 'text-blue-600 bg-blue-50' },
    { label: '4', onClick: () => handleNum('4'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '5', onClick: () => handleNum('5'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '6', onClick: () => handleNum('6'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '+', onClick: () => handleOp('+'), className: 'text-blue-600 bg-blue-50' },
    { label: '1', onClick: () => handleNum('1'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '2', onClick: () => handleNum('2'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '3', onClick: () => handleNum('3'), className: 'text-slate-700 bg-white border border-slate-100' },
    { label: '=', onClick: handleEqual, className: 'row-span-2 text-white bg-blue-600 shadow-lg shadow-blue-500/30' },
    { label: '0', onClick: () => handleNum('0'), className: 'col-span-2 text-slate-700 bg-white border border-slate-100' },
    { label: '.', onClick: () => handleNum('.'), className: 'text-slate-700 bg-white border border-slate-100' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-slate-900 p-6 pb-10 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Calculator</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Display */}
          <div className="text-right space-y-1">
            <div className="h-6 text-sm text-slate-400 font-medium">{expression}</div>
            <div className="text-4xl font-bold tracking-tight overflow-x-auto no-scrollbar">{display}</div>
          </div>
        </div>

        {/* Keypad */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`
                  h-16 rounded-2xl text-xl font-bold flex items-center justify-center transition-all active:scale-95
                  ${btn.className}
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;
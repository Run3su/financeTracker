import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import EditProfileModal from './components/EditProfileModal';
import WalletModal from './components/WalletModal';
import StatsModal from './components/StatsModal';
import CalculatorModal from './components/CalculatorModal';
import { Home, PieChart, Bell, Calculator } from 'lucide-react';
import { INITIAL_STATE } from './constants';
import { FinancialData, Transaction } from './types';
import { saveState, loadState } from './services/storageService';


const App: React.FC = () => {
  // Lazy initialize state from localStorage or use defaults
  const [userName, setUserName] = useState<string>(() => {
    const savedState = loadState();
    return savedState ? savedState.userName : "Mwape Katongo";
  });
  
  const [financialData, setFinancialData] = useState<FinancialData>(() => {
    const savedState = loadState();
    return savedState ? savedState.financialData : INITIAL_STATE;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Effect to save app state to localStorage whenever it changes
  useEffect(() => {
    saveState(userName, financialData);
  }, [userName, financialData]);


  const handleUpdateProfile = (name: string, salary: number) => {
    setUserName(name);
    
    // Find the old salary to calculate the difference
    const oldSalarySource = financialData.incomeSources.find(s => s.name === 'Salary');
    const oldSalaryAmount = oldSalarySource ? oldSalarySource.amount : 0;
    
    // Calculate the change in salary and update the total balance incrementally
    const salaryDifference = salary - oldSalaryAmount;
    const newTotalBalance = financialData.totalBalance + salaryDifference;

    // Update only the salary in the income sources list
    const updatedIncomeSources = financialData.incomeSources.map(source => {
        if (source.name === 'Salary') {
            return { ...source, amount: salary };
        }
        return source;
    });
    
    setFinancialData({
      ...financialData,
      totalBalance: newTotalBalance,
      incomeSources: updatedIncomeSources
    });
  };

  const handleAddExpense = (category: string, amount: number) => {
    // 1. Update Total Balance (Subtract expense)
    const newTotalBalance = financialData.totalBalance - amount;

    // 2. Update Spending Categories
    // We map 'Extras' to 'Leisure' to match existing data colors if present, otherwise just use 'Extras'
    const targetCategory = category === 'Extras' ? 'Leisure' : category;
    
    // Check if category exists
    const categoryExists = financialData.spendingCategories.some(c => c.name === targetCategory);
    let updatedCategories;

    if (categoryExists) {
      updatedCategories = financialData.spendingCategories.map(cat => {
        if (cat.name === targetCategory) {
          return { ...cat, amount: cat.amount + amount };
        }
        return cat;
      });
    } else {
      // Add new category
      updatedCategories = [
        ...financialData.spendingCategories,
        { name: targetCategory, amount: amount, color: '#10b981' } // Emerald for extras/leisure default
      ];
    }

    // 3. Add to Recent Transactions
    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      title: `${category} Expense`,
      amount: amount,
      date: 'Just now',
      type: 'expense',
      category: targetCategory,
      icon: 'shopping-cart' 
    };

    setFinancialData({
      ...financialData,
      totalBalance: newTotalBalance,
      spendingCategories: updatedCategories,
      recentTransactions: [newTransaction, ...financialData.recentTransactions]
    });
  };

  const handleAddIncome = (category: string, amount: number) => {
    // 1. Update Total Balance (Add income)
    const newTotalBalance = financialData.totalBalance + amount;

    // 2. Update Income Sources
    const updatedIncomeSources = financialData.incomeSources.map(source => {
      if (source.name === category) {
        return { ...source, amount: source.amount + amount };
      }
      return source;
    });

    // 3. Add to Recent Transactions
    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      title: `${category} Added`,
      amount: amount,
      date: 'Just now',
      type: 'income',
      category: category,
      icon: 'trending-up'
    };

    setFinancialData({
      ...financialData,
      totalBalance: newTotalBalance,
      incomeSources: updatedIncomeSources,
      recentTransactions: [newTransaction, ...financialData.recentTransactions]
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = financialData.recentTransactions.find(t => t.id === id);
    if (!transaction) return;

    let newTotalBalance = financialData.totalBalance;
    let newIncomeSources = [...financialData.incomeSources];
    let newSpendingCategories = [...financialData.spendingCategories];

    // Revert the financial impact
    if (transaction.type === 'income') {
      newTotalBalance -= transaction.amount;
      newIncomeSources = newIncomeSources.map(src => {
        if (src.name === transaction.category) {
          return { ...src, amount: Math.max(0, src.amount - transaction.amount) };
        }
        return src;
      });
    } else {
      // Revert expense
      newTotalBalance += transaction.amount;
      newSpendingCategories = newSpendingCategories.map(cat => {
        if (cat.name === transaction.category) {
          return { ...cat, amount: Math.max(0, cat.amount - transaction.amount) };
        }
        return cat;
      });
    }

    const newRecentTransactions = financialData.recentTransactions.filter(t => t.id !== id);

    setFinancialData({
      ...financialData,
      totalBalance: newTotalBalance,
      incomeSources: newIncomeSources,
      spendingCategories: newSpendingCategories,
      recentTransactions: newRecentTransactions
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-800 font-sans selection:bg-blue-100">
      <div className="max-w-md mx-auto min-h-screen bg-white/50 shadow-2xl relative flex flex-col backdrop-blur-sm border-x border-white/50">
        
        {/* Top Navigation / Status Bar Area */}
        <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-transparent sticky top-0 z-20 backdrop-blur-md">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsProfileOpen(true)}
          >
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
               {userName.charAt(0)}{userName.split(' ')[1]?.charAt(0) || ''}
             </div>
             <div>
               <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Welcome back</p>
               <h1 className="text-lg font-bold text-slate-800">{userName}</h1>
             </div>
          </div>
          <button className="relative p-2 rounded-full hover:bg-white/50 transition-colors">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 overflow-y-auto no-scrollbar scroll-smooth">
          <Dashboard 
            data={financialData} 
            onAddExpense={handleAddExpense}
            onAddIncome={handleAddIncome}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </main>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-6 left-6 right-6 mx-6 mb-4 bg-slate-900/90 text-white backdrop-blur-lg rounded-2xl shadow-xl shadow-slate-900/20 px-6 py-4 z-50">
          <ul className="flex justify-between items-center relative">
            <li>
              <button 
                onClick={() => setIsWalletOpen(true)}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">Wallet</span>
              </button>
            </li>
            
            {/* Center Action Button - Calculator */}
            <li className="absolute left-1/2 -top-10 -translate-x-1/2">
              <button 
                onClick={() => setIsCalculatorOpen(true)}
                className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-slate-50 hover:scale-105 transition-transform"
              >
                <Calculator className="w-7 h-7 text-white" />
              </button>
            </li>

            <li>
              <button 
                onClick={() => setIsStatsOpen(true)}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <PieChart className="w-6 h-6" />
                <span className="text-[10px] font-medium">Stats</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Modals */}
        <EditProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          currentName={userName}
          currentData={financialData}
          onSave={handleUpdateProfile}
        />

        <WalletModal 
          isOpen={isWalletOpen} 
          onClose={() => setIsWalletOpen(false)}
          totalBalance={financialData.totalBalance}
          incomeSources={financialData.incomeSources}
        />

        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          transactions={financialData.recentTransactions}
        />

        <CalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
        />
        
      </div>
    </div>
  );
};

export default App;
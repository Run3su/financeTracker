import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import EditProfileModal from './components/EditProfileModal';
import WalletModal from './components/WalletModal';
import StatsModal from './components/StatsModal';
import { Home, PieChart, Bell, User } from 'lucide-react';
import { INITIAL_STATE } from './constants';
import { FinancialData, Transaction } from './types';

const App: React.FC = () => {
  const [userName, setUserName] = useState("Mwape Katongo");
  const [financialData, setFinancialData] = useState<FinancialData>(INITIAL_STATE);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

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
          <ul className="flex justify-between items-center">
            <li>
              <button className="flex flex-col items-center gap-1 text-blue-400">
                <Home className="w-6 h-6 fill-current" />
                <span className="text-[10px] font-medium">Home</span>
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
            <li>
              <button 
                onClick={() => { /* This can be an 'add' button, linking to a new modal or panel */ }}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full -mt-10 border-4 border-[#f6f8fb] flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 transition-transform">
                   <span className="text-2xl font-light mb-1">+</span>
                </div>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsWalletOpen(true)}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <WalletIcon className="w-6 h-6" />
                <span className="text-[10px] font-medium">Wallet</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium">Profile</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

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
    </div>
  );
};

// Wallet Icon Component for Navigation
const WalletIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

export default App;
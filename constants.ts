import { FinancialData } from './types';

export const INITIAL_STATE: FinancialData = {
  totalBalance: 0,
  incomeSources: [
    { id: '1', name: 'Business Income', amount: 0, trend: 0 },
    { id: '2', name: 'Salary', amount: 0, trend: 0 },
    { id: '3', name: 'Side Hustle', amount: 0, trend: 0 },
  ],
  recentTransactions: [],
  spendingCategories: [
    { name: 'Business', amount: 0, color: '#3b82f6' },
    { name: 'Housing', amount: 0, color: '#6366f1' },
    { name: 'Food', amount: 0, color: '#8b5cf6' },
    { name: 'Transport', amount: 0, color: '#ec4899' },
    { name: 'Leisure', amount: 0, color: '#10b981' },
  ],
};


export const MOCK_DATA: FinancialData = {
  totalBalance: 124500.50,
  incomeSources: [
    { id: '1', name: 'Business Income', amount: 85000, trend: 12 },
    { id: '2', name: 'Salary', amount: 35000, trend: 0 },
    { id: '3', name: 'Side Hustle', amount: 4500.50, trend: 5 },
  ],
  recentTransactions: [
    { id: 't1', title: 'Office Supplies', amount: 4500, date: 'Today', type: 'expense', category: 'Business', icon: 'briefcase' },
    { id: 't2', title: 'Monthly Salary', amount: 35000, date: 'Yesterday', type: 'income', category: 'Salary', icon: 'wallet' },
    { id: 't3', title: 'Uber Ride', amount: 120, date: 'Yesterday', type: 'expense', category: 'Transport', icon: 'car' },
    { id: 't4', title: 'Grocery Shopping', amount: 3200, date: 'Oct 24', type: 'expense', category: 'Food', icon: 'shopping-cart' },
    { id: 't5', title: 'Client Payment', amount: 15000, date: 'Oct 22', type: 'income', category: 'Business', icon: 'trending-up' },
  ],
  spendingCategories: [
    { name: 'Business', amount: 45000, color: '#3b82f6' }, // blue-500
    { name: 'Housing', amount: 15000, color: '#6366f1' }, // indigo-500
    { name: 'Food', amount: 8000, color: '#8b5cf6' }, // violet-500
    { name: 'Transport', amount: 5000, color: '#ec4899' }, // pink-500
    { name: 'Leisure', amount: 4000, color: '#10b981' }, // emerald-500
  ]
};

export const formatCurrency = (amount: number): string => {
  return `K ${amount.toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
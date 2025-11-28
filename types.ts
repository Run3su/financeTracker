export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  category: string;
  icon?: string;
}

export interface IncomeSource {
  id: string;
  name: 'Business Income' | 'Salary' | 'Side Hustle';
  amount: number;
  trend: number; // Percentage change
}

export interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
}

export interface FinancialData {
  totalBalance: number;
  incomeSources: IncomeSource[];
  recentTransactions: Transaction[];
  spendingCategories: SpendingCategory[];
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface FinanceData {
  expenses: Expense[];
  savingGoals: SavingGoal[];
  budget: number;
} 
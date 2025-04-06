import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, SavingGoal, FinanceData } from '../utils/types';
import { storage } from '../utils/storage';

interface FinanceContextType {
  expenses: Expense[];
  savingGoals: SavingGoal[];
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addSavingGoal: (goal: Omit<SavingGoal, 'id'>) => Promise<void>;
  updateSavingGoal: (goal: SavingGoal) => Promise<void>;
  deleteSavingGoal: (id: string) => Promise<void>;
  contributeToSavingGoal: (goalId: string, amount: number) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [financeData, setFinanceData] = useState<FinanceData>({ expenses: [], savingGoals: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await storage.getData();
        setFinanceData(data);
      } catch (error) {
        console.error('Failed to load finance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Add a new expense
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4()
    };
    
    await storage.addExpense(newExpense);
    setFinanceData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  // Update an existing expense
  const updateExpense = async (updatedExpense: Expense) => {
    await storage.updateExpense(updatedExpense);
    setFinanceData(prev => ({
      ...prev,
      expenses: prev.expenses.map(exp => 
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    }));
  };

  // Delete an expense
  const deleteExpense = async (id: string) => {
    await storage.deleteExpense(id);
    setFinanceData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(exp => exp.id !== id)
    }));
  };

  // Add a new saving goal
  const addSavingGoal = async (goal: Omit<SavingGoal, 'id'>) => {
    const newGoal: SavingGoal = {
      ...goal,
      id: uuidv4()
    };
    
    await storage.addSavingGoal(newGoal);
    setFinanceData(prev => ({
      ...prev,
      savingGoals: [...prev.savingGoals, newGoal]
    }));
  };

  // Update an existing saving goal
  const updateSavingGoal = async (updatedGoal: SavingGoal) => {
    await storage.updateSavingGoal(updatedGoal);
    setFinanceData(prev => ({
      ...prev,
      savingGoals: prev.savingGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    }));
  };

  // Delete a saving goal
  const deleteSavingGoal = async (id: string) => {
    await storage.deleteSavingGoal(id);
    setFinanceData(prev => ({
      ...prev,
      savingGoals: prev.savingGoals.filter(goal => goal.id !== id)
    }));
  };

  // Contribute to a saving goal
  const contributeToSavingGoal = async (goalId: string, amount: number) => {
    const goal = financeData.savingGoals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedGoal: SavingGoal = {
      ...goal,
      currentAmount: goal.currentAmount + amount
    };
    
    await storage.updateSavingGoal(updatedGoal);
    setFinanceData(prev => ({
      ...prev,
      savingGoals: prev.savingGoals.map(g => 
        g.id === goalId ? updatedGoal : g
      )
    }));
  };

  const value = {
    expenses: financeData.expenses,
    savingGoals: financeData.savingGoals,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    contributeToSavingGoal
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}; 
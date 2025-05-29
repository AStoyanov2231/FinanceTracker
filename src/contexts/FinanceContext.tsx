import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, SavingGoal, FinanceData } from '../utils/types';
import { storage } from '../utils/storage';

interface FinanceContextType {
  expenses: Expense[];
  savingGoals: SavingGoal[];
  budget: number;
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addSavingGoal: (goal: Omit<SavingGoal, 'id'>) => Promise<void>;
  updateSavingGoal: (goal: SavingGoal) => Promise<void>;
  deleteSavingGoal: (id: string) => Promise<void>;
  addToBudget: (amount: number) => Promise<void>;
  updateBudget: (amount: number) => Promise<void>;
  getAvailableBalance: () => number;
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
  const [financeData, setFinanceData] = useState<FinanceData>({ 
    expenses: [], 
    savingGoals: [],
    budget: 0
  });
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

  // Get the total available balance (budget)
  const getAvailableBalance = (): number => {
    return financeData.budget;
  };

  // Add a new expense (deducts from budget)
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4()
    };
    
    await storage.addExpense(newExpense);
    
    // Update budget
    const updatedBudget = Math.max(0, financeData.budget - newExpense.amount);
    await storage.updateBudget(updatedBudget);
    
    setFinanceData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
      budget: updatedBudget
    }));
  };

  // Update an existing expense
  const updateExpense = async (updatedExpense: Expense) => {
    const oldExpense = financeData.expenses.find(e => e.id === updatedExpense.id);
    
    await storage.updateExpense(updatedExpense);
    
    if (oldExpense) {
      const difference = oldExpense.amount - updatedExpense.amount;
      
      if (difference !== 0) {
        let updatedBudget = financeData.budget;
        
        if (difference > 0) {
          // Expense reduced, add difference back
          updatedBudget = financeData.budget + difference;
          await storage.updateBudget(updatedBudget);
        } else {
          // Expense increased, deduct difference
          const increaseAmount = Math.abs(difference);
          updatedBudget = Math.max(0, financeData.budget - increaseAmount);
          await storage.updateBudget(updatedBudget);
        }
        
        setFinanceData(prev => ({
          ...prev,
          expenses: prev.expenses.map(exp => 
            exp.id === updatedExpense.id ? updatedExpense : exp
          ),
          budget: updatedBudget
        }));
      } else {
        // Amount unchanged, just update the expense
        setFinanceData(prev => ({
          ...prev,
          expenses: prev.expenses.map(exp => 
            exp.id === updatedExpense.id ? updatedExpense : exp
          )
        }));
      }
    }
  };

  // Delete an expense (adds amount back to budget)
  const deleteExpense = async (id: string) => {
    const expense = financeData.expenses.find(e => e.id === id);
    
    await storage.deleteExpense(id);
    
    if (expense) {
      // Add expense amount back to budget
      const updatedBudget = financeData.budget + expense.amount;
      await storage.updateBudget(updatedBudget);
      
      setFinanceData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(exp => exp.id !== id),
        budget: updatedBudget
      }));
    }
  };

  // Add a new saving goal
  const addSavingGoal = async (goal: Omit<SavingGoal, 'id'>) => {
    const newGoal: SavingGoal = {
      ...goal,
      id: uuidv4(),
      currentAmount: 0 // Always start at 0
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

  // Add to budget
  const addToBudget = async (amount: number) => {
    const updatedBudget = financeData.budget + amount;
    await storage.updateBudget(updatedBudget);
    
    setFinanceData(prev => ({
      ...prev,
      budget: updatedBudget
    }));
  };

  // Update budget
  const updateBudget = async (amount: number) => {
    await storage.updateBudget(amount);
    
    setFinanceData(prev => ({
      ...prev,
      budget: amount
    }));
  };

  const value = {
    expenses: financeData.expenses,
    savingGoals: financeData.savingGoals,
    budget: financeData.budget,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    addToBudget,
    updateBudget,
    getAvailableBalance
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}; 
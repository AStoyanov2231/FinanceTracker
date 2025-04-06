import { FinanceData, Expense, SavingGoal } from './types';

// Define the type for the Electron API
declare global {
  interface Window {
    electronAPI?: {
      getData: () => Promise<FinanceData>;
      saveData: (data: FinanceData) => Promise<boolean>;
    };
  }
}

// Default data if electronAPI is not available (web only mode)
const defaultData: FinanceData = {
  expenses: [],
  savingGoals: []
};

// Local storage key
const STORAGE_KEY = 'finance-tracker-data';

// Utility for data operations
export const storage = {
  // Get all data
  async getData(): Promise<FinanceData> {
    try {
      // Try to use Electron API first
      if (window.electronAPI) {
        return await window.electronAPI.getData();
      }
      
      // Fallback to localStorage for web
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (dataStr) {
        return JSON.parse(dataStr) as FinanceData;
      }
      
      // Initialize with default data if nothing exists
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    } catch (error) {
      console.error('Error getting data:', error);
      return defaultData;
    }
  },
  
  // Save all data
  async saveData(data: FinanceData): Promise<boolean> {
    try {
      // Try to use Electron API first
      if (window.electronAPI) {
        return await window.electronAPI.saveData(data);
      }
      
      // Fallback to localStorage for web
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  },
  
  // Add expense
  async addExpense(expense: Expense): Promise<boolean> {
    const data = await this.getData();
    data.expenses.push(expense);
    return this.saveData(data);
  },
  
  // Add saving goal
  async addSavingGoal(goal: SavingGoal): Promise<boolean> {
    const data = await this.getData();
    data.savingGoals.push(goal);
    return this.saveData(data);
  },
  
  // Update expense
  async updateExpense(updatedExpense: Expense): Promise<boolean> {
    const data = await this.getData();
    const index = data.expenses.findIndex(e => e.id === updatedExpense.id);
    if (index !== -1) {
      data.expenses[index] = updatedExpense;
      return this.saveData(data);
    }
    return false;
  },
  
  // Update saving goal
  async updateSavingGoal(updatedGoal: SavingGoal): Promise<boolean> {
    const data = await this.getData();
    const index = data.savingGoals.findIndex(g => g.id === updatedGoal.id);
    if (index !== -1) {
      data.savingGoals[index] = updatedGoal;
      return this.saveData(data);
    }
    return false;
  },
  
  // Delete expense
  async deleteExpense(id: string): Promise<boolean> {
    const data = await this.getData();
    data.expenses = data.expenses.filter(e => e.id !== id);
    return this.saveData(data);
  },
  
  // Delete saving goal
  async deleteSavingGoal(id: string): Promise<boolean> {
    const data = await this.getData();
    data.savingGoals = data.savingGoals.filter(g => g.id !== id);
    return this.saveData(data);
  }
}; 
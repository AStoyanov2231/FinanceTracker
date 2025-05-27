import { FinanceData, Expense, SavingGoal } from './types';

// Local storage key
const STORAGE_KEY = 'finance-tracker-data';

// Default data
const defaultData: FinanceData = {
  expenses: [],
  savingGoals: [],
  budget: 0
};

// Utility for data operations with localStorage
export const storage = {
  // Get all data
  async getData(): Promise<FinanceData> {
    try {
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
  },
  
  // Update budget
  async updateBudget(amount: number): Promise<boolean> {
    const data = await this.getData();
    data.budget = amount;
    return this.saveData(data);
  },

  // Add to budget
  async addToBudget(amount: number): Promise<boolean> {
    const data = await this.getData();
    data.budget += amount;
    return this.saveData(data);
  },
  
  // Export data as JSON file
  exportData(): void {
    this.getData().then(data => {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `finance-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });
  },
  
  // Import data from JSON file
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData) as FinanceData;
      
      // Validate the data structure
      if (!data.expenses || !data.savingGoals) {
        throw new Error('Invalid data format');
      }
      
      // Ensure budget exists
      if (data.budget === undefined) {
        data.budget = 0;
      }
      
      return this.saveData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}; 
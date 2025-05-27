import React, { useState } from 'react';
import { Expense } from '../utils/types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Get unique categories from expenses
  const categories = ['All', ...new Set(expenses.map(expense => expense.category))];
  
  // Filter expenses by selected category
  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory);
  
  // Sort expenses by date (most recent first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'from-orange-500 to-red-500',
      'Transport': 'from-blue-500 to-indigo-500',
      'Housing': 'from-green-500 to-emerald-500',
      'Entertainment': 'from-purple-500 to-pink-500',
      'Utilities': 'from-yellow-500 to-orange-500',
      'Healthcare': 'from-red-500 to-pink-500',
      'Shopping': 'from-indigo-500 to-purple-500',
      'Other': 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Expense History</h2>
          
          {categories.length > 1 && (
            <div className="flex items-center space-x-2">
              <label htmlFor="categoryFilter" className="text-sm text-gray-300">
                Filter:
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {sortedExpenses.length === 0 ? (
        <div className="p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center bg-white/10 rounded-full p-4 mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-300 text-base sm:text-lg mb-1">No expenses found</p>
          <p className="text-xs sm:text-sm text-gray-500">
            {selectedCategory !== 'All' 
              ? `No expenses in ${selectedCategory} category` 
              : 'Add your first expense to start tracking'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {sortedExpenses.map((expense) => (
            <div key={expense.id} className="group hover:bg-white/5 transition-all duration-300">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(expense.category)} bg-opacity-20`}>
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(expense.category)} flex items-center justify-center`}>
                          <span className="text-white text-xs font-semibold">
                            {expense.category.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-blue-300 transition-colors">
                          {expense.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(expense.category)} bg-opacity-20 text-gray-200`}>
                            {expense.category}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-400">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 mt-2 sm:mt-0">
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-semibold text-red-400">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-2.5 bg-white/10 hover:bg-blue-500/20 rounded-lg text-gray-300 hover:text-blue-300 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation"
                        title="Edit expense"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      
                      {deleteConfirmId === expense.id ? (
                        <div className="flex items-center space-x-2 bg-red-500/20 rounded-lg p-1.5">
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors active:scale-95 touch-manipulation"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-md transition-colors active:scale-95 touch-manipulation"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(expense.id)}
                          className="p-2.5 bg-white/10 hover:bg-red-500/20 rounded-lg text-gray-300 hover:text-red-300 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation"
                          title="Delete expense"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {sortedExpenses.length > 0 && (
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-400">
              Showing {sortedExpenses.length} expense{sortedExpenses.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs sm:text-sm font-medium text-white">
              Total: {formatCurrency(sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList; 
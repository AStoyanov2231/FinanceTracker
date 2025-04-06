import React from 'react';
import { useFinance } from '../contexts/FinanceContext';

const DashboardPage: React.FC = () => {
  const { expenses, savingGoals, isLoading } = useFinance();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate total saving goals
  const totalSavingGoals = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const currentSavings = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const remainingSavings = totalSavingGoals - currentSavings;

  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get top 3 categories with highest spending
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Get saving goals with least progress
  const savingGoalsWithProgress = savingGoals.map(goal => ({
    ...goal,
    progress: (goal.currentAmount / goal.targetAmount) * 100
  }));

  const priorityGoals = [...savingGoalsWithProgress]
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-2">Total Expenses</h2>
          <p className="text-3xl font-bold text-indigo-300">{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-2">Saving Goals</h2>
          <p className="text-3xl font-bold text-indigo-300">{formatCurrency(totalSavingGoals)}</p>
          <p className="text-sm text-gray-400 mt-2">
            Current: {formatCurrency(currentSavings)} | 
            Remaining: {formatCurrency(remainingSavings)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-2">Statistics</h2>
          <p className="text-sm text-gray-300">
            <span className="font-medium text-indigo-300">Expenses:</span> {expenses.length}
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-medium text-indigo-300">Saving Goals:</span> {savingGoals.length}
          </p>
        </div>
      </div>

      {/* Recent Expenses and Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Recent Expenses</h2>
          
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center bg-indigo-900/40 rounded-full p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-300">No expenses recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div>
                    <p className="font-medium text-gray-100">{expense.name}</p>
                    <p className="text-sm text-gray-400">{expense.date} | {expense.category}</p>
                  </div>
                  <p className="font-medium text-green-300">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Top Categories</h2>
          
          {topCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center bg-indigo-900/40 rounded-full p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-300">No expense categories yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {topCategories.map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-100">{category}</p>
                    <p className="text-sm font-medium text-indigo-300">{formatCurrency(amount)}</p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Priority Saving Goals */}
      <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Priority Saving Goals</h2>
        
        {priorityGoals.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center bg-indigo-900/40 rounded-full p-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-300">No saving goals created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityGoals.map(goal => (
              <div key={goal.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <h3 className="font-medium mb-1 text-gray-100">{goal.name}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                      goal.progress >= 75 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      goal.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                      goal.progress >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-300">{Math.round(goal.progress)}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 
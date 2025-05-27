import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';

const DashboardPage: React.FC = () => {
  const { expenses, savingGoals, budget, isLoading, addToBudget, getAvailableBalance } = useFinance();
  const [budgetInput, setBudgetInput] = useState<string>('');
  const [isAddingBudget, setIsAddingBudget] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentSavings = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const availableBalance = getAvailableBalance();

  // Handle budget addition
  const handleAddBudget = async () => {
    const amount = parseFloat(budgetInput);
    if (amount && amount > 0) {
      setIsAddingBudget(true);
      try {
        await addToBudget(amount);
        setBudgetInput('');
      } catch (error) {
        console.error('Error adding budget:', error);
      } finally {
        setIsAddingBudget(false);
      }
    }
  };

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

  // Get saving goals with progress including available balance
  const savingGoalsWithProgress = savingGoals.map(goal => {
    const totalForGoal = goal.currentAmount + availableBalance;
    const progress = Math.min(100, (totalForGoal / goal.targetAmount) * 100);
    return {
      ...goal,
      totalAvailable: totalForGoal,
      progress: progress
    };
  });

  const priorityGoals = [...savingGoalsWithProgress]
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 3);

  return (
    <div className="space-y-8 px-2 sm:px-0">
      {/* Header with Budget Input */}
      <div className="text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Finance Dashboard
        </h1>
        
        {/* Budget Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">Add to Budget</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Enter amount..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddBudget}
              disabled={!budgetInput || parseFloat(budgetInput) <= 0 || isAddingBudget}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isAddingBudget ? (
                <svg className="w-5 h-5 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Total Budget</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(budget)}</p>
            </div>
          </div>
          <p className="text-xs text-green-400">Available funds</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Total Expenses</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
          <p className="text-xs text-red-400">Money spent</p>
        </div>
      </div>

      {/* Recent Activity and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Expenses */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Recent Expenses</h2>
          </div>
          
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center bg-white/10 rounded-full p-4 mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-300 text-base sm:text-lg">No expenses yet</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Start tracking your spending</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">{expense.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{expense.date} • {expense.category}</p>
                  </div>
                  <p className="font-semibold text-red-400 text-sm sm:text-base">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Top Categories</h2>
          </div>
          
          {topCategories.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center bg-white/10 rounded-full p-4 mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-300 text-base sm:text-lg">No categories yet</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Add expenses to see spending patterns</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {topCategories.map(([category, amount], index) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                        'bg-gradient-to-r from-green-400 to-blue-500'
                      }`}></div>
                      <p className="font-medium text-white text-sm sm:text-base">{category}</p>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-300">{formatCurrency(amount)}</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                        'bg-gradient-to-r from-green-400 to-blue-500'
                      }`}
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {Math.round((amount / totalExpenses) * 100)}% of total
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saving Goals Progress */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Saving Goals Progress</h2>
        </div>
        
        {priorityGoals.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center bg-white/10 rounded-full p-4 mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">No saving goals yet</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Create goals to start saving automatically</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {priorityGoals.map(goal => (
              <div key={goal.id} className="bg-white/5 p-3 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="font-semibold mb-2 sm:mb-3 text-white text-base sm:text-lg">{goal.name}</h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-1">
                  {formatCurrency(goal.totalAvailable)} of {formatCurrency(goal.targetAmount)}
                </p>
                {availableBalance > 0 && (
                  <p className="text-xs text-emerald-400 mb-3 sm:mb-4">
                    (Includes {formatCurrency(availableBalance)} available)
                  </p>
                )}
                <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      goal.progress >= 75 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      goal.progress >= 50 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                      goal.progress >= 25 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-center">
                  <p className="text-xs text-gray-400">{Math.round(goal.progress)}% complete</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 
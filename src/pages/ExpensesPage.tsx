import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { Expense } from '../utils/types';

const ExpensesPage: React.FC = () => {
  const { expenses, budget, isLoading, addExpense, updateExpense, deleteExpense } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleAddClick = () => {
    setEditingExpense(undefined);
    setShowForm(true);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleSubmit = async (expenseData: Omit<Expense, 'id'> | Expense) => {
    if ('id' in expenseData) {
      await updateExpense(expenseData as Expense);
    } else {
      await addExpense(expenseData);
    }
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN'
    }).format(amount);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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

  return (
    <div className="space-y-6 sm:space-y-8 fade-in px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Expense Tracker
        </h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg btn-press"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Expense</span>
          </button>
        )}
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 hover:scale-105 transition-transform duration-300 card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Бюджет</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(budget)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 hover:scale-105 transition-transform duration-300 card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Всички разходи</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Form */}
      {showForm && (
        <div className="scale-in">
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Expense List */}
      <div className="slide-in">
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditClick}
          onDelete={deleteExpense}
        />
      </div>
    </div>
  );
};

export default ExpensesPage; 
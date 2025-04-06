import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { Expense } from '../utils/types';

const ExpensesPage: React.FC = () => {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useFinance();
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Expenses</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center border border-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <ExpenseList
        expenses={expenses}
        onEdit={handleEditClick}
        onDelete={deleteExpense}
      />
    </div>
  );
};

export default ExpensesPage; 
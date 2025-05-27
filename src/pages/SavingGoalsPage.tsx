import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import SavingGoalForm from '../components/SavingGoalForm';
import SavingGoalList from '../components/SavingGoalList';
import { SavingGoal } from '../utils/types';

const SavingGoalsPage: React.FC = () => {
  const { 
    savingGoals, 
    isLoading, 
    addSavingGoal, 
    updateSavingGoal, 
    deleteSavingGoal,
    getAvailableBalance
  } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | undefined>(undefined);

  const handleAddClick = () => {
    setEditingGoal(undefined);
    setShowForm(true);
  };

  const handleEditClick = (goal: SavingGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleSubmit = async (goalData: Omit<SavingGoal, 'id'> | SavingGoal) => {
    if ('id' in goalData) {
      await updateSavingGoal(goalData as SavingGoal);
    } else {
      await addSavingGoal(goalData);
    }
    setShowForm(false);
    setEditingGoal(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(undefined);
  };

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

  // Get available balance
  const availableBalance = getAvailableBalance();
  
  // Calculate basic metrics
  const totalTarget = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate progress percentage with available balance
  const calculateOverallProgress = () => {
    if (totalTarget === 0) return 0;
    
    const withAvailable = Math.min(totalTarget, totalCurrent + availableBalance);
    return Math.round((withAvailable / totalTarget) * 100);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Saving Goals</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Goal
        </button>
      </div>

      {/* Stats Overview */}
      {savingGoals.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Savings Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-sm font-medium text-gray-300 mb-1">Target Amount</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalTarget)}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-sm font-medium text-gray-300 mb-1">Available Funds</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCurrent + availableBalance)}</p>
              {availableBalance > 0 && (
                <p className="text-xs text-emerald-400 mt-1">
                  {formatCurrency(totalCurrent)} saved + {formatCurrency(availableBalance)} available
                </p>
              )}
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-sm font-medium text-gray-300 mb-1">Total Remaining</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(Math.max(0, totalTarget - (totalCurrent + availableBalance)))}
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-300">Overall Progress</p>
              <p className="text-sm font-semibold text-white">{overallProgress}%</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ease-out progress-bar ${
                  overallProgress >= 75 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  overallProgress >= 50 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                  overallProgress >= 25 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$0</span>
              <span>{formatCurrency(totalTarget)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showForm && (
        <div className="scale-in">
          <SavingGoalForm
            goal={editingGoal}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Goals List */}
      <div className="slide-in">
        <SavingGoalList
          savingGoals={savingGoals}
          onEdit={handleEditClick}
          onDelete={deleteSavingGoal}
        />
      </div>
    </div>
  );
};

export default SavingGoalsPage; 
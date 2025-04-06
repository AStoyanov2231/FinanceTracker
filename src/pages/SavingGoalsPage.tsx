import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import SavingGoalForm from '../components/SavingGoalForm';
import SavingGoalList from '../components/SavingGoalList';
import ContributionForm from '../components/ContributionForm';
import { SavingGoal } from '../utils/types';

const SavingGoalsPage: React.FC = () => {
  const { savingGoals, isLoading, addSavingGoal, updateSavingGoal, deleteSavingGoal, contributeToSavingGoal } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | undefined>(undefined);
  const [contributingGoal, setContributingGoal] = useState<SavingGoal | undefined>(undefined);

  const handleAddClick = () => {
    setEditingGoal(undefined);
    setShowForm(true);
    setShowContributionForm(false);
  };

  const handleEditClick = (goal: SavingGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
    setShowContributionForm(false);
  };

  const handleContributeClick = (goal: SavingGoal) => {
    setContributingGoal(goal);
    setShowContributionForm(true);
    setShowForm(false);
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

  const handleContribution = async (goalId: string, amount: number) => {
    await contributeToSavingGoal(goalId, amount);
    setShowContributionForm(false);
    setContributingGoal(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowContributionForm(false);
    setEditingGoal(undefined);
    setContributingGoal(undefined);
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

  // Calculate total progress
  const totalTarget = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgressPercent = totalTarget > 0 
    ? Math.round((totalCurrent / totalTarget) * 100) 
    : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Saving Goals</h1>
        {!showForm && !showContributionForm && (
          <button
            onClick={handleAddClick}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center border border-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Saving Goal
          </button>
        )}
      </div>

      {/* Summary Card */}
      {savingGoals.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Overall Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-800">
              <p className="text-sm font-medium text-indigo-300 mb-1">Target</p>
              <p className="text-2xl font-semibold text-gray-100">{formatCurrency(totalTarget)}</p>
            </div>
            <div className="bg-green-900/40 p-4 rounded-lg border border-green-800">
              <p className="text-sm font-medium text-green-300 mb-1">Current</p>
              <p className="text-2xl font-semibold text-gray-100">{formatCurrency(totalCurrent)}</p>
            </div>
            <div className="bg-blue-900/40 p-4 rounded-lg border border-blue-800">
              <p className="text-sm font-medium text-blue-300 mb-1">Remaining</p>
              <p className="text-2xl font-semibold text-gray-100">{formatCurrency(totalTarget - totalCurrent)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-300">Overall Progress</p>
              <p className="text-sm font-medium text-gray-300">{totalProgressPercent}%</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${totalProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <SavingGoalForm
          goal={editingGoal}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {showContributionForm && contributingGoal && (
        <ContributionForm
          goal={contributingGoal}
          onSubmit={handleContribution}
          onCancel={handleCancel}
        />
      )}

      <SavingGoalList
        savingGoals={savingGoals}
        onEdit={handleEditClick}
        onDelete={deleteSavingGoal}
        onContribute={handleContributeClick}
      />
    </div>
  );
};

export default SavingGoalsPage; 
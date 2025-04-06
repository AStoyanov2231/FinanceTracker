import React from 'react';
import { SavingGoal } from '../utils/types';

interface SavingGoalListProps {
  savingGoals: SavingGoal[];
  onEdit: (goal: SavingGoal) => void;
  onDelete: (id: string) => void;
  onContribute: (goal: SavingGoal) => void;
}

const SavingGoalList: React.FC<SavingGoalListProps> = ({ savingGoals, onEdit, onDelete, onContribute }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Sort goals by progress (least progress first)
  const sortedGoals = [...savingGoals].sort((a, b) => {
    const progressA = a.currentAmount / a.targetAmount;
    const progressB = b.currentAmount / b.targetAmount;
    return progressA - progressB;
  });

  return (
    <div className="bg-gray-800 shadow-md rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-lg font-medium text-gray-100">My Saving Goals</h2>
      </div>
      
      {sortedGoals.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center bg-indigo-900/40 rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-gray-300 mb-1">No saving goals found</p>
          <p className="text-sm text-gray-400">Add some goals to start saving</p>
        </div>
      ) : (
        <div className="p-5 space-y-6">
          {sortedGoals.map((goal) => {
            const progressPercent = calculateProgress(goal.currentAmount, goal.targetAmount);
            return (
              <div key={goal.id} className="bg-gray-700/50 p-5 rounded-xl border border-gray-600 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">{goal.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onContribute(goal)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded bg-green-900/60 text-green-300 hover:bg-green-900/80 transition-colors duration-150 border border-green-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Contribute
                    </button>
                    <button
                      onClick={() => onEdit(goal)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded bg-indigo-900/60 text-indigo-300 hover:bg-indigo-900/80 transition-colors duration-150 border border-indigo-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(goal.id)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded bg-red-900/60 text-red-300 hover:bg-red-900/80 transition-colors duration-150 border border-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-5">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Target amount</p>
                    <p className="text-lg font-medium text-gray-100">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Current amount</p>
                    <p className="text-lg font-medium text-gray-100">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
                    <p className="text-lg font-medium text-gray-100">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
                    <p className="text-lg font-medium text-gray-100">{formatDate(goal.deadline)}</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-300 mr-2">Progress</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        progressPercent >= 75 ? 'bg-green-900/60 text-green-300' :
                        progressPercent >= 50 ? 'bg-blue-900/60 text-blue-300' :
                        progressPercent >= 25 ? 'bg-yellow-900/60 text-yellow-300' :
                        'bg-red-900/60 text-red-300'
                      }`}>
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                        progressPercent >= 75 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        progressPercent >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        progressPercent >= 25 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingGoalList; 
import React from 'react';
import { SavingGoal } from '../utils/types';
import { useFinance } from '../contexts/FinanceContext';

interface SavingGoalListProps {
  savingGoals: SavingGoal[];
  onEdit: (goal: SavingGoal) => void;
  onDelete: (id: string) => void;
}

const SavingGoalList: React.FC<SavingGoalListProps> = ({ savingGoals, onEdit, onDelete }) => {
  const { getAvailableBalance, addExpense, updateSavingGoal } = useFinance();
  
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
  
  // Get the available balance to be shared across all goals
  const availableBalance = getAvailableBalance();

  // Handle buying/completing a goal
  const handleBuyGoal = async (goal: SavingGoal) => {
    try {
      // Create an expense with the goal's name and amount
      await addExpense({
        name: `Purchase: ${goal.name}`,
        amount: goal.currentAmount,
        category: 'Goal Purchase',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Update the goal to show it's been purchased (reset the current amount)
      await updateSavingGoal({
        ...goal,
        currentAmount: 0
      });
    } catch (error) {
      console.error('Failed to complete goal purchase:', error);
    }
  };

  // Sort goals by progress (least progress first)
  const sortedGoals = [...savingGoals].sort((a, b) => {
    const progressA = a.currentAmount / a.targetAmount;
    const progressB = b.currentAmount / b.targetAmount;
    return progressA - progressB;
  });

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">My Saving Goals</h2>
      </div>
      
      {sortedGoals.length === 0 ? (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center bg-indigo-900/40 rounded-full p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg mb-1">No saving goals found</p>
          <p className="text-sm text-gray-400">Add some goals to start saving</p>
        </div>
      ) : (
        <div className="p-5 space-y-6">
          {sortedGoals.map((goal) => {
            // The full available balance is shown for each goal
            const totalAvailable = goal.currentAmount + availableBalance;
            // Calculate the remaining amount needed
            const remaining = Math.max(0, goal.targetAmount - totalAvailable);
            // Calculate progress with the full available balance
            const progressPercent = calculateProgress(totalAvailable, goal.targetAmount);
            // Check if goal is fully funded
            const isFullyFunded = goal.currentAmount >= goal.targetAmount;
            
            const gradientColor = 
              progressPercent >= 75 ? 'from-green-500 to-emerald-400' :
              progressPercent >= 50 ? 'from-blue-500 to-indigo-400' :
              progressPercent >= 25 ? 'from-yellow-500 to-amber-400' :
              'from-red-500 to-pink-400';
              
            return (
              <div key={goal.id} className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] hover:border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">{goal.name}</h3>
                  <div className="flex space-x-2">
                    {isFullyFunded && (
                      <button
                        onClick={() => handleBuyGoal(goal)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 transition-colors duration-150 border border-emerald-500/40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Buy
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(goal)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 transition-colors duration-150 border border-indigo-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(goal.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-colors duration-150 border border-red-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Target amount</p>
                    <p className="text-2xl font-medium text-white">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Current amount</p>
                    <p className="text-2xl font-medium text-white">{formatCurrency(totalAvailable)}</p>
                    {availableBalance > 0 && (
                      <p className="text-xs text-emerald-400 mt-1">
                        (Includes {formatCurrency(availableBalance)} available)
                      </p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
                    <p className="text-2xl font-medium text-white">
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
                    <p className="text-2xl font-medium text-white">{formatDate(goal.deadline)}</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-300 mr-2">Progress</span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${gradientColor} bg-opacity-20 text-white shadow-inner`}>
                        {progressPercent}%
                      </span>
                    </div>
                    {isFullyFunded && (
                      <span className="text-sm font-medium text-emerald-400">
                        Ready to purchase!
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm shadow-inner">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${gradientColor}`}
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
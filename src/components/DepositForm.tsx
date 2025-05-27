import React, { useState } from 'react';

interface DepositFormProps {
  onSubmit: (amount: number) => Promise<void>;
  onCancel: () => void;
  currentBudget: number;
}

const DepositForm: React.FC<DepositFormProps> = ({ onSubmit, onCancel, currentBudget }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(parseFloat(amount));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mb-8">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-green-900/40 mr-3 border border-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-100">
          Deposit Money
        </h2>
      </div>
      
      <div className="bg-gray-700/50 p-4 rounded-lg mb-6 border border-gray-600">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Budget</p>
          <p className="text-lg font-medium text-gray-100">{formatCurrency(currentBudget)}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Deposit Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              min="0.01"
              step="0.01"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-3 sm:text-sm bg-gray-700 border-gray-600 rounded-md text-gray-100"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          {amount && parseFloat(amount) > 0 && (
            <p className="mt-2 text-sm text-green-400">
              New budget will be: {formatCurrency(currentBudget + parseFloat(amount))}
            </p>
          )}
          <p className="mt-4 text-sm text-gray-400">
            This amount will be added to your budget and automatically distributed to your saving goals based on their remaining amounts.
          </p>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
            className="py-2 px-4 border border-indigo-500 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-150"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : 'Deposit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm; 
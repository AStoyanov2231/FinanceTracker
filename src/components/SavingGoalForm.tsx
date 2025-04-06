import React, { useState, useEffect, Fragment } from 'react';
import { SavingGoal } from '../utils/types';
import { Dialog, Transition } from '@headlessui/react';

interface SavingGoalFormProps {
  goal?: SavingGoal;
  onSubmit: (goal: Omit<SavingGoal, 'id'> | SavingGoal) => void;
  onCancel: () => void;
}

const SavingGoalForm: React.FC<SavingGoalFormProps> = ({ goal, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // If editing an existing goal, populate the form
  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDeadline(goal.deadline || '');
      if (goal.deadline) {
        setTempDate(new Date(goal.deadline));
      }
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const targetAmountValue = parseFloat(targetAmount);
    if (isNaN(targetAmountValue) || targetAmountValue <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    const currentAmountValue = parseFloat(currentAmount);
    if (isNaN(currentAmountValue) || currentAmountValue < 0) {
      setError('Please enter a valid current amount');
      return;
    }

    if (currentAmountValue > targetAmountValue) {
      setError('Current amount cannot be greater than target amount');
      return;
    }

    const goalData = {
      name: name.trim(),
      targetAmount: targetAmountValue,
      currentAmount: currentAmountValue,
      deadline: deadline || undefined
    };

    // If editing, include the ID
    if (goal) {
      onSubmit({ ...goalData, id: goal.id });
    } else {
      onSubmit(goalData);
    }

    // Reset form if not editing
    if (!goal) {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
    }
  };

  const openCalendar = () => {
    setTempDate(deadline ? new Date(deadline) : new Date());
    setIsCalendarOpen(true);
  };

  const handleDateSelection = (newDate: Date) => {
    setTempDate(newDate);
  };

  const confirmDateSelection = () => {
    setDeadline(tempDate.toISOString().split('T')[0]);
    setIsCalendarOpen(false);
  };

  // Generate dates for calendar
  const generateCalendarDays = () => {
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    // Create array for calendar grid
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setTempDate(newDate);
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        {goal ? 'Edit Saving Goal' : 'Add New Saving Goal'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-2 bg-red-900/50 text-red-300 rounded-md border border-red-700">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
            placeholder="Goal name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-300">
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-300">
            Current Amount
          </label>
          <input
            type="number"
            id="currentAmount"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
            Deadline (Optional)
          </label>
          <button
            type="button"
            onClick={openCalendar}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 text-left"
          >
            {deadline ? new Date(deadline).toLocaleDateString() : 'Select deadline'}
          </button>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            {goal ? 'Update' : 'Add Goal'}
          </button>
        </div>
      </form>

      {/* Calendar Modal */}
      <Transition appear show={isCalendarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsCalendarOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md transition-all duration-300" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800/95 backdrop-blur-sm border border-gray-700 p-6 shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-100">
                    Select Deadline
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => changeMonth(-1)}
                        className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="text-gray-100 font-medium">
                        {monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}
                      </div>
                      <button 
                        onClick={() => changeMonth(1)}
                        className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="text-center text-sm text-gray-400 py-1">{day}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={day === null}
                          onClick={() => day && handleDateSelection(day)}
                          className={`
                            p-2 rounded-lg text-sm
                            ${day === null ? 'invisible' : 'hover:bg-gray-700'}
                            ${day && day.getDate() === tempDate.getDate() && 
                               day.getMonth() === tempDate.getMonth() && 
                               day.getFullYear() === tempDate.getFullYear()
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-300'}
                          `}
                        >
                          {day?.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-150"
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-indigo-500 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
                      onClick={confirmDateSelection}
                    >
                      Select
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SavingGoalForm; 
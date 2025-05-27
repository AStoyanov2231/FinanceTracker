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
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // If editing an existing goal, populate the form
  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
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

    const goalData = {
      name: name.trim(),
      targetAmount: targetAmountValue,
      currentAmount: goal?.currentAmount || 0, // Keep existing amount or start at 0
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
      setDeadline('');
    }
  };

  const openCalendar = () => {
    setTempDate(deadline ? new Date(deadline) : new Date());
    setIsCalendarOpen(true);
  };

  const handleDateSelection = (newDate: Date) => {
    // Create a new date to avoid reference issues
    const selectedDate = new Date(newDate);
    // Set the hours to 12 to avoid any timezone issues
    selectedDate.setHours(12, 0, 0, 0);
    setTempDate(selectedDate);
  };

  const confirmDateSelection = () => {
    // Create a new date with the time zone offset to ensure correct date selection
    const correctedDate = new Date(tempDate);
    // Set the hours to 12 to avoid any timezone issues
    correctedDate.setHours(12, 0, 0, 0);
    setDeadline(correctedDate.toISOString().split('T')[0]);
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
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {goal ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {goal ? 'Edit Saving Goal' : 'Create New Goal'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter goal name..."
            required
          />
        </div>
        
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-300 mb-2">
            Target Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">лв</span>
            </div>
            <input
              type="number"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
            Deadline (Optional)
          </label>
          <button
            type="button"
            onClick={openCalendar}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <div className="flex items-center justify-between">
              <span className={deadline ? 'text-white' : 'text-gray-400'}>
                {deadline ? new Date(deadline).toLocaleDateString() : 'Select deadline'}
              </span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </button>
        </div>

        {goal && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-300">
              Current Progress: <span className="font-semibold text-white">${goal.currentAmount.toFixed(2)}</span> of <span className="font-semibold text-white">${goal.targetAmount.toFixed(2)}</span>
            </p>
            <div className="mt-2 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
                style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {goal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>

      {/* Calendar Modal */}
      <Transition appear show={isCalendarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsCalendarOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 shadow-2xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-white mb-4">
                    Select Deadline
                  </Dialog.Title>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => changeMonth(-1)}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="text-white font-medium">
                        {monthNames[tempDate.getMonth()]} {tempDate.getFullYear()}
                      </div>
                      <button 
                        onClick={() => changeMonth(1)}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
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
                            p-2 rounded-lg text-sm transition-all
                            ${day === null ? 'invisible' : 'hover:bg-white/10'}
                            ${day && day.getDate() === tempDate.getDate() && 
                               day.getMonth() === tempDate.getMonth() && 
                               day.getFullYear() === tempDate.getFullYear()
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'text-gray-300 hover:text-white'}
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
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all duration-300"
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg"
                      onClick={confirmDateSelection}
                    >
                      Select Date
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
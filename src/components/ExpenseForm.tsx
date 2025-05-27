import React, { useState, useEffect, Fragment } from 'react';
import { Expense } from '../utils/types';
import { Dialog, Transition } from '@headlessui/react';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  onCancel: () => void;
}

const categories = [
  'Food', 
  'Transport',
  'Housing',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other'
];

const categoryIcons: Record<string, React.ReactElement> = {
  'Food': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
  'Transport': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />,
  'Housing': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  'Entertainment': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />,
  'Utilities': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  'Healthcare': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  'Shopping': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
  'Other': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // If editing an existing expense, populate the form
  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(expense.date);
      setTempDate(new Date(expense.date));
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const expenseData = {
      name: name.trim(),
      amount: amountValue,
      category,
      date
    };

    // If editing, include the ID
    if (expense) {
      onSubmit({ ...expenseData, id: expense.id });
    } else {
      onSubmit(expenseData);
    }

    // Reset form if not editing
    if (!expense) {
      setName('');
      setAmount('');
      setCategory(categories[0]);
      setDate(new Date().toISOString().split('T')[0]);
      setTempDate(new Date());
    }
  };

  const openCalendar = () => {
    setTempDate(date ? new Date(date) : new Date());
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
    setDate(correctedDate.toISOString().split('T')[0]);
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
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {expense ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {expense ? 'Edit Expense' : 'Add New Expense'}
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
            Expense Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Enter expense name..."
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">лв</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  category === cat
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 border-transparent text-white shadow-lg transform scale-105'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {categoryIcons[cat] || categoryIcons['Other']}
                </svg>
                <span className="text-xs">{cat}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
            Date
          </label>
          <button
            type="button"
            onClick={openCalendar}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <div className="flex items-center justify-between">
              <span>{date ? new Date(date).toLocaleDateString() : 'Select date'}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </button>
        </div>
        
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
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {expense ? 'Update Expense' : 'Add Expense'}
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
                    Select Date
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
                              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
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
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg"
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

export default ExpenseForm; 
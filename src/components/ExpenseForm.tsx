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
    setTempDate(newDate);
  };

  const confirmDateSelection = () => {
    setDate(tempDate.toISOString().split('T')[0]);
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
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mb-8">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-indigo-900/40 mr-3 border border-indigo-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {expense ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-100">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 p-3 bg-red-900/40 text-red-300 rounded-lg border border-red-800">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
            placeholder="Expense name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-700 text-gray-100">
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
            Date
          </label>
          <button
            type="button"
            onClick={openCalendar}
            className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 text-left"
          >
            {date ? new Date(date).toLocaleDateString() : 'Select date'}
          </button>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-indigo-500 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            {expense ? 'Update' : 'Add Expense'}
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
                    Select Date
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

export default ExpenseForm; 
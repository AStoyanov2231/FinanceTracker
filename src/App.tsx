import { useState } from 'react'
import { FinanceProvider } from './contexts/FinanceContext'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ExpensesPage from './pages/ExpensesPage'
import SavingGoalsPage from './pages/SavingGoalsPage'

function App() {
  const [activePage, setActivePage] = useState<string>('dashboard')

  // Render the active page based on the current selection
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />
      case 'expenses':
        return <ExpensesPage />
      case 'goals':
        return <SavingGoalsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <FinanceProvider>
      <Layout>
        <div className="relative">
          {/* Navigation */}
          <div className="mb-8 bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActivePage('dashboard')}
                className={`py-2 px-3 rounded-lg transition-all duration-200 font-medium ${
                  activePage === 'dashboard'
                    ? 'bg-indigo-900/60 text-indigo-300'
                    : 'text-gray-300 hover:text-indigo-300 hover:bg-indigo-900/40'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActivePage('expenses')}
                className={`py-2 px-3 rounded-lg transition-all duration-200 font-medium ${
                  activePage === 'expenses'
                    ? 'bg-indigo-900/60 text-indigo-300'
                    : 'text-gray-300 hover:text-indigo-300 hover:bg-indigo-900/40'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActivePage('goals')}
                className={`py-2 px-3 rounded-lg transition-all duration-200 font-medium ${
                  activePage === 'goals'
                    ? 'bg-indigo-900/60 text-indigo-300'
                    : 'text-gray-300 hover:text-indigo-300 hover:bg-indigo-900/40'
                }`}
              >
                Saving Goals
              </button>
            </nav>
          </div>

          {/* Content */}
          {renderPage()}
        </div>
      </Layout>
    </FinanceProvider>
  )
}

export default App

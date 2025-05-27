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

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    { 
      id: 'expenses', 
      label: 'Expenses', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'goals', 
      label: 'Saving Goals', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  return (
    <FinanceProvider>
      <Layout>
        <div className="relative">
          {/* Modern Navigation */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-2 sm:p-3">
              <nav className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start gap-3 sm:space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center justify-center sm:justify-start space-x-3 px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all duration-300 font-medium min-w-0 flex-1 sm:flex-auto ${
                      activePage === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="inline sm:hidden text-xs">{
                      item.id === 'dashboard' ? 'Dash' : 
                      item.id === 'expenses' ? 'Exp' : 
                      'Goals'
                    }</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="transition-all duration-500 ease-in-out">
            {renderPage()}
          </div>
        </div>
      </Layout>
    </FinanceProvider>
  )
}

export default App

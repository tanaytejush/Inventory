import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { AppRoutes } from './routes'

function App() {
  const { checkAuth, isAuthenticated } = useAuth()
  const location = useLocation()

  const isAuthPage = location.pathname === '/auth'

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isAuthPage) {
    return <AppRoutes />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <AppRoutes />
              </div>
            </main>
          </div>
        </>
      )}
      {!isAuthenticated && <AppRoutes />}
    </div>
  )
}

export default App

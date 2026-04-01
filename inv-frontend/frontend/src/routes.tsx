import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { ProductsPage } from './pages/Products/ProductsPage'
import { SalesPage } from './pages/Sales/SalesPage'
import { ReceiptPage } from './pages/Sales/Receipt'
import { SuppliersPage } from './pages/Suppliers/SuppliersPage'
import { NewPurchase } from './pages/Purchases/NewPurchase'
import { ReportsPage } from './pages/Reports/ReportsPage'
import { NotFound } from './pages/NotFound'
import { useLowStockProducts } from './hooks/useProducts'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function LowStockPage() {
  const { data: products = [], isLoading } = useLowStockProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Low Stock Products</h1>
        <p className="mt-1 text-sm text-gray-600">
          Products that are running low on stock
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No low stock products found
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-orange-600 font-medium">
            {products.length} product(s) are running low on stock
          </p>
        </div>
      )}
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/low-stock"
        element={
          <ProtectedRoute>
            <LowStockPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <SalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales/receipt"
        element={
          <ProtectedRoute>
            <ReceiptPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <SuppliersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchases/new"
        element={
          <ProtectedRoute>
            <NewPurchase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

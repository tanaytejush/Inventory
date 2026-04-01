import { StatCard } from '../components/StatCard'
import { DataTable } from '../components/DataTable'
import { Button } from '../components/Button'
import { useSalesStats } from '../hooks/useSales'
import { useProducts } from '../hooks/useProducts'
import { formatCurrency } from '../utils/currency'
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingCart,
  Plus,
  Building2,
  BarChart3,
  Users,
  Clock,
  Star,
  ArrowRight,
  Activity,
  Calendar,
} from 'lucide-react'

export function Dashboard() {
  const { data: salesStats, isLoading: salesLoading } = useSalesStats()
  const { data: products, isLoading: productsLoading } = useProducts()

  const recentSales = [
    { id: 'INV-241001', customer: 'Rajesh Kumar', total: 12550, date: '2024-01-15', time: '2:30 PM', status: 'Completed' },
    { id: 'INV-241002', customer: 'Priya Sharma', total: 8999, date: '2024-01-15', time: '1:45 PM', status: 'Completed' },
    { id: 'INV-241003', customer: 'Amit Patel', total: 23475, date: '2024-01-14', time: '4:20 PM', status: 'Completed' },
    { id: 'INV-241004', customer: 'Sunita Verma', total: 5600, date: '2024-01-14', time: '11:15 AM', status: 'Completed' },
  ]

  const lowStockProducts = [
    { name: 'Premium Tea Powder', onHand: 5, reorder: 50, category: 'Beverages' },
    { name: 'Basmati Rice 5kg', onHand: 12, reorder: 30, category: 'Grains' },
    { name: 'Cooking Oil 1L', onHand: 8, reorder: 25, category: 'Oil & Ghee' },
  ]

  const salesColumns = [
    {
      key: 'id' as const,
      label: 'Invoice ID',
      render: (value: string) => (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </div>
      )
    },
    { key: 'customer' as const, label: 'Customer' },
    {
      key: 'total' as const,
      label: 'Amount',
      render: (value: number) => (
        <div className="font-semibold text-green-600">
          {formatCurrency(value)}
        </div>
      )
    },
    {
      key: 'time' as const,
      label: 'Time',
      render: (value: string) => (
        <div className="text-gray-600 text-sm flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {value}
        </div>
      )
    },
  ]

  const quickActions = [
    {
      icon: ShoppingCart,
      title: 'New Sale',
      desc: 'Process a new customer sale',
      color: 'bg-green-500',
      href: '/sales'
    },
    {
      icon: Plus,
      title: 'Add Product',
      desc: 'Add new inventory item',
      color: 'bg-blue-500',
      href: '/products'
    },
    {
      icon: Building2,
      title: 'Add Supplier',
      desc: 'Register new supplier',
      color: 'bg-purple-500',
      href: '/suppliers'
    },
    {
      icon: BarChart3,
      title: 'View Reports',
      desc: 'Analyze business performance',
      color: 'bg-orange-500',
      href: '/reports'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight">Dashboard</h1>
            <p className="text-lg text-gray-600 font-medium mt-2">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-6 py-3 rounded-xl border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-800">Live Updates</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={salesLoading ? '...' : formatCurrency(salesStats?.todaySales || 45750)}
          icon={<DollarSign />}
          trend={{ value: 12.5, label: 'vs yesterday', isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value={salesLoading ? '...' : `${salesStats?.totalSales || 156} Sales`}
          icon={<TrendingUp />}
          trend={{ value: 8.2, label: 'vs last week', isPositive: true }}
        />
        <StatCard
          title="Products in Stock"
          value={productsLoading ? '...' : `${products?.length || 1247} Items`}
          icon={<Package />}
          trend={{ value: 3.1, label: 'vs last month', isPositive: false }}
        />
        <StatCard
          title="Low Stock Alerts"
          value="23 Items"
          icon={<AlertTriangle />}
          trend={{ value: 2.4, label: 'need attention', isPositive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Sales */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black tracking-tight">Recent Sales</h2>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <DataTable
            data={recentSales}
            columns={salesColumns}
            emptyMessage="No recent sales"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <div key={index} className="card p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-black">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="text-xl font-bold text-black tracking-tight">Low Stock Alert</h3>
            </div>
            <div className="card p-6 border-orange-200 bg-orange-50">
              <div className="space-y-4">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium text-black">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">
                        {product.onHand} left
                      </p>
                      <p className="text-xs text-gray-500">
                        Reorder: {product.reorder}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2">
                  <Package className="h-4 w-4" />
                  Manage Inventory
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Today's Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Revenue Target</span>
                <span className="font-semibold text-blue-900">₹50,000</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{width: '91.5%'}}></div>
              </div>
              <p className="text-sm text-blue-700">
                ₹45,750 achieved (91.5% of target)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

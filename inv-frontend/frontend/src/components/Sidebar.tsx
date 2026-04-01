import { NavLink } from 'react-router-dom'
import { cn } from '../lib/ui'
import {
  BarChart3,
  Package,
  AlertTriangle,
  DollarSign,
  Building2,
  ShoppingCart,
  TrendingUp,
  Store,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react'

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, badge: null },
  { name: 'Products', href: '/products', icon: Package, badge: '1.2K' },
  { name: 'Low Stock', href: '/products/low-stock', icon: AlertTriangle, badge: '23' },
  { name: 'Sales', href: '/sales', icon: DollarSign, badge: null },
  { name: 'Suppliers', href: '/suppliers', icon: Building2, badge: null },
  { name: 'New Purchase', href: '/purchases/new', icon: ShoppingCart, badge: null },
  { name: 'Reports', href: '/reports', icon: TrendingUp, badge: null },
]

const secondaryNavigation = [
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-72 bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-gray-800">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Store className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Inventory Pro</h2>
            <p className="text-xs text-gray-400">Business Suite</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
          {mainNavigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative',
                    isActive
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <div className="flex items-center">
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="ml-auto bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded-lg">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-8 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            More
          </p>
          {secondaryNavigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:bg-white/10 hover:text-gray-300'
                  )
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Upgrade to Pro</p>
              <p className="text-xs text-blue-100">Get advanced analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
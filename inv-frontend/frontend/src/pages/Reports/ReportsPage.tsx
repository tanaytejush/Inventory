import { useState } from 'react'
import { StatCard } from '../../components/StatCard'
import { DataTable } from '../../components/DataTable'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Button } from '../../components/Button'
import { useInventoryReport, useSalesReport, useProfitReport } from '../../hooks/useReports'

export function ReportsPage() {
  const [reportType, setReportType] = useState('inventory')
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  })

  const { data: inventoryData, isLoading: inventoryLoading } = useInventoryReport()
  const { data: salesData, isLoading: salesLoading } = useSalesReport(dateRange)
  const { data: profitData, isLoading: profitLoading } = useProfitReport(dateRange)

  const reportOptions = [
    { value: 'inventory', label: 'Inventory Report' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'profit', label: 'Profit Report' },
  ]

  const renderInventoryReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={inventoryLoading ? '...' : inventoryData?.totalProducts || 0}
          icon="📦"
        />
        <StatCard
          title="Total Value"
          value={inventoryLoading ? '...' : `$${inventoryData?.totalValue || 0}`}
          icon="💰"
        />
        <StatCard
          title="Low Stock Items"
          value={inventoryLoading ? '...' : inventoryData?.lowStockItems || 0}
          icon="⚠️"
        />
        <StatCard
          title="Out of Stock"
          value={inventoryLoading ? '...' : inventoryData?.outOfStockItems || 0}
          icon="❌"
        />
      </div>
    </div>
  )

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Sales"
          value={salesLoading ? '...' : salesData?.totalSales || 0}
          icon="🛒"
        />
        <StatCard
          title="Total Revenue"
          value={salesLoading ? '...' : `$${salesData?.totalRevenue || 0}`}
          icon="💰"
        />
        <StatCard
          title="Average Order Value"
          value={salesLoading ? '...' : `$${salesData?.averageOrderValue || 0}`}
          icon="📊"
        />
      </div>
    </div>
  )

  const renderProfitReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={profitLoading ? '...' : `$${profitData?.totalRevenue || 0}`}
          icon="💰"
        />
        <StatCard
          title="Total Cost"
          value={profitLoading ? '...' : `$${profitData?.totalCost || 0}`}
          icon="💸"
        />
        <StatCard
          title="Gross Profit"
          value={profitLoading ? '...' : `$${profitData?.grossProfit || 0}`}
          icon="📈"
        />
        <StatCard
          title="Profit Margin"
          value={profitLoading ? '...' : `${profitData?.profitMargin || 0}%`}
          icon="📊"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          View detailed reports and analytics
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Select
            label="Report Type"
            options={reportOptions}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          />
          {reportType !== 'inventory' && (
            <>
              <Input
                label="From Date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
              <Input
                label="To Date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </>
          )}
        </div>
      </div>

      {reportType === 'inventory' && renderInventoryReport()}
      {reportType === 'sales' && renderSalesReport()}
      {reportType === 'profit' && renderProfitReport()}
    </div>
  )
}
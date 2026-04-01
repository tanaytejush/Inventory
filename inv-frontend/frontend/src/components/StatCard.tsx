import { ReactNode } from 'react'
import { cn } from '../lib/ui'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('card p-8', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="form-label mb-3">{title}</p>
          <p className="text-3xl font-bold text-black tracking-tight mb-3">{value}</p>
          {trend && (
            <div className="flex items-center">
              <span
                className={cn(
                  'text-sm font-bold px-2 py-1 rounded-lg',
                  trend.isPositive
                    ? 'text-black bg-gray-100'
                    : 'text-red-600 bg-red-50'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-600 ml-2 font-medium">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="h-16 w-16 bg-black rounded-2xl flex items-center justify-center ml-6">
            <div className="h-8 w-8 text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
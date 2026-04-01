import { ReactNode } from 'react'
import { cn } from '../lib/ui'

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

interface Column<T> {
  key: keyof T | 'actions'
  label: string
  render?: (value: any, item: T) => ReactNode
  className?: string
  sortable?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
  className
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="card p-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    )
  }

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-black">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider',
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="text-lg font-medium">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    'transition-colors hover:bg-gray-50',
                    index % 2 === 1 && 'bg-gray-50'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        'px-6 py-4 text-sm font-medium text-black',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
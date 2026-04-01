import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export const useDailySalesReport = (fromDate?: string, toDate?: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['reports', 'daily-sales', user?.shopId, fromDate, toDate],
    queryFn: async () => {
      if (!user?.shopId) return []

      let query = supabase
        .from('sales_daily_v')
        .select('*')
        .eq('shop_id', user.shopId)
        .order('sale_date', { ascending: false })

      if (fromDate) {
        query = query.gte('sale_date', fromDate)
      }
      if (toDate) {
        query = query.lte('sale_date', toDate)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!user?.shopId,
  })
}

export const useStockValuationReport = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['reports', 'stock-valuation', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []

      const { data, error } = await supabase
        .from('stock_valuation_v')
        .select('*')
        .eq('shop_id', user.shopId)
        .order('total_value', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user?.shopId,
  })
}

export const useLowStockReport = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['reports', 'low-stock', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []

      const { data, error } = await supabase
        .from('low_stock_v')
        .select('*')
        .eq('shop_id', user.shopId)
        .order('stock_quantity', { ascending: true })

      if (error) throw error
      return data
    },
    enabled: !!user?.shopId,
  })
}

export const useSalesAnalytics = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['reports', 'sales-analytics', user?.shopId, period],
    queryFn: async () => {
      if (!user?.shopId) return null

      const now = new Date()
      let fromDate: string

      switch (period) {
        case 'day':
          fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
          break
        case 'week':
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
          break
        case 'month':
          fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
          break
        case 'year':
          fromDate = new Date(now.getFullYear(), 0, 1).toISOString()
          break
      }

      const { data, error } = await supabase
        .rpc('rpc_get_sales_stats', {
          shop_id: user.shopId,
          from_date: fromDate,
          to_date: now.toISOString()
        })

      if (error) throw error
      return data
    },
    enabled: !!user?.shopId,
  })
}

// Legacy compatibility exports
export const useInventoryReport = useStockValuationReport
export const useSalesReport = (dateRange: { from: string; to: string }) => {
  return useDailySalesReport(dateRange.from, dateRange.to)
}
export const useProfitReport = (dateRange: { from: string; to: string }) => {
  return useSalesAnalytics('month')
}
export const useSupplierReport = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['reports', 'suppliers', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('shop_id', user.shopId)

      if (error) throw error
      return data
    },
    enabled: !!user?.shopId,
  })
}
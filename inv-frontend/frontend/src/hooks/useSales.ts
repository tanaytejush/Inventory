import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuth } from './useAuth'

export const useSales = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['sales', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []
      return await api.getSales(user.shopId)
    },
    enabled: !!user?.shopId,
  })
}

export const useSale = (id: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['sales', user?.shopId, id],
    queryFn: async () => {
      if (!user?.shopId) return null
      const sales = await api.getSales(user.shopId)
      return sales.find(sale => sale.id === id) || null
    },
    enabled: !!id && !!user?.shopId,
  })
}

interface CreateSaleItemInput {
  productId: string
  qty: number
  price: number
  taxRate: number
  subtotal: number
}

interface CreateSalePayload {
  items: CreateSaleItemInput[]
  billDiscount: number
}

export const useCreateSale = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ items, billDiscount }: CreateSalePayload) => {
      if (!user?.shopId) throw new Error('No shop ID available')
      if (items.length === 0) throw new Error('Cart is empty')

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
      const tax = items.reduce((sum, item) => sum + item.subtotal * (item.taxRate / 100), 0)
      const total = subtotal + tax - billDiscount

      const saleData = {
        shop_id: user.shopId,
        total_amount: total,
        tax_amount: tax,
        discount_amount: billDiscount,
        payment_method: 'CASH',
      }

      const saleItems = items.map((item) => ({
        product_id: item.productId,
        quantity: item.qty,
        unit_price: item.price,
        tax_rate: item.taxRate,
        total_price: item.subtotal,
      }))

      return await api.createSale(saleData, saleItems)
    },
    onSuccess: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['sales', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['sales-stats', user.shopId] })
    },
  })
}

export const useSalesStats = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['sales-stats', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return null
      return await api.getSalesStats(user.shopId)
    },
    enabled: !!user?.shopId,
  })
}

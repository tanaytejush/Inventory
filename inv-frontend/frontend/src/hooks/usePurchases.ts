import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuth } from './useAuth'
import type { Purchase } from '../types'

interface PurchaseLineInput {
  productId: string
  qty: number
  unitCost: number
  taxRate: number
}

interface CreatePurchasePayload {
  supplierId: string
  items: PurchaseLineInput[]
  invoiceNumber?: string
}

export const usePurchases = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['purchases', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []
      return await api.getPurchases(user.shopId)
    },
    enabled: !!user?.shopId,
  })
}

export const usePurchase = (id: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['purchases', user?.shopId, id],
    queryFn: async () => {
      if (!user?.shopId) return null
      const purchases = await api.getPurchases(user.shopId)
      return purchases.find(purchase => purchase.id === id) || null
    },
    enabled: !!id && !!user?.shopId,
  })
}

export const useCreatePurchase = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<string, Error, CreatePurchasePayload>({
    mutationFn: async ({ supplierId, items, invoiceNumber }: CreatePurchasePayload) => {
      if (!user?.shopId) throw new Error('No shop ID available')
      if (items.length === 0) throw new Error('Add at least one product')

      const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitCost, 0)
      const taxTotal = items.reduce((sum, item) => sum + item.qty * item.unitCost * (item.taxRate / 100), 0)
      const discountTotal = 0
      const grandTotal = subtotal + taxTotal - discountTotal

      const purchaseData = {
        shop_id: user.shopId,
        supplier_id: supplierId,
        invoice_number: invoiceNumber ?? `PO-${Date.now()}`,
        purchase_date: new Date().toISOString(),
        total_amount: grandTotal,
        tax_amount: taxTotal,
        discount_amount: discountTotal,
        status: 'PENDING',
      }

      const purchaseItems = items.map((item) => ({
        product_id: item.productId,
        quantity: item.qty,
        unit_price: item.unitCost,
        total_price: item.qty * item.unitCost,
      }))

      return await api.createPurchase(purchaseData, purchaseItems)
    },
    onSuccess: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['purchases', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.shopId] })
    },
  })
}

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<Purchase, Error, Partial<Purchase> & { id: string }>({
    mutationFn: async ({ id, ...purchaseData }: Partial<Purchase> & { id: string }) => {
      return await api.updatePurchase(id, purchaseData)
    },
    onSuccess: (data) => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['purchases', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['purchases', user.shopId, data.id] })
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
    },
  })
}

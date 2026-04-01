import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuth } from './useAuth'
import type { Product } from '../types'

export const useProducts = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['products', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []
      return await api.getProducts(user.shopId)
    },
    enabled: !!user?.shopId,
  })
}

export const useLowStockProducts = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['products', 'low-stock', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []
      return await api.getLowStockProducts(user.shopId)
    },
    enabled: !!user?.shopId,
  })
}

export const useProduct = (id: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['products', user?.shopId, id],
    queryFn: async () => {
      if (!user?.shopId) return null
      const products = await api.getProducts(user.shopId)
      return products.find(product => product.id === id) || null
    },
    enabled: !!id && !!user?.shopId,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.shopId) throw new Error('No shop ID available')
      return await api.createProduct({
        ...productData,
        shopId: user.shopId,
        isActive: productData.isActive ?? true,
      })
    },
    onSuccess: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock', user.shopId] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...productData }: Partial<Product> & { id: string }) => {
      return await api.updateProduct(id, productData)
    },
    onSuccess: (data) => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId, data.id] })
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock', user.shopId] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.deleteProduct(id)
      return id
    },
    onSuccess: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock', user.shopId] })
    },
  })
}

export const useAdjustStock = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ productId, quantityChange, reason = 'manual' }: { productId: string; quantityChange: number; reason?: string }) => {
      return await api.adjustStock(productId, quantityChange, reason)
    },
    onMutate: async ({ productId, quantityChange }) => {
      if (!user?.shopId) return undefined

      await queryClient.cancelQueries({ queryKey: ['products', user.shopId] })

      const previousProducts = queryClient.getQueryData<Product[]>(['products', user.shopId])

      if (previousProducts) {
        const nextProducts = previousProducts.map(product =>
          product.id === productId
            ? {
                ...product,
                onHand: Math.max(product.onHand + quantityChange, 0),
              }
            : product
        )
        queryClient.setQueryData(['products', user.shopId], nextProducts)
      }

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (!user?.shopId) return
      if (context?.previousProducts) {
        queryClient.setQueryData(['products', user.shopId], context.previousProducts)
      }
    },
    onSettled: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['products', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock', user.shopId] })
    },
  })
}

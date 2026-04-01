import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuth } from './useAuth'
import type { Supplier } from '../types'

export const useSuppliers = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['suppliers', user?.shopId],
    queryFn: async () => {
      if (!user?.shopId) return []
      return await api.getSuppliers(user.shopId)
    },
    enabled: !!user?.shopId,
  })
}

export const useSupplier = (id: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['suppliers', user?.shopId, id],
    queryFn: async () => {
      if (!user?.shopId) return null
      const suppliers = await api.getSuppliers(user.shopId)
      return suppliers.find(supplier => supplier.id === id) || null
    },
    enabled: !!id && !!user?.shopId,
  })
}

export const useCreateSupplier = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.shopId) throw new Error('No shop ID available')
      return await api.createSupplier({ ...supplierData, shopId: user.shopId })
    },
    onSuccess: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.shopId] })
    },
  })
}

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...supplierData }: Partial<Supplier> & { id: string }) => {
      return await api.updateSupplier(id, supplierData)
    },
    onSuccess: (data) => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.shopId] })
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.shopId, data.id] })
    },
  })
}

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.deleteSupplier(id)
      return id
    },
    onSuccess: () => {
      if (!user?.shopId) return
      queryClient.invalidateQueries({ queryKey: ['suppliers', user.shopId] })
    },
  })
}

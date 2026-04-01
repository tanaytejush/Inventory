import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogActions } from '../../components/Dialog'
import { Form, FormField, FormRow } from '../../components/Form'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Button } from '../../components/Button'
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts'
import { generateSku } from '../../utils/id'
import type { Product, Unit } from '../../types'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  sellPrice: z.number().min(0, 'Sell price must be zero or greater'),
  costPrice: z.number().min(0, 'Cost price must be zero or greater'),
  taxRate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(28, 'Tax rate cannot exceed 28%'),
  reorderLevel: z.number().min(0, 'Reorder level must be zero or greater'),
  onHand: z.number().min(0, 'Initial stock must be zero or greater').optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product | null
  open: boolean
  onClose: () => void
}

const unitOptions: Unit[] = ['pcs', 'kg', 'gm', 'ltr', 'ml', 'box', 'pack']

export function ProductForm({ product, open, onClose }: ProductFormProps) {
  const isEditing = Boolean(product)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      description: product?.description ?? '',
      category: product?.category ?? '',
      unit: product?.unit ?? 'pcs',
      sellPrice: product?.sellPrice ?? 0,
      costPrice: product?.costPrice ?? 0,
      taxRate: product?.taxRate ?? 18,
      reorderLevel: product?.reorderLevel ?? 10,
      onHand: product?.onHand ?? 0,
    },
  })

  const watchName = watch('name')
  const watchSku = watch('sku')

  useEffect(() => {
    if (!isEditing && watchName && (!watchSku || watchSku.trim().length === 0)) {
      setValue('sku', generateSku(watchName), { shouldDirty: false })
    }
  }, [isEditing, setValue, watchName, watchSku])

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku ?? '',
        description: product.description ?? '',
        category: product.category ?? '',
        unit: product.unit,
        sellPrice: product.sellPrice,
        costPrice: product.costPrice,
        taxRate: product.taxRate,
        reorderLevel: product.reorderLevel,
        onHand: product.onHand,
      })
    } else {
      reset({
        name: '',
        sku: '',
        description: '',
        category: '',
        unit: 'pcs',
        sellPrice: 0,
        costPrice: 0,
        taxRate: 18,
        reorderLevel: 10,
        onHand: 0,
      })
    }
  }, [product, reset])

  const onSubmit = async (values: ProductFormValues) => {
    const category = values.category?.trim()

    const payload = {
      name: values.name,
      sku: values.sku && values.sku.trim().length > 0 ? values.sku : generateSku(values.name),
      description: values.description?.trim() || null,
      category: category || product?.category || 'General',
      unit: values.unit as Unit,
      sellPrice: values.sellPrice,
      costPrice: values.costPrice,
      taxRate: values.taxRate,
      reorderLevel: values.reorderLevel,
      onHand: values.onHand ?? product?.onHand ?? 0,
      isActive: product?.isActive ?? true,
      shopId: '',
      barcode: product?.barcode ?? null,
    }

    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({ id: product.id, ...payload })
      } else {
        await createProduct.mutateAsync(payload)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save product', error)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const disableSubmit = isSubmitting || createProduct.isPending || updateProduct.isPending

  return (
    <Dialog open={open} onClose={handleClose} title={isEditing ? 'Edit Product' : 'New Product'} className="max-w-2xl">
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField>
            <Input
              label="Name"
              placeholder="Product name"
              {...register('name')}
              error={errors.name?.message}
              autoFocus
            />
          </FormField>

          <FormRow>
            <Input
              label="SKU"
              placeholder="Auto-generated"
              {...register('sku')}
              error={errors.sku?.message}
            />
            <Select
              label="Unit"
              placeholder="Select unit"
              options={unitOptions.map(unit => ({ value: unit, label: unit.toUpperCase() }))}
              error={errors.unit?.message}
              {...register('unit')}
            />
          </FormRow>

          <FormRow>
            <Input
              label="Sell Price"
              type="number"
              step="0.01"
              {...register('sellPrice', { valueAsNumber: true })}
              error={errors.sellPrice?.message}
            />
            <Input
              label="Cost Price"
              type="number"
              step="0.01"
              {...register('costPrice', { valueAsNumber: true })}
              error={errors.costPrice?.message}
            />
          </FormRow>

          <FormRow>
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              min="0"
              max="28"
              {...register('taxRate', { valueAsNumber: true })}
              error={errors.taxRate?.message}
            />
            <Input
              label="Reorder Level"
              type="number"
              min="0"
              {...register('reorderLevel', { valueAsNumber: true })}
              error={errors.reorderLevel?.message}
            />
          </FormRow>

          <FormRow>
            <Input
              label={isEditing ? 'Current Stock' : 'Initial Stock'}
              type="number"
              min="0"
              {...register('onHand', { valueAsNumber: true })}
              error={errors.onHand?.message}
              readOnly={isEditing}
              helperText={isEditing ? 'Use Adjust Stock to modify inventory levels' : undefined}
            />
            <Input
              label="Category"
              placeholder="e.g. Grocery"
              {...register('category')}
              error={errors.category?.message}
            />
          </FormRow>

          <FormField>
            <Input
              label="Description"
              placeholder="Optional description"
              {...register('description')}
              error={errors.description?.message}
            />
          </FormField>
        </div>

        <DialogActions>
          <Button type="button" variant="outline" onClick={handleClose} disabled={disableSubmit}>
            Cancel
          </Button>
          <Button type="submit" isLoading={disableSubmit} disabled={disableSubmit}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}

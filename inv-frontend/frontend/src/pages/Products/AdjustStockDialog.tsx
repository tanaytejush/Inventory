import { useEffect, useState } from 'react'
import { Dialog, DialogActions } from '../../components/Dialog'
import { Form, FormField } from '../../components/Form'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import type { Product } from '../../types'
import { useAdjustStock } from '../../hooks/useProducts'

interface AdjustStockDialogProps {
  product: Product
  open: boolean
  onClose: () => void
}

type AdjustmentMode = 'add' | 'remove'

export function AdjustStockDialog({ product, open, onClose }: AdjustStockDialogProps) {
  const [mode, setMode] = useState<AdjustmentMode>('add')
  const [quantity, setQuantity] = useState<number>(0)
  const adjustStock = useAdjustStock()

  useEffect(() => {
    if (open) {
      setMode('add')
      setQuantity(0)
    }
  }, [open])

  const newStockLevel = () => {
    if (mode === 'add') {
      return product.onHand + quantity
    }
    return Math.max(product.onHand - quantity, 0)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (quantity <= 0) return

    const delta = mode === 'add' ? quantity : -quantity

    try {
      await adjustStock.mutateAsync({
        productId: product.id,
        quantityChange: delta,
        reason: 'manual',
      })
      onClose()
    } catch (error) {
      console.error('Failed to adjust stock', error)
    }
  }

  const isSaving = adjustStock.isPending

  return (
    <Dialog open={open} onClose={onClose} title={`Adjust Stock – ${product.name}`} className="max-w-md">
      <Form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Stock</span>
            <span>{product.onHand} {product.unit}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-medium">New Stock</span>
            <span className={newStockLevel() < product.onHand ? 'text-red-600 font-semibold' : 'font-semibold'}>
              {newStockLevel()} {product.unit}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'add' ? 'primary' : 'outline'}
            onClick={() => setMode('add')}
            className="flex-1"
            disabled={isSaving || mode === 'add'}
          >
            Add Stock
          </Button>
          <Button
            type="button"
            variant={mode === 'remove' ? 'primary' : 'outline'}
            onClick={() => setMode('remove')}
            className="flex-1"
            disabled={isSaving || mode === 'remove'}
          >
            Remove Stock
          </Button>
        </div>

        <FormField>
          <Input
            label="Quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={event => setQuantity(Number(event.target.value) || 0)}
            required
          />
        </FormField>

        <DialogActions>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving} disabled={isSaving || quantity <= 0}>
            {mode === 'add' ? 'Add Stock' : 'Remove Stock'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}

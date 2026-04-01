import { useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useProducts } from '../../hooks/useProducts'
import { useCreatePurchase } from '../../hooks/usePurchases'
import type { Product } from '../../types'

interface PurchaseLine {
  id: string
  productId: string
  qty: number
  unitCost: number
  taxRate: number
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 10)
}

const createLine = (product?: Product): PurchaseLine => ({
  id: createId(),
  productId: product?.id ?? '',
  qty: 1,
  unitCost: product?.costPrice ?? 0,
  taxRate: product?.taxRate ?? 0,
})

export function NewPurchase() {
  const { data: suppliers = [] } = useSuppliers()
  const { data: products = [] } = useProducts()
  const createPurchase = useCreatePurchase()

  const [supplierId, setSupplierId] = useState('')
  const [lines, setLines] = useState<PurchaseLine[]>([])
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [successId, setSuccessId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supplierOptions = suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name }))
  const productOptions = products.map((product) => ({ value: product.id, label: `${product.name}${product.sku ? ` (${product.sku})` : ''}` }))

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.qty * line.unitCost, 0)
    const tax = lines.reduce((sum, line) => sum + line.qty * line.unitCost * (line.taxRate / 100), 0)
    const grand = subtotal + tax
    return { subtotal, tax, grand }
  }, [lines])

  const updateLine = (id: string, updates: Partial<PurchaseLine>) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...updates } : line))
    )
  }

  const handleProductChange = (lineId: string, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) {
      updateLine(lineId, { productId, unitCost: 0, taxRate: 0 })
      return
    }
    updateLine(lineId, {
      productId: product.id,
      unitCost: product.costPrice,
      taxRate: product.taxRate,
    })
  }

  const handleAddLine = () => {
    const defaultProduct = products[0]
    setLines((prev) => [...prev, createLine(defaultProduct)])
  }

  const handleRemoveLine = (id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccessId(null)

    if (!supplierId) {
      setError('Please select a supplier.')
      return
    }
    if (lines.length === 0) {
      setError('Add at least one line item.')
      return
    }
    if (lines.some((line) => !line.productId || line.qty <= 0 || line.unitCost <= 0)) {
      setError('Each line must have a product, quantity, and unit cost greater than zero.')
      return
    }

    try {
      const purchaseId = await createPurchase.mutateAsync({
        supplierId,
        items: lines.map((line) => ({
          productId: line.productId,
          qty: line.qty,
          unitCost: line.unitCost,
          taxRate: line.taxRate,
        })),
        invoiceNumber: invoiceNumber || undefined,
      })

      setSuccessId(purchaseId)
      setSupplierId('')
      setLines([])
      setInvoiceNumber('')
    } catch (mutationError) {
      console.error('Failed to create purchase', mutationError)
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to create purchase')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Create Purchase</h1>
        <p className="text-sm text-gray-600">Record new stock received from suppliers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Supplier"
            options={supplierOptions}
            value={supplierId}
            onChange={(event) => setSupplierId(event.target.value)}
            placeholder="Select supplier"
            required
          />
          <Input
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(event) => setInvoiceNumber(event.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-black">Line Items</h2>
            <Button type="button" onClick={handleAddLine} disabled={products.length === 0}>
              Add Item
            </Button>
          </div>

          {lines.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
              No items yet. Use “Add Item” to begin.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3">Unit Cost</th>
                    <th className="pb-3">Tax %</th>
                    <th className="pb-3">Subtotal</th>
                    <th className="pb-3" aria-label="actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => {
                    const product = products.find((p) => p.id === line.productId)
                    const subtotal = line.qty * line.unitCost
                    return (
                      <tr key={line.id} className="border-t last:border-b">
                        <td className="py-3 pr-4">
                          <select
                            className="h-10 w-56 rounded-lg border border-gray-300 px-3 text-sm"
                            value={line.productId}
                            onChange={(event) => handleProductChange(line.id, event.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Select product
                            </option>
                            {productOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {product?.category && (
                            <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={1}
                            value={line.qty}
                            onChange={(event) => updateLine(line.id, { qty: Math.max(1, Number(event.target.value) || 1) })}
                            className="h-10 w-20 rounded-lg border border-gray-300 px-3 text-sm"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={line.unitCost}
                            onChange={(event) => updateLine(line.id, { unitCost: Math.max(0, Number(event.target.value) || 0) })}
                            className="h-10 w-24 rounded-lg border border-gray-300 px-3 text-sm"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step="0.01"
                            value={line.taxRate}
                            onChange={(event) => updateLine(line.id, { taxRate: Math.max(0, Number(event.target.value) || 0) })}
                            className="h-10 w-20 rounded-lg border border-gray-300 px-3 text-sm"
                          />
                        </td>
                        <td className="py-3 pr-4 font-semibold text-black">
                          {subtotal.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <Button type="button" variant="ghost" onClick={() => handleRemoveLine(line.id)}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 p-4 text-sm md:w-1/2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>₹{totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-semibold text-black">
            <span>Total</span>
            <span>₹{totals.grand.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {successId && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Purchase created successfully. Reference ID: <span className="font-semibold">{successId}</span>
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={createPurchase.isPending}
            disabled={createPurchase.isPending}
          >
            Create Purchase
          </Button>
        </div>
      </form>
    </div>
  )
}

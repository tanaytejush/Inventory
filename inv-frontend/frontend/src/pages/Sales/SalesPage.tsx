import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useCreateSale } from '../../hooks/useSales'
import {
  useCartStore,
  selectCartItems,
  selectCartSubtotal,
  selectCartTax,
  selectCartGrandTotal,
} from '../../state/cartStore'
import { SearchInput } from '../../components/SearchInput'
import { Button } from '../../components/Button'
import { formatCurrency } from '../../utils/currency'

export function SalesPage() {
  const navigate = useNavigate()
  const { data: products = [] } = useProducts()
  const createSale = useCreateSale()

  const items = useCartStore(selectCartItems)
  const addToCart = useCartStore((state) => state.add)
  const increment = useCartStore((state) => state.inc)
  const decrement = useCartStore((state) => state.dec)
  const setQuantity = useCartStore((state) => state.setQty)
  const clearCart = useCartStore((state) => state.clear)

  const subtotal = useCartStore(selectCartSubtotal)
  const taxTotal = useCartStore(selectCartTax)
  const grandTotal = useCartStore(selectCartGrandTotal)

  const [search, setSearch] = useState('')
  const [discount, setDiscount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const sku = product.sku?.toLowerCase() ?? ''
      return product.name.toLowerCase().includes(query) || sku.includes(query)
    })
  }, [products, search])

  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    addToCart(product)
    setError(null)
  }

  const safeDiscount = Math.min(Math.max(discount, 0), grandTotal)
  const payable = Math.max(grandTotal - safeDiscount, 0)

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Add at least one product to proceed.')
      return
    }

    try {
      setError(null)
      const itemsSnapshot = items.map((item) => ({ ...item }))
      const summary = {
        subtotal,
        tax: taxTotal,
        discount: safeDiscount,
        total: payable,
      }
      const saleId = await createSale.mutateAsync({
        items: itemsSnapshot,
        billDiscount: safeDiscount,
      })

      clearCart()
      setDiscount(0)

      navigate('/sales/receipt', {
        state: {
          sale: {
            id: saleId,
            date: new Date().toISOString(),
            items: itemsSnapshot,
            subtotal: summary.subtotal,
            tax: summary.tax,
            discount: summary.discount,
            total: summary.total,
          },
        },
      })
    } catch (checkoutError) {
      console.error('Checkout failed', checkoutError)
      setError(checkoutError instanceof Error ? checkoutError.message : 'Failed to complete checkout')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-black">New Sale</h1>
        <p className="text-sm text-gray-600">Build a bill by adding products to the cart and finalise the checkout.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr_1.2fr]">
        {/* Product Browser */}
        <div className="card flex flex-col gap-4 p-5">
          <h2 className="font-semibold text-black">Products</h2>
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search by name or SKU"
          />
          <div className="flex-1 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="py-6 text-sm text-gray-500 text-center">No matching products</p>
            ) : (
              <ul className="space-y-3">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                    <div>
                      <p className="font-medium text-black">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.sku || 'No SKU'} • {formatCurrency(product.sellPrice)}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleAddProduct(product.id)}>
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="card flex flex-col p-5">
          <h2 className="font-semibold text-black mb-4">Cart</h2>
          <div className="flex-1 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Subtotal</th>
                  <th className="pb-3" aria-label="actions"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Cart is empty
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.productId} className="border-t">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-black">{item.name}</div>
                        <div className="text-xs text-gray-500">Tax {item.taxRate}%</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => decrement(item.productId)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(event) => setQuantity(item.productId, Number(event.target.value))}
                            className="h-8 w-14 rounded-lg border border-gray-300 text-center text-sm"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => increment(item.productId)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{formatCurrency(item.price)}</td>
                      <td className="py-3 pr-4 font-semibold text-black">{formatCurrency(item.subtotal)}</td>
                      <td className="py-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => setQuantity(item.productId, 0)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="card flex flex-col gap-4 p-5">
          <h2 className="font-semibold text-black">Bill Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="bill-discount" className="text-gray-600">
                Discount
              </label>
              <input
                id="bill-discount"
                type="number"
                min={0}
                max={grandTotal}
                value={discount}
                onChange={(event) => setDiscount(Math.max(0, Number(event.target.value) || 0))}
                className="h-9 w-28 rounded-lg border border-gray-300 px-3 text-right"
              />
            </div>
            <div className="border-t pt-3 text-base font-semibold text-black flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(payable)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-auto space-y-3">
            <Button
              onClick={handleCheckout}
              disabled={items.length === 0 || createSale.isPending}
              isLoading={createSale.isPending}
              className="w-full"
            >
              Checkout
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearCart()
                setDiscount(0)
                setError(null)
              }}
              disabled={items.length === 0}
              className="w-full"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

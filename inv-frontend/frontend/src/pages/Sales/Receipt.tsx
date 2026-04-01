import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/currency'
import type { CartItem } from '../../state/cartStore'

interface ReceiptState {
  sale?: {
    id: string
    date: string
    items: CartItem[]
    subtotal: number
    tax: number
    discount: number
    total: number
  }
}

export function ReceiptPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ReceiptState | null
  const sale = state?.sale

  useEffect(() => {
    if (!sale) {
      navigate('/sales')
    }
  }, [sale, navigate])

  if (!sale) {
    return null
  }

  const saleDate = new Date(sale.date).toLocaleString()

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Sales Receipt</h1>
        <p className="text-sm text-gray-600">Sale ID: {sale.id}</p>
        <p className="text-sm text-gray-600">{saleDate}</p>
      </header>

      <section>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Price</th>
              <th className="py-2">Tax</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => {
              const lineTax = item.subtotal * (item.taxRate / 100)
              const lineTotal = item.subtotal + lineTax
              return (
                <tr key={item.productId} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    <div className="font-medium text-black">{item.name}</div>
                    <div className="text-xs text-gray-500">Tax {item.taxRate}%</div>
                  </td>
                  <td className="py-2 pr-4">{item.qty}</td>
                  <td className="py-2 pr-4">{formatCurrency(item.price)}</td>
                  <td className="py-2 pr-4">{formatCurrency(lineTax)}</td>
                  <td className="py-2 pr-0 font-semibold text-black">{formatCurrency(lineTotal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(sale.tax)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount</span>
            <span>-{formatCurrency(sale.discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
      </section>

      <footer className="flex items-center justify-between">
        <button
          type="button"
          className="rounded border border-gray-300 px-4 py-2 text-sm"
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          type="button"
          className="rounded border border-gray-300 px-4 py-2 text-sm"
          onClick={() => navigate('/sales')}
        >
          Back to Sales
        </button>
      </footer>
    </main>
  )
}

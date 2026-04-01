import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Package, Power, Repeat2 } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { Button } from '../../components/Button'
import { SearchInput } from '../../components/SearchInput'
import { ProductForm } from './ProductForm'
import { AdjustStockDialog } from './AdjustStockDialog'
import { useProducts, useUpdateProduct } from '../../hooks/useProducts'
import type { Product } from '../../types'
import { formatCurrency } from '../../utils/currency'

export function ProductsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading } = useProducts()
  const updateProduct = useUpdateProduct()

  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products
    }
    const query = searchQuery.trim().toLowerCase()
    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query)
      const skuMatch = (product.sku ?? '').toLowerCase().includes(query)
      return nameMatch || skuMatch
    })
  }, [products, searchQuery])

  const openCreateForm = () => {
    setSelectedProduct(null)
    setProductFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setSelectedProduct(product)
    setProductFormOpen(true)
  }

  const openAdjustDialog = (product: Product) => {
    setSelectedProduct(product)
    setAdjustDialogOpen(true)
  }

  const handleDeactivate = (product: Product) => {
    updateProduct.mutate({ id: product.id, isActive: !product.isActive })
  }

  const closeDialogs = () => {
    setProductFormOpen(false)
    setAdjustDialogOpen(false)
    setSelectedProduct(null)
  }

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      render: (_: string, product: Product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-black">{product.name}</p>
            {product.description && (
              <p className="text-xs text-gray-500">{product.description}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'sku' as const,
      label: 'SKU',
      render: (sku: string | undefined) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
          {sku || '—'}
        </code>
      )
    },
    {
      key: 'category' as const,
      label: 'Category',
      render: (category: string | undefined) => category || 'General'
    },
    {
      key: 'sellPrice' as const,
      label: 'Sell Price',
      render: (price: number) => (
        <span className="font-semibold text-green-600">{formatCurrency(price)}</span>
      )
    },
    {
      key: 'onHand' as const,
      label: 'On Hand',
      render: (onHand: number, product: Product) => {
        const isLow = onHand <= product.reorderLevel
        return (
          <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-black'}`}>
            {onHand} {product.unit}
            {isLow && <AlertTriangle className="ml-1 inline h-4 w-4 align-middle" />}
          </span>
        )
      }
    },
    {
      key: 'reorderLevel' as const,
      label: 'Reorder Level',
      render: (reorderLevel: number, product: Product) => (
        <span className="text-sm text-gray-600">{reorderLevel} {product.unit}</span>
      )
    },
    {
      key: 'isActive' as const,
      label: 'Status',
      render: (isActive: boolean) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (_: unknown, product: Product) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditForm(product)}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => openAdjustDialog(product)}>
            Adjust
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeactivate(product)}
            disabled={updateProduct.isPending}
            className="flex items-center gap-1"
          >
            <Power className="h-4 w-4" />
            {product.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Products</h1>
          <p className="text-sm text-gray-600">Track inventory levels and manage your catalog.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/products/low-stock')} className="flex items-center gap-2">
            <Repeat2 className="h-4 w-4" />
            Low Stock
          </Button>
          <Button onClick={openCreateForm}>New Product</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search by name or SKU..."
        />
      </div>

      <DataTable
        data={filteredProducts}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={searchQuery ? 'No products match your search' : 'No products found'}
      />

      {productFormOpen && (
        <ProductForm
          product={selectedProduct}
          open={productFormOpen}
          onClose={closeDialogs}
        />
      )}

      {adjustDialogOpen && selectedProduct && (
        <AdjustStockDialog
          product={selectedProduct}
          open={adjustDialogOpen}
          onClose={closeDialogs}
        />
      )}
    </div>
  )
}

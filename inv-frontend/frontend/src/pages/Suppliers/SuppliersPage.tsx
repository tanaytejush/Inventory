import { useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Button } from '../../components/Button'
import { SearchInput } from '../../components/SearchInput'
import { useSuppliers } from '../../hooks/useSuppliers'
import { SupplierForm } from './SupplierForm'
import type { Supplier } from '../../types'

export function SuppliersPage() {
  const { data: suppliers = [], isLoading } = useSuppliers()
  const [search, setSearch] = useState('')
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const filteredSuppliers = useMemo(() => {
    if (!search) return suppliers
    const query = search.trim().toLowerCase()
    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(query) ||
        (supplier.phone ?? '').toLowerCase().includes(query) ||
        (supplier.gstNumber ?? '').toLowerCase().includes(query)
      )
    })
  }, [suppliers, search])

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      render: (name: string, supplier: Supplier) => (
        <div>
          <p className="font-semibold text-black">{name}</p>
          {supplier.contactPerson && (
            <p className="text-xs text-gray-500">Contact: {supplier.contactPerson}</p>
          )}
        </div>
      )
    },
    {
      key: 'phone' as const,
      label: 'Phone',
      render: (phone: string | undefined) => phone || '—',
    },
    {
      key: 'gstNumber' as const,
      label: 'GSTIN',
      render: (gst: string | undefined) => gst || '—',
    },
    {
      key: 'address' as const,
      label: 'Address',
      render: (address: string | undefined) => address || '—',
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (_: unknown, supplier: Supplier) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setActiveSupplier(supplier)
            setFormOpen(true)
          }}
        >
          Edit
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Suppliers</h1>
          <p className="text-sm text-gray-600">Directory of vendors and purchase partners.</p>
        </div>
        <Button
          onClick={() => {
            setActiveSupplier(null)
            setFormOpen(true)
          }}
        >
          New Supplier
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onClear={() => setSearch('')}
        placeholder="Search by name, phone, or GSTIN"
      />

      <DataTable
        data={filteredSuppliers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={search ? 'No suppliers match your search' : 'No suppliers added yet'}
      />

      {formOpen && (
        <SupplierForm
          supplier={activeSupplier}
          onClose={() => {
            setFormOpen(false)
            setActiveSupplier(null)
          }}
        />
      )}
    </div>
  )
}

import { supabase } from './supabaseClient'
import type { Product, Sale, Supplier, Purchase, UserProfile } from '../types'
import type { Database, Json } from '../types/database'

type Tables = Database['public']['Tables']
type ProductRow = Tables['products']['Row']
type SupplierRow = Tables['suppliers']['Row']
type UserRow = Tables['users']['Row']

type SaleRowWithItems = Tables['sales']['Row'] & {
  sale_items?: Array<{
    id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    products?: { name: string } | null
  }> | null
}

type PurchaseRowWithItems = Tables['purchases']['Row'] & {
  suppliers?: { name: string } | null
  purchase_items?: Array<{
    id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    products?: { name: string } | null
  }> | null
}

class SupabaseApiClient {
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return this.mapUserRowToProfile(data)
  }

  async getProducts(shopId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapProductRowToProduct)
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        shop_id: product.shopId,
        name: product.name,
        sku: product.sku,
        description: product.description ?? null,
        category: product.category ?? 'General',
        purchase_price: product.costPrice,
        selling_price: product.sellPrice,
        tax_rate: product.taxRate,
        stock_quantity: product.onHand,
        reorder_level: product.reorderLevel,
        unit: product.unit,
        barcode: product.barcode ?? null,
        is_active: product.isActive,
      })
      .select()
      .single()

    if (error) throw error
    return this.mapProductRowToProduct(data)
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const updateData: Partial<Tables['products']['Update']> = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.costPrice !== undefined) updateData.purchase_price = updates.costPrice
    if (updates.sellPrice !== undefined) updateData.selling_price = updates.sellPrice
    if (updates.taxRate !== undefined) updateData.tax_rate = updates.taxRate
    if (updates.onHand !== undefined) updateData.stock_quantity = updates.onHand
    if (updates.reorderLevel !== undefined) updateData.reorder_level = updates.reorderLevel
    if (updates.unit !== undefined) updateData.unit = updates.unit
    if (updates.barcode !== undefined) updateData.barcode = updates.barcode
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapProductRowToProduct(data)
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getSales(shopId: string): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          id,
          product_id,
          quantity,
          unit_price,
          total_price,
          products (name)
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapSaleRowToSale)
  }

  async getSuppliers(shopId: string): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapSupplierRowToSupplier)
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        shop_id: supplier.shopId,
        name: supplier.name,
        contact_person: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        gst_number: supplier.gstNumber,
        pan_number: supplier.panNumber
      })
      .select()
      .single()

    if (error) throw error
    return this.mapSupplierRowToSupplier(data)
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const updateData: Partial<Tables['suppliers']['Update']> = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.contactPerson !== undefined) updateData.contact_person = updates.contactPerson
    if (updates.phone !== undefined) updateData.phone = updates.phone
    if (updates.email !== undefined) updateData.email = updates.email
    if (updates.address !== undefined) updateData.address = updates.address
    if (updates.gstNumber !== undefined) updateData.gst_number = updates.gstNumber
    if (updates.panNumber !== undefined) updateData.pan_number = updates.panNumber

    const { data, error } = await supabase
      .from('suppliers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapSupplierRowToSupplier(data)
  }

  async deleteSupplier(id: string): Promise<void> {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getPurchases(shopId: string): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        suppliers (name),
        purchase_items (
          id,
          product_id,
          quantity,
          unit_price,
          total_price,
          products (name)
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapPurchaseRowToPurchase)
  }

  async getLowStockProducts(shopId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('low_stock_v')
      .select('*')
      .eq('shop_id', shopId)

    if (error) throw error
    return data.map(row => ({
      id: row.product_id,
      shopId,
      name: row.product_name,
      sku: '',
      description: null,
      category: row.category ?? 'General',
      costPrice: 0,
      sellPrice: 0,
      taxRate: 0,
      onHand: row.stock_quantity,
      reorderLevel: row.reorder_level,
      unit: 'pcs',
      barcode: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }

  async getSalesStats(shopId: string, fromDate?: string, toDate?: string): Promise<any> {
    const { data, error } = await supabase
      .rpc('rpc_get_sales_stats', {
        shop_id: shopId,
        from_date: fromDate,
        to_date: toDate
      })

    if (error) throw error
    return data
  }

  async adjustStock(productId: string, quantityChange: number, reason: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('rpc_adjust_stock', {
        product_id: productId,
        quantity_change: quantityChange,
        reason
      })

    if (error) throw error
    return data
  }

  async createSale(saleData: Record<string, Json>, saleItems: Array<Record<string, Json>>): Promise<string> {
    const { data, error } = await supabase
      .rpc('rpc_create_sale', {
        sale_data: saleData,
        sale_items: saleItems
      })

    if (error) throw error
    return data
  }

  async createPurchase(purchaseData: Record<string, Json>, purchaseItems: Array<Record<string, Json>>): Promise<string> {
    const { data, error } = await supabase
      .rpc('rpc_create_purchase', {
        purchase_data: purchaseData,
        purchase_items: purchaseItems
      })

    if (error) throw error
    return data
  }

  async updatePurchase(id: string, updates: Partial<Purchase>): Promise<Purchase> {
    const updateData: Partial<Tables['purchases']['Update']> = {}
    if (updates.supplierId !== undefined) updateData.supplier_id = updates.supplierId
    if (updates.invoiceNumber !== undefined) updateData.invoice_number = updates.invoiceNumber
    if (updates.purchaseDate !== undefined) updateData.purchase_date = updates.purchaseDate
    if (updates.grandTotal !== undefined) updateData.total_amount = updates.grandTotal
    if (updates.taxTotal !== undefined) updateData.tax_amount = updates.taxTotal
    if (updates.discountTotal !== undefined) updateData.discount_amount = updates.discountTotal
    if (updates.status !== undefined) updateData.status = updates.status.toUpperCase() as Tables['purchases']['Update']['status']

    const { data, error } = await supabase
      .from('purchases')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapPurchaseRowToPurchase({ ...data, suppliers: null, purchase_items: [] })
  }

  private mapUserRowToProfile(row: UserRow): UserProfile {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      shopId: row.shop_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  private mapProductRowToProduct(row: ProductRow): Product {
    return {
      id: row.id,
      shopId: row.shop_id,
      name: row.name,
      sku: row.sku,
      description: row.description,
      category: row.category,
      costPrice: row.purchase_price,
      sellPrice: row.selling_price,
      taxRate: row.tax_rate ?? 0,
      onHand: row.stock_quantity,
      reorderLevel: row.reorder_level,
      unit: row.unit,
      barcode: row.barcode,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  private mapSaleRowToSale(row: SaleRowWithItems): Sale {
    const subtotal = row.sale_items?.reduce((sum, item) => sum + item.total_price, 0) ?? 0

    return {
      id: row.id,
      shopId: row.shop_id,
      userId: '',
      subtotal,
      taxTotal: row.tax_amount ?? 0,
      discountTotal: row.discount_amount ?? 0,
      grandTotal: row.total_amount,
      paymentMethod: row.payment_method as Sale['paymentMethod'],
      customerName: row.customer_name ?? undefined,
      customerPhone: row.customer_phone ?? undefined,
      createdAt: row.created_at,
    }
  }

  private mapSupplierRowToSupplier(row: SupplierRow): Supplier {
    return {
      id: row.id,
      shopId: row.shop_id,
      name: row.name,
      contactPerson: row.contact_person,
      phone: row.phone,
      email: row.email,
      address: row.address,
      gstNumber: row.gst_number,
      panNumber: row.pan_number,
      isActive: true,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  private mapPurchaseRowToPurchase(row: PurchaseRowWithItems): Purchase {
    const itemSubtotal = row.purchase_items?.reduce((sum, item) => sum + item.total_price, 0) ?? 0
    const taxAmount = row.tax_amount ?? 0
    const discountAmount = row.discount_amount ?? 0
    const grandTotal = row.total_amount
    const status: Purchase['status'] = (() => {
      switch (row.status) {
        case 'COMPLETED':
          return 'received'
        case 'CANCELLED':
          return 'cancelled'
        default:
          return 'pending'
      }
    })()

    return {
      id: row.id,
      shopId: row.shop_id,
      supplierId: row.supplier_id,
      supplierName: row.suppliers?.name ?? undefined,
      userId: '',
      subtotal: itemSubtotal,
      taxTotal: taxAmount,
      discountTotal: discountAmount,
      grandTotal,
      status,
      invoiceNumber: row.invoice_number ?? undefined,
      invoiceDate: row.purchase_date ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined,
    }
  }
}

export const api = new SupabaseApiClient()

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

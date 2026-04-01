// Core Types
export type Role = 'OWNER' | 'STAFF'

export type LedgerReason = 'sale' | 'purchase' | 'manual' | 'return'

export type Unit = 'pcs' | 'kg' | 'gm' | 'ltr' | 'ml' | 'box' | 'pack'

export type PurchaseStatus = 'pending' | 'received' | 'cancelled'

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer'

// Business Entities
export interface Shop {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  gstNumber?: string
  panNumber?: string
  logoUrl?: string
  currency: string
  timezone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  shopId: string
  email: string
  name: string
  phone?: string
  role: Role
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  shopId: string
  name: string
  sku?: string
  description?: string | null
  barcode?: string
  category?: string
  unit: Unit
  costPrice: number
  sellPrice: number
  taxRate: number // percentage (e.g., 18 for 18% GST)
  reorderLevel: number
  isActive: boolean
  onHand: number // current stock quantity
  createdAt: string
  updatedAt?: string
}

export interface Ledger {
  id: string
  shopId: string
  productId: string
  deltaQty: number // positive for additions, negative for deductions
  reason: LedgerReason
  refId?: string // reference to sale, purchase, or adjustment record
  notes?: string
  createdAt: string
}

export interface Sale {
  id: string
  shopId: string
  userId: string
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  paymentMethod: PaymentMethod
  customerId?: string
  customerName?: string
  customerPhone?: string
  idempotencyKey?: string // for preventing duplicate sales
  notes?: string
  createdAt: string
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  qty: number
  unitPrice: number
  taxRate: number
  discount: number
  lineTotal: number // calculated: (qty * unitPrice - discount) + tax
  product?: Product
}

export interface Supplier {
  id: string
  shopId: string
  name: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  gstNumber?: string
  panNumber?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface Purchase {
  id: string
  shopId: string
  supplierId: string
  supplierName?: string
  userId: string
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  status: PurchaseStatus
  invoiceNumber?: string
  invoiceDate?: string
  dueDate?: string
  notes?: string
  createdAt: string
  receivedAt?: string
  updatedAt?: string
}

export interface PurchaseItem {
  id: string
  purchaseId: string
  productId: string
  qty: number
  unitCost: number
  taxRate: number
  discount: number
  lineTotal: number // calculated: (qty * unitCost - discount) + tax
}

// Legacy interfaces for compatibility
export interface Customer {
  id: string
  shopId: string
  name: string
  email?: string
  phone?: string
  address?: string
  totalPurchases: number
  totalSpent: number
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface StockAdjustment {
  id: string
  shopId: string
  productId: string
  userId: string
  adjustedQty: number
  reason: string
  notes?: string
  createdAt: string
}

// Report Types
export interface SalesDaily {
  date: string // YYYY-MM-DD format
  shopId: string
  totalSales: number
  totalTransactions: number
  totalTax: number
  totalDiscount: number
  grossRevenue: number
  netRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    productName: string
    quantitySold: number
    revenue: number
  }>
  paymentMethodBreakdown: Record<PaymentMethod, {
    count: number
    amount: number
  }>
}

export interface StockValuation {
  shopId: string
  generatedAt: string
  totalProducts: number
  totalStockValue: number
  averageStockValue: number
  products: Array<{
    productId: string
    productName: string
    sku?: string
    category?: string
    onHand: number
    costPrice: number
    sellPrice: number
    stockValue: number // onHand * costPrice
    potentialRevenue: number // onHand * sellPrice
    reorderLevel: number
    isLowStock: boolean
  }>
  categoryBreakdown: Array<{
    category: string
    productCount: number
    stockValue: number
    averageStockValue: number
  }>
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form Types
export interface ProductFormData {
  name: string
  sku?: string
  description?: string
  barcode?: string
  category?: string
  unit: Unit
  costPrice: number
  sellPrice: number
  taxRate: number
  reorderLevel: number
  initialStock?: number
  isActive?: boolean
}

export interface SaleFormData {
  items: Array<{
    productId: string
    qty: number
    unitPrice?: number
    discount?: number
  }>
  customerId?: string
  customerName?: string
  customerPhone?: string
  discountTotal?: number
  paymentMethod: PaymentMethod
  notes?: string
}

export interface PurchaseFormData {
  supplierId: string
  items: Array<{
    productId: string
    qty: number
    unitCost: number
    discount?: number
  }>
  invoiceNumber?: string
  invoiceDate?: string
  dueDate?: string
  discountTotal?: number
  notes?: string
}

import { v4 as uuidv4 } from 'uuid'

/**
 * Generates a UUID v4 string
 * @returns A UUID v4 string
 */
export const uuid = (): string => {
  return uuidv4()
}

/**
 * Legacy alias for uuid() for backward compatibility
 * @returns A UUID v4 string
 */
export const generateId = (): string => {
  return uuid()
}

/**
 * Generates a SKU with optional prefix
 * @param prefix - The prefix for the SKU (default: 'SKU')
 * @returns A formatted SKU string
 */
export const generateSku = (prefix = 'SKU'): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

/**
 * Generates a barcode using EAN-13 format (simplified)
 * @returns A 13-digit barcode string
 */
export const generateBarcode = (): string => {
  // Generate 12 random digits
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))

  // Calculate check digit (simplified EAN-13 checksum)
  const oddSum = digits.filter((_, i) => i % 2 === 0).reduce((sum, digit) => sum + digit, 0)
  const evenSum = digits.filter((_, i) => i % 2 === 1).reduce((sum, digit) => sum + digit, 0)
  const checkDigit = (10 - ((oddSum + evenSum * 3) % 10)) % 10

  return [...digits, checkDigit].join('')
}

/**
 * Generates a receipt/invoice number
 * @param prefix - The prefix for the receipt number (default: 'RCP')
 * @returns A formatted receipt number
 */
export const generateReceiptNumber = (prefix = 'RCP'): string => {
  const date = new Date()
  const year = date.getFullYear().toString().substr(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}-${year}${month}${day}-${random}`
}

/**
 * Generates a purchase order number
 * @param prefix - The prefix for the PO number (default: 'PO')
 * @returns A formatted purchase order number
 */
export const generatePurchaseOrderNumber = (prefix = 'PO'): string => {
  const date = new Date()
  const year = date.getFullYear().toString().substr(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}-${year}${month}${day}-${random}`
}

/**
 * Generates a sale invoice number
 * @param prefix - The prefix for the invoice number (default: 'INV')
 * @returns A formatted invoice number
 */
export const generateInvoiceNumber = (prefix = 'INV'): string => {
  const date = new Date()
  const year = date.getFullYear().toString().substr(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}-${year}${month}${day}-${random}`
}

/**
 * Generates an idempotency key for preventing duplicate operations
 * @returns A UUID v4 string suitable for idempotency
 */
export const generateIdempotencyKey = (): string => {
  return uuid()
}

/**
 * Generates a short alphanumeric ID (8 characters)
 * @returns A short ID string
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase()
}

/**
 * Generates a customer ID with prefix
 * @param prefix - The prefix for the customer ID (default: 'CUST')
 * @returns A formatted customer ID
 */
export const generateCustomerId = (prefix = 'CUST'): string => {
  const shortId = generateShortId()
  return `${prefix}-${shortId}`
}

/**
 * Generates a supplier ID with prefix
 * @param prefix - The prefix for the supplier ID (default: 'SUPP')
 * @returns A formatted supplier ID
 */
export const generateSupplierId = (prefix = 'SUPP'): string => {
  const shortId = generateShortId()
  return `${prefix}-${shortId}`
}
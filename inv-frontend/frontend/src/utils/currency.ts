/**
 * Formats a number as Indian Rupee currency
 * @param amount - The amount to format
 * @param locale - The locale to use (default: 'en-IN' for Indian formatting)
 * @returns Formatted currency string with ₹ symbol
 */
export const formatCurrency = (amount: number, locale = 'en-IN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats currency without the symbol (just the number with commas)
 * @param amount - The amount to format
 * @param locale - The locale to use (default: 'en-IN')
 * @returns Formatted number string with Indian number formatting
 */
export const formatNumber = (amount: number, locale = 'en-IN'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats currency for compact display (K, L, Cr)
 * @param amount - The amount to format
 * @returns Compact formatted currency string (e.g., ₹1.2L, ₹15K)
 */
export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 10000000) { // 1 Crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  } else if (amount >= 100000) { // 1 Lakh
    return `₹${(amount / 100000).toFixed(1)}L`
  } else if (amount >= 1000) { // 1 Thousand
    return `₹${(amount / 1000).toFixed(1)}K`
  } else {
    return formatCurrency(amount)
  }
}

/**
 * Parses a currency string and returns the numeric value
 * @param value - The currency string to parse
 * @returns The numeric value
 */
export const parseCurrency = (value: string): number => {
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[₹,\s]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Calculates tax amount based on rate
 * @param amount - The base amount
 * @param taxRate - The tax rate as a percentage (e.g., 18 for 18%)
 * @returns The tax amount
 */
export const calculateTax = (amount: number, taxRate: number): number => {
  return amount * (taxRate / 100)
}

/**
 * Calculates discount amount based on percentage
 * @param amount - The base amount
 * @param discountPercent - The discount percentage (e.g., 10 for 10%)
 * @returns The discount amount
 */
export const calculateDiscount = (amount: number, discountPercent: number): number => {
  return amount * (discountPercent / 100)
}

/**
 * Calculates the amount including tax
 * @param amount - The base amount
 * @param taxRate - The tax rate as a percentage
 * @returns The amount including tax
 */
export const calculateAmountWithTax = (amount: number, taxRate: number): number => {
  return amount + calculateTax(amount, taxRate)
}

/**
 * Calculates the amount after discount
 * @param amount - The base amount
 * @param discountPercent - The discount percentage
 * @returns The amount after discount
 */
export const calculateAmountAfterDiscount = (amount: number, discountPercent: number): number => {
  return amount - calculateDiscount(amount, discountPercent)
}

/**
 * Calculates line total for a sale/purchase item
 * @param qty - Quantity
 * @param unitPrice - Price per unit
 * @param taxRate - Tax rate as percentage
 * @param discount - Discount amount (flat amount, not percentage)
 * @returns The line total including tax and discount
 */
export const calculateLineTotal = (
  qty: number,
  unitPrice: number,
  taxRate: number,
  discount: number = 0
): number => {
  const subtotal = qty * unitPrice
  const afterDiscount = subtotal - discount
  const tax = calculateTax(afterDiscount, taxRate)
  return afterDiscount + tax
}

/**
 * Rounds amount to 2 decimal places (for currency precision)
 * @param amount - The amount to round
 * @returns Rounded amount
 */
export const roundCurrency = (amount: number): number => {
  return Math.round(amount * 100) / 100
}
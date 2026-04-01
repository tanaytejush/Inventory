export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'OWNER' | 'STAFF'
          shop_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'OWNER' | 'STAFF'
          shop_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'OWNER' | 'STAFF'
          shop_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          gst_number: string | null
          pan_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          gst_number?: string | null
          pan_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          gst_number?: string | null
          pan_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          shop_id: string
          name: string
          sku: string
          description: string | null
          category: string
          purchase_price: number
          selling_price: number
          tax_rate: number | null
          stock_quantity: number
          reorder_level: number
          unit: string
          barcode: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          name: string
          sku: string
          description?: string | null
          category: string
          purchase_price: number
          selling_price: number
          tax_rate?: number | null
          stock_quantity: number
          reorder_level: number
          unit: string
          barcode?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          name?: string
          sku?: string
          description?: string | null
          category?: string
          purchase_price?: number
          selling_price?: number
          tax_rate?: number | null
          stock_quantity?: number
          reorder_level?: number
          unit?: string
          barcode?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          shop_id: string
          name: string
          contact_person: string
          phone: string
          email: string | null
          address: string
          gst_number: string | null
          pan_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          name: string
          contact_person: string
          phone: string
          email?: string | null
          address: string
          gst_number?: string | null
          pan_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          name?: string
          contact_person?: string
          phone?: string
          email?: string | null
          address?: string
          gst_number?: string | null
          pan_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          shop_id: string
          supplier_id: string
          invoice_number: string
          purchase_date: string
          total_amount: number
          tax_amount: number
          discount_amount: number
          status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          supplier_id: string
          invoice_number: string
          purchase_date: string
          total_amount: number
          tax_amount?: number
          discount_amount?: number
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          supplier_id?: string
          invoice_number?: string
          purchase_date?: string
          total_amount?: number
          tax_amount?: number
          discount_amount?: number
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          created_at?: string
          updated_at?: string
        }
      }
      purchase_items: {
        Row: {
          id: string
          purchase_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          purchase_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          purchase_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          shop_id: string
          invoice_number: string
          customer_name: string | null
          customer_phone: string | null
          sale_date: string
          total_amount: number
          tax_amount: number
          discount_amount: number
          payment_method: 'CASH' | 'CARD' | 'UPI' | 'CREDIT'
          status: 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          invoice_number: string
          customer_name?: string | null
          customer_phone?: string | null
          sale_date: string
          total_amount: number
          tax_amount?: number
          discount_amount?: number
          payment_method: 'CASH' | 'CARD' | 'UPI' | 'CREDIT'
          status?: 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          invoice_number?: string
          customer_name?: string | null
          customer_phone?: string | null
          sale_date?: string
          total_amount?: number
          tax_amount?: number
          discount_amount?: number
          payment_method?: 'CASH' | 'CARD' | 'UPI' | 'CREDIT'
          status?: 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
          created_at?: string
          updated_at?: string
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          sale_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      ledger_entries: {
        Row: {
          id: string
          shop_id: string
          transaction_type: 'SALE' | 'PURCHASE' | 'EXPENSE' | 'INCOME'
          amount: number
          description: string
          reference_id: string | null
          transaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          transaction_type: 'SALE' | 'PURCHASE' | 'EXPENSE' | 'INCOME'
          amount: number
          description: string
          reference_id?: string | null
          transaction_date: string
          created_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          transaction_type?: 'SALE' | 'PURCHASE' | 'EXPENSE' | 'INCOME'
          amount?: number
          description?: string
          reference_id?: string | null
          transaction_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      sales_daily_v: {
        Row: {
          shop_id: string
          sale_date: string
          total_sales: number
          total_items: number
          avg_sale_amount: number
        }
      }
      stock_valuation_v: {
        Row: {
          shop_id: string
          product_id: string
          product_name: string
          stock_quantity: number
          purchase_price: number
          total_value: number
        }
      }
      low_stock_v: {
        Row: {
          shop_id: string
          product_id: string
          product_name: string
          stock_quantity: number
          reorder_level: number
          category: string
        }
      }
    }
    Functions: {
      fn_create_owner: {
        Args: {
          owner_email: string
          owner_name: string
          shop_name: string
          shop_address: string
          shop_phone: string
          gst_number?: string
          pan_number?: string
        }
        Returns: {
          user_id: string
          shop_id: string
        }
      }
      rpc_adjust_stock: {
        Args: {
          product_id: string
          quantity_change: number
          reason: string
        }
        Returns: boolean
      }
      rpc_create_sale: {
        Args: {
          sale_data: Json
          sale_items: Json[]
        }
        Returns: string
      }
      rpc_create_purchase: {
        Args: {
          purchase_data: Json
          purchase_items: Json[]
        }
        Returns: string
      }
      rpc_get_sales_stats: {
        Args: {
          shop_id: string
          from_date?: string
          to_date?: string
        }
        Returns: {
          total_sales: number
          total_amount: number
          avg_sale_amount: number
          today_sales: number
          today_amount: number
        }
      }
    }
  }
}

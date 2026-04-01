# Supabase Setup Instructions

## 1. Environment Variables
1. Copy `.env.example` to `.env`
2. Add your Supabase project URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 2. Database Schema
You'll need to create these tables and views in your Supabase database:

### Tables:
- `users` - User profiles with shop association
- `shops` - Shop/business information
- `products` - Product catalog
- `suppliers` - Supplier information
- `purchases` - Purchase orders
- `purchase_items` - Individual items in purchases
- `sales` - Sales transactions
- `sale_items` - Individual items in sales
- `ledger_entries` - Financial transactions

### Views:
- `sales_daily_v` - Daily sales aggregation
- `stock_valuation_v` - Current stock valuation
- `low_stock_v` - Products below reorder level

### Functions:
- `fn_create_owner` - Creates owner user and shop
- `rpc_adjust_stock` - Adjusts product stock levels
- `rpc_create_sale` - Creates sale with items
- `rpc_create_purchase` - Creates purchase with items
- `rpc_get_sales_stats` - Returns sales statistics

## 3. What's Been Updated

### Authentication
- Replaced mock authentication with Supabase Auth
- Added signup functionality with owner/shop creation
- Session management via Supabase

### Data Layer
- All API calls now use Supabase client
- React Query hooks updated for shop-specific data
- RPC functions integrated for complex operations

### Reports
- Report hooks now use Supabase views
- Real-time data from database
- Shop-scoped analytics

### Features Ready
- ✅ User authentication and signup
- ✅ Product management with stock tracking
- ✅ Sales processing with inventory updates
- ✅ Purchase order management
- ✅ Supplier management
- ✅ Real-time reports and analytics
- ✅ Multi-tenant (shop-based) architecture

### To Test
1. Set up your Supabase project with the required schema
2. Update environment variables
3. Access the application at http://localhost:5173/
4. Test authentication, data operations, and reports

### Authentication Test
- Email: `admin@example.com`
- Password: `password`
(This will work once you set up the database schema)
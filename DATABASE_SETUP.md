Error: Supabase insert timed out
    at ProductsProvider.useCallback[addProduct].insertWithTimeout.id (webpack-internal:///(app-pages-browser)/./components/providers/products-provider.tsx:198:113)# Fivoarana Database Setup Instructions

## 🚀 Quick Setup

### 1. Run the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to execute the schema

### 2. Verify Tables Created

After running the schema, you should see these tables in your Supabase dashboard:

- ✅ `users` - User profiles
- ✅ `artisan_profiles` - Extended artisan information
- ✅ `products` - Product catalog
- ✅ `orders` - Order management
- ✅ `order_items` - Order line items
- ✅ `wishlist_items` - User wishlists
- ✅ `cart_items` - Shopping carts
- ✅ `product_reviews` - Product reviews (future)
- ✅ `categories` - Product categories

### 3. Verify Storage Buckets

Check that these storage buckets are created:
- ✅ `product-images` - For product photos
- ✅ `artisan-avatars` - For artisan profile pictures
- ✅ `category-images` - For category images

## 🔧 What's Been Updated

### Database Integration
- **Products Provider**: Now fetches from database with artisan relationships
- **Orders Provider**: Creates orders and order items in database
- **Wishlist Provider**: Syncs with database for authenticated users
- **Cart Provider**: Persists cart items in database
- **Auth Provider**: Fetches user profiles from database

### Key Features
- **Automatic User Profile Creation**: When users sign up, profiles are created automatically
- **Artisan Profile Management**: Users can become artisans and create products
- **Real-time Data**: All providers sync with Supabase database
- **Fallback Support**: Falls back to localStorage for guest users
- **Image Upload**: Product images are stored in Supabase Storage

## 🎯 How It Works

### User Flow
1. **Sign Up**: User creates account → Profile created in `users` table
2. **Become Artisan**: User can create artisan profile → `artisan_profiles` table
3. **Add Products**: Artisans can add products → `products` table with image upload
4. **Shopping**: Users can add to cart/wishlist → `cart_items`/`wishlist_items` tables
5. **Orders**: Checkout creates orders → `orders` and `order_items` tables

### Data Relationships
- Users have artisan profiles (one-to-one)
- Artisans create products (one-to-many)
- Users have orders (one-to-many)
- Orders have order items (one-to-many)
- Users have wishlist items (one-to-many)
- Users have cart items (one-to-many)

## 🔍 Testing the Integration

### 1. Test User Registration
- Sign up with email
- Check `users` table for new profile
- Verify user role is set to 'customer'

### 2. Test Product Creation
- Sign in as a user
- Go to dashboard → Add Product
- Check `products` table for new product
- Verify images are uploaded to storage

### 3. Test Shopping Features
- Add products to cart
- Check `cart_items` table
- Add products to wishlist
- Check `wishlist_items` table

### 4. Test Orders
- Place an order
- Check `orders` and `order_items` tables
- Verify order status updates work

## 🛠️ Troubleshooting

### Common Issues

1. **"Table doesn't exist" errors**
   - Make sure you ran the complete schema
   - Check table names match exactly

2. **Permission denied errors**
   - Verify RLS policies are enabled
   - Check user authentication status

3. **Image upload fails**
   - Verify storage buckets exist
   - Check storage policies are correct

4. **Data not syncing**
   - Check browser console for errors
   - Verify Supabase connection settings

### Debug Steps

1. Check Supabase logs in dashboard
2. Open browser dev tools → Console
3. Verify environment variables are set
4. Test database queries in SQL Editor

## 📊 Database Schema Overview

```
users (auth integration)
├── artisan_profiles (one-to-one)
├── products (one-to-many)
├── orders (one-to-many)
├── wishlist_items (one-to-many)
└── cart_items (one-to-many)

products
├── order_items (one-to-many)
├── wishlist_items (one-to-many)
└── cart_items (one-to-many)

orders
└── order_items (one-to-many)
```

## 🎉 You're All Set!

Your Fivoarana marketplace now has a fully functional database backend! All user actions are persisted, and the app will work seamlessly with real data.

### Next Steps
- Test all features thoroughly
- Add sample data if needed
- Configure any additional settings
- Deploy to production when ready

---

**Need Help?** Check the Supabase documentation or review the provider files for implementation details.

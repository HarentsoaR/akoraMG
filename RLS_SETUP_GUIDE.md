# 🔒 Row Level Security (RLS) Setup Guide

## The Problem
Your products are getting stuck because **Row Level Security (RLS)** is enabled on your Supabase tables, but there are no policies allowing users to insert data. This is a security feature that prevents unauthorized access.

## The Solution
You need to run the RLS policies in your Supabase SQL Editor. Here's how:

### Step 1: Go to Supabase Dashboard
1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**

### Step 2: Run the RLS Policies
Copy and paste this entire SQL script into the SQL Editor and run it:

```sql
-- Row Level Security (RLS) Policies for Fivoarana
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read all user profiles (for public profiles)
CREATE POLICY "Users can read all user profiles" ON public.users
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (handled by auth trigger)
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Artisan profiles policies
-- Anyone can read artisan profiles
CREATE POLICY "Anyone can read artisan profiles" ON public.artisan_profiles
  FOR SELECT USING (true);

-- Users can insert their own artisan profile
CREATE POLICY "Users can insert own artisan profile" ON public.artisan_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own artisan profile
CREATE POLICY "Users can update own artisan profile" ON public.artisan_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products table policies
-- Anyone can read products
CREATE POLICY "Anyone can read products" ON public.products
  FOR SELECT USING (true);

-- Users can insert their own products
CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own products
CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can delete their own products
CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = owner_id);

-- Orders table policies
-- Users can read their own orders
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
-- Users can read order items for their orders
CREATE POLICY "Users can read own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert order items for their orders
CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Reviews policies
-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

-- Users can insert reviews
CREATE POLICY "Users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist policies
-- Users can read their own wishlist
CREATE POLICY "Users can read own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert to their own wishlist
CREATE POLICY "Users can insert to own wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own wishlist
CREATE POLICY "Users can delete from own wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'customer',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Verify the Setup
After running the SQL, you should see:
- ✅ All policies created successfully
- ✅ RLS enabled on all tables
- ✅ User creation trigger set up

### Step 4: Test Product Creation
1. Go back to your app
2. Try adding a new product
3. Check the browser console for detailed logs
4. Check your Supabase dashboard → Table Editor → products

## What These Policies Do

### 🔓 **Public Access (Anyone can read)**
- User profiles (for public artisan profiles)
- Products (for the marketplace)
- Reviews (for product reviews)

### 🔒 **Authenticated User Access**
- Users can only insert/update/delete their own data
- Products: Only the owner can modify their products
- Orders: Users can only see their own orders
- Reviews: Users can only modify their own reviews

### 🚀 **Automatic User Creation**
- When someone signs up with Supabase Auth, a user profile is automatically created
- No manual user creation needed

## Security Benefits

✅ **Prevents unauthorized access** - Users can't see other users' private data
✅ **Prevents data tampering** - Users can't modify other users' products/orders
✅ **Maintains data integrity** - All operations are properly authenticated
✅ **Scalable security** - Works with any number of users

## Troubleshooting

If you still get RLS errors after running the policies:

1. **Check if policies were created:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'products';
   ```

2. **Check if RLS is enabled:**
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename IN ('users', 'products', 'orders');
   ```

3. **Verify user authentication:**
   - Make sure you're logged in to the app
   - Check browser console for session errors

## Next Steps

After setting up RLS:
1. **Test product creation** in your app
2. **Check the products table** in Supabase dashboard
3. **Test user registration** to ensure automatic profile creation
4. **Verify security** by trying to access other users' data (should be blocked)

The product insertion should now work perfectly! 🎉

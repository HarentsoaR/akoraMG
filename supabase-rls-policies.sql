-- Row Level Security (RLS) Policies for Fivoarana
-- Run this in your Supabase SQL Editor after running the main schema

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

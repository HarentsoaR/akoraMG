  -- Fivoarana Marketplace Database Schema
  -- Run this in your Supabase SQL Editor

  -- Enable necessary extensions
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Create custom types
  CREATE TYPE user_role AS ENUM ('customer', 'artisan');
  CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
  CREATE TYPE product_category AS ENUM (
    'Textiles', 
    'Wood Carving', 
    'Jewelry', 
    'Basketry', 
    'Pottery', 
    'Metalwork', 
    'Leather Goods', 
    'Stone Carving'
  );

  -- 1. Users table (extends auth.users)
  CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 2. Artisan profiles table
  CREATE TABLE public.artisan_profiles (
    id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    bio TEXT,
    location TEXT NOT NULL,
    years_experience INTEGER DEFAULT 0,
    crafts TEXT[] DEFAULT '{}',
    accepts_custom_orders BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    reviews_count INTEGER DEFAULT 0,
    products_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 3. Products table
  CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category product_category NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    original_price DECIMAL(10,2) CHECK (original_price IS NULL OR original_price >= price),
    images TEXT[] DEFAULT '{}',
    materials TEXT[] DEFAULT '{}',
    dimensions TEXT,
    weight TEXT,
    cultural_significance TEXT,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 1 CHECK (stock_quantity >= 0),
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 4. Orders table
  CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address JSONB,
    payment_method TEXT,
    payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 5. Order items table
  CREATE TABLE public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 6. Wishlist items table
  CREATE TABLE public.wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
  );

  -- 7. Cart items table
  CREATE TABLE public.cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK ((user_id IS NOT NULL AND session_id IS NULL) OR (user_id IS NULL AND session_id IS NOT NULL))
  );

  -- 8. Product reviews table
  CREATE TABLE public.product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
  );

  -- 9. Categories table
  CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes for performance
  CREATE INDEX idx_products_category ON public.products(category);
  CREATE INDEX idx_products_owner_id ON public.products(owner_id);
  CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
  CREATE INDEX idx_products_new ON public.products(is_new) WHERE is_new = true;
  CREATE INDEX idx_products_in_stock ON public.products(in_stock) WHERE in_stock = true;
  CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
  CREATE INDEX idx_products_rating ON public.products(rating DESC);

  CREATE INDEX idx_orders_user_id ON public.orders(user_id);
  CREATE INDEX idx_orders_status ON public.orders(status);
  CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

  CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
  CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

  CREATE INDEX idx_wishlist_user_id ON public.wishlist_items(user_id);
  CREATE INDEX idx_wishlist_product_id ON public.wishlist_items(product_id);

  CREATE INDEX idx_cart_user_id ON public.cart_items(user_id);
  CREATE INDEX idx_cart_session_id ON public.cart_items(session_id);
  CREATE INDEX idx_cart_product_id ON public.cart_items(product_id);

  CREATE INDEX idx_reviews_product_id ON public.product_reviews(product_id);
  CREATE INDEX idx_reviews_user_id ON public.product_reviews(user_id);

  -- Create updated_at trigger function
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Add updated_at triggers
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_artisan_profiles_updated_at BEFORE UPDATE ON public.artisan_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  -- Row Level Security (RLS) Policies
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

  -- Users policies
  CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
  CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

  -- Artisan profiles policies
  CREATE POLICY "Artisan profiles are viewable by everyone" ON public.artisan_profiles FOR SELECT USING (true);
  CREATE POLICY "Users can update own artisan profile" ON public.artisan_profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Users can insert own artisan profile" ON public.artisan_profiles FOR INSERT WITH CHECK (auth.uid() = id);

  -- Products policies
  CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
  CREATE POLICY "Artisans can manage own products" ON public.products FOR ALL USING (auth.uid() = owner_id);

  -- Orders policies
  CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
  CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

  -- Order items policies
  CREATE POLICY "Order items are viewable by order owner" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR user_id IS NULL))
  );
  CREATE POLICY "Order items can be created with orders" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR user_id IS NULL))
  );

  -- Wishlist policies
  CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);

  -- Cart policies
  CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

  -- Reviews policies
  CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (true);
  CREATE POLICY "Users can manage own reviews" ON public.product_reviews FOR ALL USING (auth.uid() = user_id);

  -- Categories policies
  CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

  -- Create storage buckets
  INSERT INTO storage.buckets (id, name, public) VALUES 
    ('product-images', 'product-images', true),
    ('artisan-avatars', 'artisan-avatars', true),
    ('category-images', 'category-images', true);

  -- Storage policies
  CREATE POLICY "Product images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
  CREATE POLICY "Product images can be uploaded by authenticated users" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
  CREATE POLICY "Product images can be updated by owners" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
  CREATE POLICY "Product images can be deleted by owners" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

  CREATE POLICY "Artisan avatars are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'artisan-avatars');
  CREATE POLICY "Artisan avatars can be uploaded by authenticated users" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'artisan-avatars' AND auth.role() = 'authenticated');

  CREATE POLICY "Category images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');

  -- Insert sample categories
  INSERT INTO public.categories (name, slug, description) VALUES
    ('Textiles', 'textiles', 'Traditional Malagasy textiles and fabrics'),
    ('Wood Carving', 'wood-carving', 'Hand-carved wooden items and sculptures'),
    ('Jewelry', 'jewelry', 'Traditional and modern jewelry pieces'),
    ('Basketry', 'basketry', 'Handwoven baskets and containers'),
    ('Pottery', 'pottery', 'Ceramic and clay pottery items'),
    ('Metalwork', 'metalwork', 'Metal crafts and decorative items'),
    ('Leather Goods', 'leather-goods', 'Leather accessories and items'),
    ('Stone Carving', 'stone-carving', 'Stone sculptures and carvings');

  -- Function to create user profile on signup
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.users (id, name, email, avatar_url)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Trigger to create user profile on signup
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  -- Function to update product count when products are added/removed
  CREATE OR REPLACE FUNCTION update_artisan_product_count()
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.artisan_profiles 
      SET products_count = products_count + 1 
      WHERE id = NEW.owner_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.artisan_profiles 
      SET products_count = GREATEST(0, products_count - 1) 
      WHERE id = OLD.owner_id;
      RETURN OLD;
    END IF;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

  -- Trigger to update product count
  CREATE TRIGGER update_artisan_product_count_trigger
    AFTER INSERT OR DELETE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_artisan_product_count();

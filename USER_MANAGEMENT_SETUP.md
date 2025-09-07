# User Management System Setup

## Overview
I've implemented a comprehensive user management system that automatically handles user registration, profile creation, and data synchronization between Supabase Auth and your application database.

## What's Been Implemented

### 1. User Service (`lib/services/user-service.ts`)
- **Automatic user profile creation** when users register/login
- **Handles existing users** without creating duplicates
- **Upsert functionality** - creates new users or updates existing ones
- **Artisan profile management** for users who want to sell products
- **Comprehensive error handling** and fallback mechanisms

### 2. Enhanced Auth Provider (`components/providers/auth-provider.tsx`)
- **Automatic user synchronization** on login/registration
- **Real-time user data updates** across the app
- **Artisan profile support** with dedicated state management
- **Profile update methods** for users to modify their information
- **Session persistence** - users stay logged in across browser sessions

### 3. User Profile Manager (`components/user/user-profile-manager.tsx`)
- **Complete profile management interface**
- **Edit user information** (name, avatar, etc.)
- **Create artisan profiles** for sellers
- **View artisan statistics** (ratings, products, reviews)
- **Role-based UI** showing different options for customers vs artisans

### 4. Enhanced Auth Callback (`app/auth/callback/page.tsx`)
- **Proper user synchronization** after authentication
- **Visual feedback** during the setup process
- **Error handling** with user-friendly messages
- **Automatic redirect** after successful setup

## Key Features

### ✅ Automatic User Registration
- When users sign in with email or Google, their profile is automatically created in your `users` table
- No duplicate users - existing users are updated instead of recreated
- Handles both new registrations and returning users seamlessly

### ✅ Data Synchronization
- User data is synced between Supabase Auth and your application database
- Real-time updates across all components
- Fallback to auth data if database sync fails

### ✅ Role Management
- Users start as "customers" by default
- Can upgrade to "artisan" role to sell products
- Role-based features and UI throughout the app

### ✅ Artisan Profiles
- Dedicated artisan profiles for sellers
- Track location, experience, crafts, ratings
- Custom order preferences
- Product and review statistics

### ✅ Session Persistence
- Users stay logged in across browser sessions
- Automatic re-authentication on app load
- No need to log in repeatedly

## Database Schema Requirements

Make sure your Supabase database has these tables (from `supabase-schema.sql`):

```sql
-- Users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artisan profiles table
CREATE TABLE public.artisan_profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  location TEXT NOT NULL,
  years_experience INTEGER DEFAULT 0,
  crafts TEXT[] DEFAULT '{}',
  accepts_custom_orders BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## How It Works

### 1. User Registration/Login
1. User signs in with email or Google
2. Supabase Auth handles authentication
3. Auth callback page processes the session
4. User profile is automatically created/updated in your database
5. User is redirected to the main app

### 2. Data Flow
```
Supabase Auth → UserService → Database → AuthProvider → UI Components
```

### 3. Session Management
- User data is cached in React state
- Automatic refresh on auth state changes
- Persistent sessions across browser restarts

## Testing the System

### 1. Test User Registration
1. Go to `/auth/login`
2. Enter an email or use Google sign-in
3. Check your Supabase dashboard → Table Editor → `users`
4. Verify the user was created with correct data

### 2. Test Profile Management
1. Go to `/profile` after logging in
2. Try editing your profile information
3. Create an artisan profile if desired
4. Verify changes are saved to the database

### 3. Test Session Persistence
1. Log in to the app
2. Close and reopen your browser
3. Refresh the page
4. Verify you're still logged in

## Environment Variables Required

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Benefits for Your Real Project

### ✅ No More Data Mismatches
- Single source of truth for user data
- Automatic synchronization prevents inconsistencies
- Proper error handling and fallbacks

### ✅ Seamless User Experience
- Users don't need to log in repeatedly
- Profile data persists across sessions
- Real-time updates across all components

### ✅ Scalable Architecture
- Clean separation of concerns
- Reusable user service
- Easy to extend with new features

### ✅ Production Ready
- Comprehensive error handling
- Fallback mechanisms
- Type-safe implementation
- Proper loading states and user feedback

## Next Steps

1. **Set up your Supabase environment variables**
2. **Run the database schema** in your Supabase SQL editor
3. **Test the user registration flow**
4. **Customize the user profile manager** as needed
5. **Add any additional user fields** you need for your project

The system is now ready for production use with proper user management, data persistence, and a great user experience! 🚀

# Supabase Setup Instructions

## The Problem
Your app is currently storing products in localStorage instead of Supabase because the environment variables are not configured. That's why you see products in your app but the Supabase table is empty.

## Solution

### 1. Create Environment File
Create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Create the file
touch .env.local
```

Add the following content to `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Up Your Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql` 
3. Run the SQL to create all tables

### 4. Test the Connection

After setting up the environment variables:

1. Restart your development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Try adding a new product - it should now be saved to Supabase instead of localStorage

3. Check your Supabase dashboard → **Table Editor** → **products** to see the new products

## What I Fixed

1. **Updated the products provider** to check for Supabase credentials
2. **Added proper Supabase integration** - products will now be saved to the database when credentials are available
3. **Maintained fallback behavior** - if Supabase isn't configured, it falls back to localStorage
4. **Added proper error handling** and logging

## Verification

Once you've set up the environment variables, you should see:
- Console logs showing "Attempting to add product to Supabase..."
- Products appearing in your Supabase products table
- No more localStorage fallback warnings

The app will work with or without Supabase configured, but with Supabase you get persistent data storage across sessions and devices.

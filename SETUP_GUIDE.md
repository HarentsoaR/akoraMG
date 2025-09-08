# Quick Setup Guide

## 🚀 Fix Authentication Issues

Your authentication is currently stuck because Supabase credentials are not configured. Here's how to fix it:

### 1. Create Environment File

Create a `.env.local` file in your project root:

```bash
touch .env.local
```

### 2. Add Supabase Credentials

Add these lines to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to create all tables

### 5. Restart Development Server

```bash
npm run dev
# or
pnpm dev
```

## ✅ What's Fixed

- **Better Error Messages**: Clear feedback when Supabase isn't configured
- **Timeout Protection**: Prevents infinite loading (10-second timeout)
- **Configuration Validation**: Checks for proper environment setup
- **Helpful UI**: Shows setup instructions when configuration is missing

## 🎯 After Setup

Once configured, your authentication flow will:
1. ✅ Process login redirects properly
2. ✅ Create user profiles in database
3. ✅ Handle both email and Google sign-in
4. ✅ Redirect to the main app after successful login

The authentication callback will no longer get stuck and will provide clear feedback about any issues.

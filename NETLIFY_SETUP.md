# Netlify Production Setup Guide

## 🚨 The Problem
Your app works locally but not in production because Netlify doesn't have access to your local `.env.local` file with Supabase credentials.

## ✅ Solution: Set Environment Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. **Go to your Netlify dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Find your site: `akoramg.netlify.app`

2. **Navigate to Site Settings**
   - Click on your site
   - Go to **Site settings** → **Environment variables**

3. **Add these environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

4. **Redeploy your site**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### Method 2: Netlify CLI (Alternative)

If you have Netlify CLI installed:

```bash
# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_project_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_supabase_anon_key"

# Redeploy
netlify deploy --prod
```

## 🔍 How to Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 What This Fixes

- ✅ Products will load in production
- ✅ Authentication will work
- ✅ Database operations will function
- ✅ User profiles will sync

## 🚀 After Setting Environment Variables

1. **Wait for deployment** (usually 2-3 minutes)
2. **Visit your site**: https://akoramg.netlify.app
3. **Check the debug panel** - it should show:
   - Supabase URL: Set
   - Supabase Key: Set
   - Products: 1 (or more)

## 🔧 Troubleshooting

If it still doesn't work after setting environment variables:

1. **Check the build logs** in Netlify dashboard
2. **Verify the environment variables** are exactly the same as local
3. **Check browser console** for any errors
4. **Ensure your Supabase project** allows connections from your domain

The debug component will help you verify everything is working correctly!

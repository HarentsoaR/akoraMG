"use client"

import { useProducts } from "@/components/providers/products-provider"
import { useAuth } from "@/components/providers/auth-provider"

export function DebugProducts() {
  const { products, loading } = useProducts()
  const { user } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>User: {user ? `${user.name} (${user.id})` : 'Not logged in'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Products: {products.length}</div>
        <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</div>
        <div>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>Site URL: {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</div>
        {products.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold">First Product:</div>
            <div>ID: {products[0].id}</div>
            <div>Name: {products[0].name}</div>
            <div>Category: {products[0].category}</div>
            <div>Artisan: {products[0].artisan.name}</div>
          </div>
        )}
      </div>
    </div>
  )
}

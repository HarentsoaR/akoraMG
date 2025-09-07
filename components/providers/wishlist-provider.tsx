"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "./auth-provider"

type WishItem = {
  id: number
  name: string
  image: string
  artisan: string
  price: number
  originalPrice?: number
  category: string
}

interface WishlistContextType {
  items: WishItem[]
  count: number
  isWished: (id: number) => boolean
  toggle: (item: WishItem) => void
  remove: (id: number) => void
  clear: () => void
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth() as any

  // Fetch wishlist from database
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        // Load from localStorage for guest users
        try {
          const raw = localStorage.getItem("wishlist")
          if (raw) setItems(JSON.parse(raw))
        } catch {}
        setLoading(false)
        return
      }

      try {
        // Check if wishlist_items table exists first
        const { data, error } = await supabase
          .from("wishlist_items")
          .select("id")
          .limit(1)

        if (error) {
          console.warn("Wishlist table not ready, using localStorage:", error.message)
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem("wishlist")
            if (raw) setItems(JSON.parse(raw))
          } catch {}
          setLoading(false)
          return
        }

        // If table exists, fetch wishlist items
        const { data: wishlistData, error: wishlistError } = await supabase
          .from("wishlist_items")
          .select(`
            product_id,
            products!inner(
              id,
              name,
              price,
              original_price,
              images,
              category
            )
          `)
          .eq("user_id", user.id)

        if (wishlistError) {
          console.warn("Error fetching wishlist items:", wishlistError.message)
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem("wishlist")
            if (raw) setItems(JSON.parse(raw))
          } catch {}
          setLoading(false)
          return
        }

        const mappedItems: WishItem[] = (wishlistData || []).map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          image: item.products.images[0] || "/placeholder.svg?height=300&width=400",
          artisan: "Artisan", // Fallback since we're not joining artisan data
          price: item.products.price,
          originalPrice: item.products.original_price,
          category: item.products.category,
        }))

        setItems(mappedItems)
      } catch (e) {
        console.warn("Database not ready, using localStorage:", e)
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem("wishlist")
          if (raw) setItems(JSON.parse(raw))
        } catch {}
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user?.id])

  // Persist to localStorage for guest users
  useEffect(() => {
    if (!user?.id) {
      try {
        localStorage.setItem("wishlist", JSON.stringify(items))
      } catch {}
    }
  }, [items, user?.id])

  const isWished = (id: number) => items.some((i) => i.id === id)

  const toggle = async (item: WishItem) => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [item, ...prev]))
      return
    }

    try {
      if (isWished(item.id)) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", item.id)

        if (error) throw error
        setItems((prev) => prev.filter((i) => i.id !== item.id))
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlist_items")
          .insert({
            user_id: user.id,
            product_id: item.id,
          })

        if (error) throw error
        setItems((prev) => [item, ...prev])
      }
    } catch (e) {
      console.error("Toggle wishlist failed", e)
    }
  }

  const remove = async (id: number) => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }

    try {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id)

      if (error) throw error
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (e) {
      console.error("Remove from wishlist failed", e)
    }
  }

  const clear = async () => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems([])
      return
    }

    try {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)

      if (error) throw error
      setItems([])
    } catch (e) {
      console.error("Clear wishlist failed", e)
    }
  }

  const value: WishlistContextType = useMemo(
    () => ({ items, count: items.length, isWished, toggle, remove, clear, loading }),
    [items, loading]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}



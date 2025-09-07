"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "./auth-provider"

type CartItem = {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  artisan: string
  stockQuantity?: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth() as any

  // Fetch cart from database
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        // Load from localStorage for guest users
        try {
          const raw = localStorage.getItem("cart")
          if (raw) setItems(JSON.parse(raw))
        } catch {}
        setLoading(false)
        return
      }

      try {
        // Check if cart_items table exists first
        const { data, error } = await supabase
          .from("cart_items")
          .select("id")
          .limit(1)

        if (error) {
          console.warn("Cart table not ready, using localStorage:", error.message)
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem("cart")
            if (raw) setItems(JSON.parse(raw))
          } catch {}
          setLoading(false)
          return
        }

        // If table exists, fetch cart items
        const { data: cartData, error: cartError } = await supabase
          .from("cart_items")
          .select(`
            product_id,
            quantity,
            products!inner(
              id,
              name,
              price,
              original_price,
              images,
              in_stock,
              stock_quantity
            )
          `)
          .eq("user_id", user.id)

        if (cartError) {
          console.warn("Error fetching cart items:", cartError.message)
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem("cart")
            if (raw) setItems(JSON.parse(raw))
          } catch {}
          setLoading(false)
          return
        }

        const mappedItems: CartItem[] = (cartData || []).map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          originalPrice: item.products.original_price,
          image: item.products.images[0] || "/placeholder.svg?height=300&width=400",
          artisan: "Artisan", // Fallback since we're not joining artisan data
          stockQuantity: item.products.stock_quantity,
          quantity: item.quantity,
        }))

        setItems(mappedItems)
      } catch (e) {
        console.warn("Database not ready, using localStorage:", e)
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem("cart")
          if (raw) setItems(JSON.parse(raw))
        } catch {}
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user?.id])

  // Persist to localStorage for guest users
  useEffect(() => {
    if (!user?.id) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch {}
    }
  }, [items, user?.id])

  const addItem: CartContextType["addItem"] = async (item, quantity = 1) => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems((prev) => {
        const existing = prev.find((p) => p.id === item.id)
        const nextQty = Math.max(1, Math.min((item.stockQuantity ?? 9999), (existing?.quantity ?? 0) + quantity))
        if (existing) {
          return prev.map((p) => (p.id === item.id ? { ...p, quantity: nextQty } : p))
        }
        return [...prev, { ...item, quantity: Math.max(1, Math.min(item.stockQuantity ?? 9999, quantity)) }]
      })
      return
    }

    try {
      const existing = items.find((p) => p.id === item.id)
      const nextQty = Math.max(1, Math.min((item.stockQuantity ?? 9999), (existing?.quantity ?? 0) + quantity))

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: nextQty })
          .eq("user_id", user.id)
          .eq("product_id", item.id)

        if (error) throw error
        setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, quantity: nextQty } : p)))
      } else {
        // Add new item
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: item.id,
            quantity: Math.max(1, Math.min(item.stockQuantity ?? 9999, quantity)),
          })

        if (error) throw error
        setItems((prev) => [...prev, { ...item, quantity: Math.max(1, Math.min(item.stockQuantity ?? 9999, quantity)) }])
      }
    } catch (e) {
      console.error("Add to cart failed", e)
    }
  }

  const removeItem: CartContextType["removeItem"] = async (id) => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems((prev) => prev.filter((p) => p.id !== id))
      return
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id)

      if (error) throw error
      setItems((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error("Remove from cart failed", e)
    }
  }

  const updateQuantity: CartContextType["updateQuantity"] = async (id, quantity) => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, Math.min(p.stockQuantity ?? 9999, quantity)) } : p)))
      return
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: Math.max(1, quantity) })
        .eq("user_id", user.id)
        .eq("product_id", id)

      if (error) throw error
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, Math.min(p.stockQuantity ?? 9999, quantity)) } : p)))
    } catch (e) {
      console.error("Update cart quantity failed", e)
    }
  }

  const clearCart = async () => {
    if (!user?.id) {
      // Guest user - use localStorage
      setItems([])
      return
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)

      if (error) throw error
      setItems([])
    } catch (e) {
      console.error("Clear cart failed", e)
    }
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}



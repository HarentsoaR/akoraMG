"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      const nextQty = Math.max(1, Math.min((item.stockQuantity ?? 9999), (existing?.quantity ?? 0) + quantity))
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: nextQty } : p))
      }
      return [...prev, { ...item, quantity: Math.max(1, Math.min(item.stockQuantity ?? 9999, quantity)) }]
    })
  }

  const removeItem: CartContextType["removeItem"] = (id) => setItems((prev) => prev.filter((p) => p.id !== id))

  const updateQuantity: CartContextType["updateQuantity"] = (id, quantity) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, Math.min(p.stockQuantity ?? 9999, quantity)) } : p)))

  const clearCart = () => setItems([])

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
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}



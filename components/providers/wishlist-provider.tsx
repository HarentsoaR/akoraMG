"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

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
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items))
    } catch {}
  }, [items])

  const isWished = (id: number) => items.some((i) => i.id === id)
  const toggle = (item: WishItem) =>
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [item, ...prev]))
  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  const value: WishlistContextType = useMemo(
    () => ({ items, count: items.length, isWished, toggle, remove, clear }),
    [items]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}



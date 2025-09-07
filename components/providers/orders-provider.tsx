"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useProducts } from "./products-provider"
import { useAuth } from "../providers/auth-provider"

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
  productId: number
  name: string
  image: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  customer: { id: string; name: string; email: string }
  createdAt: string
}

interface OrdersContextType {
  orders: Order[]
  placeOrder: (items: OrderItem[]) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
}

const STORAGE_KEY = "orders"

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { products } = useProducts()
  const { user } = useAuth() as any
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setOrders(JSON.parse(raw))
        return
      }
    } catch {}
    // Seed example orders
    const seedItems: OrderItem[] = products.slice(0, 2).map((p, i) => ({
      productId: p.id,
      name: p.name,
      image: p.images[0] || "/placeholder.svg?height=300&width=400",
      price: p.price,
      quantity: i + 1,
    }))
    const subtotal = seedItems.reduce((s, it) => s + it.price * it.quantity, 0)
    const shipping = 10000
    const example: Order = {
      id: `${Date.now() - 86400000}`,
      items: seedItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "paid",
      customer: { id: "1", name: "Rasoa Andry", email: "rasoa@fivoarana.mg" },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
    setOrders([example])
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {}
  }, [orders])

  const placeOrder: OrdersContextType["placeOrder"] = (items) => {
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const shipping = subtotal > 100000 ? 0 : 10000
    const order: Order = {
      id: `${Date.now()}`,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "pending",
      customer: user || { id: "guest", name: "Guest", email: "guest@example.com" },
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const updateOrderStatus: OrdersContextType["updateOrderStatus"] = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))

  const value: OrdersContextType = useMemo(() => ({ orders, placeOrder, updateOrderStatus }), [orders])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}



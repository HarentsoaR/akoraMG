"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useProducts } from "./products-provider"
import { useAuth } from "../providers/auth-provider"
import { supabase } from "@/lib/supabase/client"

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
  placeOrder: (items: OrderItem[]) => Promise<Order | null>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
}

const STORAGE_KEY = "orders"

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { products } = useProducts()
  const { user } = useAuth() as any
  const [orders, setOrders] = useState<Order[]>([])

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        // Load from localStorage for guest users
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) {
            setOrders(JSON.parse(raw))
            return
          }
        } catch {}
        return
      }

      try {
        // Check if orders table exists first
        const { data: testData, error: testError } = await supabase
          .from("orders")
          .select("id")
          .limit(1)

        if (testError) {
          console.warn("Orders table not ready, using localStorage:", testError.message)
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              setOrders(JSON.parse(raw))
            }
          } catch {}
          return
        }

        // If table exists, fetch orders
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            user_id,
            status,
            subtotal,
            shipping,
            total,
            customer_name,
            customer_email,
            created_at,
            order_items (
              id,
              product_id,
              product_name,
              product_image,
              price,
              quantity
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.warn("Error fetching orders:", error.message)
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              setOrders(JSON.parse(raw))
            }
          } catch {}
          return
        }

        const mappedOrders: Order[] = (data || []).map((order: any) => ({
          id: String(order.id),
          items: order.order_items.map((item: any) => ({
            productId: item.product_id,
            name: item.product_name,
            image: item.product_image,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          status: order.status,
          customer: {
            id: order.user_id || "guest",
            name: order.customer_name,
            email: order.customer_email,
          },
          createdAt: order.created_at,
        }))

        setOrders(mappedOrders)
      } catch (e) {
        console.warn("Database not ready, using localStorage:", e)
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) {
            setOrders(JSON.parse(raw))
          }
        } catch {}
      }
    }

    fetchOrders()
  }, [user?.id])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {}
  }, [orders])

  const placeOrder: OrdersContextType["placeOrder"] = async (items) => {
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const shipping = subtotal > 100000 ? 0 : 10000
    const total = subtotal + shipping

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          subtotal,
          shipping,
          total,
          status: "pending" as OrderStatus,
          customer_name: user?.name || "Guest",
          customer_email: user?.email || "guest@example.com",
        })
        .select("id")
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Fetch complete order with items
      const { data: completeOrder, error: fetchError } = await supabase
        .from("orders")
        .select(`
          id,
          user_id,
          status,
          subtotal,
          shipping,
          total,
          customer_name,
          customer_email,
          created_at,
          order_items (
            id,
            product_id,
            product_name,
            product_image,
            price,
            quantity
          )
        `)
        .eq("id", orderData.id)
        .single()

      if (fetchError) throw fetchError

      const mapped: Order = {
        id: String(completeOrder.id),
        items: completeOrder.order_items.map((item: any) => ({
          productId: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: completeOrder.subtotal,
        shipping: completeOrder.shipping,
        total: completeOrder.total,
        status: completeOrder.status,
        customer: {
          id: completeOrder.user_id || "guest",
          name: completeOrder.customer_name,
          email: completeOrder.customer_email,
        },
        createdAt: completeOrder.created_at,
      }

      setOrders((prev) => [mapped, ...prev])
      return mapped
    } catch (e) {
      console.error("placeOrder failed", e)
      // Fallback to local storage
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
  }

  const updateOrderStatus: OrdersContextType["updateOrderStatus"] = async (id, status) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", Number(id))
      
      if (error) throw error
      
      // Update local state
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch (e) {
      console.error("updateOrderStatus failed", e)
    }
  }

  const value: OrdersContextType = useMemo(() => ({ orders, placeOrder, updateOrderStatus }), [orders])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}



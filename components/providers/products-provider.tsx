"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { PRODUCTS, type ProductData } from "@/lib/data/products"
import { ARTISANS } from "@/lib/data/artisans"

export type ProductExt = ProductData & { createdBy?: string; createdAt?: string }

type NewProductInput = {
  name: string
  category: ProductData["category"] | string
  price: number
  originalPrice?: number
  images: string[]
  artisanName?: string
  artisanLocation?: string
  rating?: number
  reviews?: number
  materials: string[]
  inStock: boolean
  createdBy?: string
}

interface ProductsContextType {
  products: ProductExt[]
  addProduct: (input: NewProductInput) => number
  updateProduct: (id: number, patch: Partial<ProductExt>) => void
  deleteProduct: (id: number) => void
  getById: (id: number) => ProductExt | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const STORAGE_KEY = "custom-products"

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [customProducts, setCustomProducts] = useState<ProductExt[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCustomProducts(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customProducts))
    } catch {}
  }, [customProducts])

  const products: ProductExt[] = useMemo(() => [...customProducts, ...PRODUCTS], [customProducts])

  const addProduct = useCallback((input: NewProductInput) => {
    const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const fallbackArtisan = ARTISANS[0]
    const artisan = {
      name: input.artisanName || fallbackArtisan.name,
      location: input.artisanLocation || fallbackArtisan.location,
    }

    const newProduct: ProductExt = {
      id: nextId,
      name: input.name,
      category: (typeof input.category === "string" ? (input.category as any) : input.category) as ProductData["category"],
      price: input.price,
      originalPrice: input.originalPrice,
      images: input.images.length > 0 ? input.images : ["/placeholder.svg?height=300&width=400"],
      artisan,
      rating: input.rating ?? 0,
      reviews: input.reviews ?? 0,
      isNew: true,
      isFeatured: false,
      materials: input.materials,
      inStock: input.inStock,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    }

    setCustomProducts((prev) => [newProduct, ...prev])
    return nextId
  }, [products])

  const updateProduct = useCallback((id: number, patch: Partial<ProductExt>) => {
    setCustomProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deleteProduct = useCallback((id: number) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getById = useCallback((id: number) => products.find((p) => p.id === id), [products])

  const value: ProductsContextType = { products, addProduct, updateProduct, deleteProduct, getById }

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider")
  return ctx
}



"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { PRODUCTS, type ProductData } from "@/lib/data/products"
import { ARTISANS } from "@/lib/data/artisans"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "../providers/auth-provider"

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
  addProduct: (input: NewProductInput) => Promise<number>
  updateProduct: (id: number, patch: Partial<ProductExt>) => void
  deleteProduct: (id: number) => Promise<void>
  getById: (id: number) => ProductExt | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const STORAGE_KEY = "custom-products"

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [customProducts, setCustomProducts] = useState<ProductExt[]>([])
  const [remoteProducts, setRemoteProducts] = useState<ProductExt[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useAuth() as any

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

  const products: ProductExt[] = useMemo(() => {
    // Always show custom products first, then remote products, then fallback to PRODUCTS
    const base = remoteProducts.length > 0 ? remoteProducts : PRODUCTS
    const allProducts = [...customProducts, ...base]
    console.log("Products updated:", { customProducts: customProducts.length, remoteProducts: remoteProducts.length, total: allProducts.length })
    return allProducts
  }, [customProducts, remoteProducts])

  // Fetch products from Supabase with artisan data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First, try a simple query to check if products table exists
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            owner_id,
            name,
            description,
            category,
            price,
            original_price,
            images,
            materials,
            dimensions,
            weight,
            cultural_significance,
            in_stock,
            stock_quantity,
            is_new,
            is_featured,
            rating,
            reviews_count,
            created_at,
            updated_at
          `)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Database error:", error)
          throw error
        }
        
        // If we have products, try to get artisan data for each
        const mapped: ProductExt[] = []
        
        for (const product of data || []) {
          let artisanName = ""
          let artisanLocation = ""
          
          // Try to get artisan profile data
          try {
            const { data: artisanData } = await supabase
              .from("artisan_profiles")
              .select(`
                location,
                users!inner(
                  name
                )
              `)
              .eq("id", product.owner_id)
              .single()
            
            if (artisanData) {
              artisanName = artisanData.users?.name || ""
              artisanLocation = artisanData.location || ""
            }
          } catch (artisanError) {
            // If artisan profile doesn't exist, use fallback
            console.warn("No artisan profile found for product", product.id)
          }
          
          mapped.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.original_price ?? undefined,
            images: product.images ?? [],
            artisan: { 
              name: artisanName, 
              location: artisanLocation 
            },
            rating: product.rating ?? 0,
            reviews: product.reviews_count ?? 0,
            isNew: product.is_new ?? false,
            isFeatured: product.is_featured ?? false,
            materials: product.materials ?? [],
            inStock: product.in_stock ?? true,
            createdBy: product.owner_id ?? undefined,
            createdAt: product.created_at ?? undefined,
          })
        }
        
        setRemoteProducts(mapped)
      } catch (e) {
        console.error("Fetch products failed", e)
        // Fallback to local data if database fails
        setRemoteProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addProduct = useCallback(async (input: NewProductInput) => {
    console.log("addProduct called with:", input)
    console.log("User:", user)
    
    if (!user?.id) {
      console.error("User must be authenticated to add products")
      return 0
    }

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === "" || supabaseKey === "") {
      console.warn("Supabase not configured, using local storage fallback")
      
      // Fallback to local storage
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
      
      console.log("Adding product to customProducts:", newProduct)
      setCustomProducts((prev) => {
        const updated = [newProduct, ...prev]
        console.log("Updated customProducts:", updated.length)
        return updated
      })
      
      return nextId
    }

    // Try to add to Supabase first
    try {
      console.log("Attempting to add product to Supabase...")
      console.log("User ID:", user.id)
      console.log("User email:", user.email)
      console.log("Product data:", {
        name: input.name,
        category: input.category,
        price: input.price,
        materials: input.materials
      })

      // First test the connection and check if user exists in our database
      console.log("Testing database connection...")
      const { data: testData, error: testError } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("id", user.id)
        .single()

      if (testError) {
        console.error("User not found in database:", testError)
        throw new Error(`User not found in database: ${testError.message}`)
      }

      console.log("User found in database:", testData)

      // Safety: enforce enum-compatible category value
      const categoryValue = (typeof input.category === "string" ? (input.category as any) : input.category) as ProductData["category"]

      console.log("Inserting product with category:", categoryValue)

      // Get the current session to ensure we're authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error("No active session found:", sessionError)
        throw new Error("You must be logged in to add products")
      }

      console.log("Using authenticated session for user:", session.user.email)

      const { data, error } = await supabase
        .from("products")
        .insert({
          owner_id: user.id,
          name: input.name,
          description: `Beautiful ${input.name} crafted by ${input.artisanName || "local artisan"}`,
          category: categoryValue,
          price: input.price,
          original_price: input.originalPrice || null,
          images: input.images.length > 0 ? input.images : ["/placeholder.svg?height=300&width=400"],
          materials: input.materials,
          in_stock: input.inStock,
          stock_quantity: input.inStock ? 1 : 0,
          is_new: true,
          is_featured: false,
          rating: input.rating || 0,
          reviews_count: input.reviews || 0,
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase insert error:", error)
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      console.log("Successfully added product to Supabase:", data)

      // Optimistically map and prepend the new product without refetching all
      let artisanName = ""
      let artisanLocation = ""
      try {
        const { data: artisanData } = await supabase
          .from("artisan_profiles")
          .select(`
            location,
            users!inner(
              name
            )
          `)
          .eq("id", data.owner_id)
          .single()
        if (artisanData) {
          artisanName = (artisanData as any).users?.name || ""
          artisanLocation = (artisanData as any).location || ""
        }
      } catch (artisanError) {
        console.warn("No artisan profile found for new product", data.id)
      }

      const mappedNew: ProductExt = {
        id: data.id,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        originalPrice: data.original_price ?? undefined,
        images: data.images ?? [],
        artisan: { name: artisanName, location: artisanLocation },
        rating: Number(data.rating ?? 0),
        reviews: Number(data.reviews_count ?? 0),
        isNew: Boolean(data.is_new ?? true),
        isFeatured: Boolean(data.is_featured ?? false),
        materials: data.materials ?? [],
        inStock: Boolean(data.in_stock ?? true),
        createdBy: data.owner_id ?? undefined,
        createdAt: data.created_at ?? undefined,
      }

      setRemoteProducts((prev) => [mappedNew, ...prev])

      return data.id
    } catch (error) {
      console.error("Failed to add product to Supabase, falling back to local storage:", error)
      
      // Fallback to local storage
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
      
      console.log("Adding product to customProducts as fallback:", newProduct)
      setCustomProducts((prev) => {
        const updated = [newProduct, ...prev]
        console.log("Updated customProducts:", updated.length)
        return updated
      })
      
      return nextId
    }
  }, [user, products])

  const updateProduct = useCallback((id: number, patch: Partial<ProductExt>) => {
    setCustomProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deleteProduct = useCallback(async (id: number) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      // Update local state
      setCustomProducts((prev) => prev.filter((p) => p.id !== id))
      setRemoteProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error("deleteProduct failed", e)
    }
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

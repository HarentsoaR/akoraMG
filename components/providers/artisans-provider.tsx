"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"

export type Artisan = {
  id: string
  name: string
  avatar?: string
  location: string
  rating: number
  reviews: number
  crafts: string[]
  productsCount: number
  yearsExperience: number
  featured?: boolean
  acceptsCustomOrders?: boolean
  bio?: string
  email?: string
  createdAt: string
  updatedAt: string
}

type ArtisansContextType = {
  artisans: Artisan[]
  loading: boolean
  error: string | null
  featuredArtisans: Artisan[]
  getArtisanById: (id: string) => Artisan | undefined
  refreshArtisans: () => Promise<void>
}

const ArtisansContext = createContext<ArtisansContextType | undefined>(undefined)

export function ArtisansProvider({ children }: { children: ReactNode }) {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const fetchArtisans = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch artisans with their profiles
      const { data: artisansData, error: artisansError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar_url,
          created_at,
          updated_at,
          role,
          artisan_profiles (
            bio,
            location,
            years_experience,
            crafts,
            accepts_custom_orders,
            featured,
            rating,
            reviews_count,
            products_count
          )
        `)
        .not('artisan_profiles', 'is', null)
        .order('created_at', { ascending: false })

      if (artisansError) {
        throw artisansError
      }

      // Transform the data to match our Artisan type
      const transformedArtisans: Artisan[] = artisansData?.filter(user => user.artisan_profiles).map((user) => {
        const profile = user.artisan_profiles
        
        // Add some default crafts if none exist
        const defaultCrafts = ['Handmade', 'Traditional', 'Craft']
        const crafts = profile.crafts && profile.crafts.length > 0 ? profile.crafts : defaultCrafts
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar_url || '/placeholder-user.jpg',
          location: profile.location || 'Unknown',
          rating: Number(profile.rating) || 0,
          reviews: profile.reviews_count || 0,
          crafts: crafts,
          productsCount: profile.products_count || 0,
          yearsExperience: profile.years_experience || 0,
          featured: profile.featured || false,
          acceptsCustomOrders: profile.accepts_custom_orders || false,
          bio: profile.bio || 'Talented artisan creating beautiful handmade items.',
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }
      }) || []

      setArtisans(transformedArtisans)
    } catch (err) {
      console.error('Error fetching artisans:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch artisans')
    } finally {
      setLoading(false)
    }
  }

  const refreshArtisans = async () => {
    await fetchArtisans()
  }

  const getArtisanById = (id: string): Artisan | undefined => {
    return artisans.find(artisan => artisan.id === id)
  }

  const featuredArtisans = artisans.filter(artisan => artisan.featured)

  useEffect(() => {
    fetchArtisans()
  }, [])

  const value: ArtisansContextType = {
    artisans,
    loading,
    error,
    featuredArtisans,
    getArtisanById,
    refreshArtisans,
  }

  return (
    <ArtisansContext.Provider value={value}>
      {children}
    </ArtisansContext.Provider>
  )
}

export function useArtisans() {
  const context = useContext(ArtisansContext)
  if (context === undefined) {
    throw new Error('useArtisans must be used within an ArtisansProvider')
  }
  return context
}

"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { UserService, type UserProfile, type ArtisanProfile } from "@/lib/services/user-service"

interface User {
  id: string
  name: string
  email: string
  role: "artisan" | "customer"
  avatar?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  artisanProfile: ArtisanProfile | null
  isLoading: boolean
  signInWithEmail: (email: string) => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<{ error?: string }>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>
  createArtisanProfile: (artisanData: {
    bio?: string
    location: string
    years_experience?: number
    crafts?: string[]
    accepts_custom_orders?: boolean
  }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [artisanProfile, setArtisanProfile] = useState<ArtisanProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to sync user data
  const syncUserData = async (authUser: any) => {
    try {
      console.log("Syncing user data for:", authUser.email)
      
      // Create or update user profile in our database
      const userProfile = await UserService.createOrUpdateUserProfile(authUser)
      
      if (userProfile) {
        setUser({
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
          avatar: userProfile.avatar_url,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at,
        })

        // If user is an artisan, fetch their artisan profile
        if (userProfile.role === "artisan") {
          const artisanProfile = await UserService.getArtisanProfile(userProfile.id)
          setArtisanProfile(artisanProfile)
        } else {
          setArtisanProfile(null)
        }
      } else {
        // Fallback to auth user data if database sync fails
        console.warn("Failed to sync user data, using auth fallback")
        setUser({
          id: authUser.id,
          name: (authUser.user_metadata as any)?.full_name || authUser.email || "",
          email: authUser.email || "",
          role: "customer",
          avatar: (authUser.user_metadata as any)?.avatar_url,
        })
        setArtisanProfile(null)
      }
    } catch (error) {
      console.error("Error syncing user data:", error)
      // Fallback to auth user data
      setUser({
        id: authUser.id,
        name: (authUser.user_metadata as any)?.full_name || authUser.email || "",
        email: authUser.email || "",
        role: "customer",
        avatar: (authUser.user_metadata as any)?.avatar_url,
      })
      setArtisanProfile(null)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          await syncUserData(data.user)
        }
      } catch (error) {
        console.error("Error during auth initialization:", error)
      } finally {
        setIsLoading(false)
      }
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      
      if (session?.user) {
        await syncUserData(session.user)
      } else {
        setUser(null)
        setArtisanProfile(null)
      }
    })
    
    return () => sub.subscription.unsubscribe()
  }, [])

  const signInWithEmail: AuthContextType["signInWithEmail"] = async (email) => {
    try {
      // Prefer configured site URL for magic link redirects
      const base = (process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
        .replace(/\/$/, '')
      const redirectUrl = `${base}/auth/callback`
      
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { emailRedirectTo: redirectUrl } 
      })
      if (error) return { error: error.message }
      return {}
    } catch (e: any) {
      return { error: e.message }
    }
  }

  const signInWithGoogle: AuthContextType["signInWithGoogle"] = async () => {
    try {
      // Prefer configured site URL for OAuth redirects
      const base = (process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
        .replace(/\/$/, '')
      const redirectUrl = `${base}/auth/callback`
      
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google", 
        options: { redirectTo: redirectUrl } 
      })
      if (error) return { error: error.message }
      return {}
    } catch (e: any) {
      return { error: e.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setArtisanProfile(null)
  }

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const updatedProfile = await UserService.updateUserProfile(user.id, updates)
      if (updatedProfile) {
        setUser({
          id: updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          role: updatedProfile.role,
          avatar: updatedProfile.avatar_url,
          created_at: updatedProfile.created_at,
          updated_at: updatedProfile.updated_at,
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to update user profile:", error)
      return false
    }
  }

  const createArtisanProfile = async (artisanData: {
    bio?: string
    location: string
    years_experience?: number
    crafts?: string[]
    accepts_custom_orders?: boolean
  }): Promise<boolean> => {
    if (!user) return false
    
    try {
      // First update user role to artisan
      const roleUpdated = await updateUserProfile({ role: "artisan" })
      if (!roleUpdated) return false

      // Create artisan profile
      const artisanProfile = await UserService.createArtisanProfile(user.id, artisanData)
      if (artisanProfile) {
        setArtisanProfile(artisanProfile)
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to create artisan profile:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        artisanProfile,
        isLoading, 
        signInWithEmail, 
        signInWithGoogle, 
        logout,
        updateUserProfile,
        createArtisanProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

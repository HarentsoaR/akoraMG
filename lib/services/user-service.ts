import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: "customer" | "artisan"
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface ArtisanProfile {
  id: string
  bio?: string
  location: string
  years_experience: number
  crafts: string[]
  accepts_custom_orders: boolean
  featured: boolean
  rating: number
  reviews_count: number
  products_count: number
  created_at?: string
  updated_at?: string
}

export class UserService {
  /**
   * Create or update user profile in our database
   * This handles both new registrations and existing users
   */
  static async createOrUpdateUserProfile(authUser: User): Promise<UserProfile | null> {
    try {
      console.log("Creating/updating user profile for:", authUser.email)

      // Extract user data from auth user
      const userData = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || 
              authUser.user_metadata?.name || 
              authUser.email?.split('@')[0] || 
              'User',
        email: authUser.email || '',
        role: (authUser.user_metadata?.role as "customer" | "artisan") || "customer",
        avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
      }

      // Use upsert to handle both insert and update
      const { data, error } = await supabase
        .from("users")
        .upsert(userData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating/updating user profile:", error)
        return null
      }

      console.log("User profile created/updated successfully:", data)
      return data
    } catch (error) {
      console.error("Failed to create/update user profile:", error)
      return null
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      return null
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        console.error("Error updating user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Failed to update user profile:", error)
      return null
    }
  }

  /**
   * Create artisan profile for users with artisan role
   */
  static async createArtisanProfile(userId: string, artisanData: {
    bio?: string
    location: string
    years_experience?: number
    crafts?: string[]
    accepts_custom_orders?: boolean
  }): Promise<ArtisanProfile | null> {
    try {
      const profileData = {
        id: userId,
        bio: artisanData.bio || "",
        location: artisanData.location,
        years_experience: artisanData.years_experience || 0,
        crafts: artisanData.crafts || [],
        accepts_custom_orders: artisanData.accepts_custom_orders || false,
        featured: false,
        rating: 0.00,
        reviews_count: 0,
        products_count: 0,
      }

      const { data, error } = await supabase
        .from("artisan_profiles")
        .upsert(profileData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating artisan profile:", error)
        return null
      }

      console.log("Artisan profile created successfully:", data)
      return data
    } catch (error) {
      console.error("Failed to create artisan profile:", error)
      return null
    }
  }

  /**
   * Get artisan profile by user ID
   */
  static async getArtisanProfile(userId: string): Promise<ArtisanProfile | null> {
    try {
      const { data, error } = await supabase
        .from("artisan_profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching artisan profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Failed to fetch artisan profile:", error)
      return null
    }
  }

  /**
   * Check if user exists in our database
   */
  static async userExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single()

      return !error && !!data
    } catch (error) {
      return false
    }
  }

  /**
   * Get user with artisan profile (if exists)
   */
  static async getUserWithArtisanProfile(userId: string): Promise<{
    user: UserProfile
    artisanProfile?: ArtisanProfile
  } | null> {
    try {
      // Get user profile
      const user = await this.getUserProfile(userId)
      if (!user) return null

      // Get artisan profile if user is an artisan
      let artisanProfile: ArtisanProfile | null = null
      if (user.role === "artisan") {
        artisanProfile = await this.getArtisanProfile(userId)
      }

      return {
        user,
        artisanProfile: artisanProfile || undefined
      }
    } catch (error) {
      console.error("Failed to get user with artisan profile:", error)
      return null
    }
  }

  /**
   * Delete user and all related data
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete from users table (this will cascade to artisan_profiles and products)
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId)

      if (error) {
        console.error("Error deleting user:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Failed to delete user:", error)
      return false
    }
  }
}

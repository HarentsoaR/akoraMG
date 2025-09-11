import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

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
        artisan_profiles!inner (
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
      .eq('role', 'artisan')
      .order('created_at', { ascending: false })

    if (artisansError) {
      throw artisansError
    }

    // Transform the data to match our Artisan type
    const transformedArtisans = artisansData?.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url || '/placeholder-user.jpg',
      location: user.artisan_profiles.location,
      rating: Number(user.artisan_profiles.rating) || 0,
      reviews: user.artisan_profiles.reviews_count || 0,
      crafts: user.artisan_profiles.crafts || [],
      productsCount: user.artisan_profiles.products_count || 0,
      yearsExperience: user.artisan_profiles.years_experience || 0,
      featured: user.artisan_profiles.featured || false,
      acceptsCustomOrders: user.artisan_profiles.accepts_custom_orders || false,
      bio: user.artisan_profiles.bio || '',
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    })) || []

    return NextResponse.json({ artisans: transformedArtisans })
  } catch (error) {
    console.error('Error fetching artisans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artisans' },
      { status: 500 }
    )
  }
}

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Fetch artisan with their profile and products
    const { data: artisanData, error: artisanError } = await supabase
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
      .eq('id', id)
      .eq('role', 'artisan')
      .single()

    if (artisanError) {
      if (artisanError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artisan not found' },
          { status: 404 }
        )
      }
      throw artisanError
    }

    // Fetch artisan's products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        category,
        price,
        original_price,
        images,
        materials,
        in_stock,
        is_new,
        is_featured,
        rating,
        reviews_count,
        created_at
      `)
      .eq('owner_id', id)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(12)

    if (productsError) {
      console.error('Error fetching artisan products:', productsError)
    }

    // Transform the data
    const artisan = {
      id: artisanData.id,
      name: artisanData.name,
      email: artisanData.email,
      avatar: artisanData.avatar_url || '/placeholder-user.jpg',
      location: artisanData.artisan_profiles.location,
      rating: Number(artisanData.artisan_profiles.rating) || 0,
      reviews: artisanData.artisan_profiles.reviews_count || 0,
      crafts: artisanData.artisan_profiles.crafts || [],
      productsCount: artisanData.artisan_profiles.products_count || 0,
      yearsExperience: artisanData.artisan_profiles.years_experience || 0,
      featured: artisanData.artisan_profiles.featured || false,
      acceptsCustomOrders: artisanData.artisan_profiles.accepts_custom_orders || false,
      bio: artisanData.artisan_profiles.bio || '',
      createdAt: artisanData.created_at,
      updatedAt: artisanData.updated_at,
    }

    const products = productsData?.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      images: product.images || [],
      materials: product.materials || [],
      inStock: product.in_stock,
      isNew: product.is_new,
      isFeatured: product.is_featured,
      rating: Number(product.rating) || 0,
      reviewsCount: product.reviews_count || 0,
      createdAt: product.created_at,
    })) || []

    return NextResponse.json({ 
      artisan,
      products 
    })
  } catch (error) {
    console.error('Error fetching artisan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artisan' },
      { status: 500 }
    )
  }
}

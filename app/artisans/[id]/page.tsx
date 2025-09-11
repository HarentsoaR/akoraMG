"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Star, Calendar, Package, CheckCircle2, Mail, Phone, Globe } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutoSkeleton } from "@/components/ui/auto-skeleton"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { ProductCard } from "@/components/products/product-card"
import { useArtisans } from "@/components/providers/artisans-provider"

type ArtisanProduct = {
  id: number
  name: string
  description: string
  category: string
  price: number
  originalPrice?: number
  images: string[]
  materials: string[]
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  rating: number
  reviewsCount: number
  createdAt: string
}

export default function ArtisanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getArtisanById, loading: artisansLoading } = useArtisans()
  const [products, setProducts] = useState<ArtisanProduct[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)

  const artisanId = params.id as string
  const artisan = getArtisanById(artisanId)

  useEffect(() => {
    const fetchArtisanProducts = async () => {
      if (!artisanId) return

      try {
        setProductsLoading(true)
        setProductsError(null)

        const response = await fetch(`/api/artisans/${artisanId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch artisan details')
        }

        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching artisan products:', error)
        setProductsError(error instanceof Error ? error.message : 'Failed to fetch products')
      } finally {
        setProductsLoading(false)
      }
    }

    fetchArtisanProducts()
  }, [artisanId])

  const loading = artisansLoading || productsLoading

  // Show error state if artisan not found
  if (!loading && !artisan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Artisan not found</h1>
              <p className="text-muted-foreground mb-4">The artisan you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/artisans')}>Back to Artisans</Button>
            </div>
          </div>
        </main>
        <MobileNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        <AutoSkeleton isLoading={loading}>
          {/* Back button */}
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
          </Button>
          </div>

          {artisan && (
            <>
              {/* Artisan Hero */}
              <section className="py-8">
                <div className="container mx-auto px-4">
                  <div className="grid gap-8 lg:grid-cols-3">
                    {/* Artisan Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={artisan.avatar} alt={artisan.name} />
                          <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{artisan.name}</h1>
                            {artisan.featured && (
                              <Badge className="bg-purple-500 text-white">Featured</Badge>
                            )}
                        {artisan.acceptsCustomOrders && (
                              <Badge variant="secondary">Custom Orders</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {artisan.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {artisan.rating} ({artisan.reviews} reviews)
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {artisan.yearsExperience} years experience
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {artisan.productsCount} products
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {artisan.crafts.map((craft) => (
                              <Badge key={craft} variant="outline">{craft}</Badge>
                            ))}
                          </div>
                          {artisan.bio && (
                            <p className="text-muted-foreground leading-relaxed">{artisan.bio}</p>
                        )}
                      </div>
                      </div>
                      </div>

                    {/* Contact Info */}
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{artisan.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{artisan.location}</span>
                          </div>
                          {artisan.acceptsCustomOrders && (
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">Accepts custom orders</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Products Section */}
              <section className="py-8">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Products by {artisan.name}</h2>
                    <Badge variant="outline">{products.length} products</Badge>
          </div>

                  {productsError ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Unable to load products: {productsError}</p>
                      <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                      <p className="text-muted-foreground">This artisan hasn't added any products yet.</p>
              </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
              </div>
            </section>
            </>
          )}
        </AutoSkeleton>
      </main>

      <MobileNavigation />
    </div>
  )
}
"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Star, Award, CheckCircle2, Sparkles } from "lucide-react"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ARTISANS } from "@/lib/data/artisans"
import { PRODUCTS } from "@/lib/data/products"
import { ProductCard } from "@/components/products/product-card"

export default function ArtisanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)

  const artisan = ARTISANS.find((a) => a.id === id)

  const products = useMemo(() => {
    if (!artisan) return []
    return PRODUCTS.filter((p) => p.artisan.name === artisan.name).slice(0, 8)
  }, [artisan])

  if (!artisan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-xl font-semibold">Artisan not found</div>
            <Button onClick={() => router.push("/artisans")}>Go back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const initials = artisan.name.split(" ").map((n) => n[0]).join("")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        <section className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-r from-primary/10 to-orange-500/10">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={artisan.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold clamp-2 pr-2">{artisan.name}</h1>
                        {artisan.featured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
                        {artisan.acceptsCustomOrders && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Custom Orders
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{artisan.location}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{artisan.rating} ({artisan.reviews})</span>
                        <span className="rounded-md border px-2 py-0.5">{artisan.yearsExperience} years</span>
                        <span className="rounded-md border px-2 py-0.5">{artisan.productsCount} products</span>
                      </div>

                      {artisan.bio && <p className="mt-3 text-sm text-muted-foreground clamp-3 max-w-3xl">{artisan.bio}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Crafts & Highlights */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Crafts</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {artisan.crafts.map((c) => (
                  <Badge key={c} variant="outline">{c}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Award className="h-4 w-4" /> Verified craftsmanship</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Ethical sourcing</div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Limited editions</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button size="sm" className="rounded-full">Message</Button>
                <Button size="sm" variant="outline" className="rounded-full">Request custom order</Button>
              </CardContent>
            </Card>
          </div>

          {/* Products by this artisan */}
          {products.length > 0 && (
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Products by {artisan.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/products?category=${artisan.crafts[0]?.toLowerCase().replace(/\s+/g, "-")}`)}>View more</Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      artisan: artisan.name,
                      price: p.price,
                      originalPrice: p.originalPrice,
                      image: p.images[0] || "/placeholder.svg",
                      rating: p.rating,
                      reviews: p.reviews,
                      category: p.category,
                      isNew: p.isNew,
                      isFeatured: p.isFeatured,
                      isPopular: false,
                      isLimited: false,
                      discount: p.originalPrice ? Math.max(0, Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)) : undefined,
                      culturalSignificance: undefined,
                      materials: p.materials,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}

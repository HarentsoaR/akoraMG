"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useProducts } from "@/components/providers/products-provider"
import { ARTISANS } from "@/lib/data/artisans"
import { ProductCard } from "@/components/products/product-card"
import { AutoSkeleton } from "@/components/ui/auto-skeleton"

export default function SearchClient() {
  const [q, setQ] = useState("")
  const { products, loading } = useProducts()

  const matches = useMemo(() => {
    if (!q.trim()) return [] as any[]
    const query = q.toLowerCase()
    return products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.materials.some((m) => m.toLowerCase().includes(query)) ||
      p.artisan.name.toLowerCase().includes(query)
    )
  }, [q])


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-24 md:pb-8">
        <AutoSkeleton isLoading={loading}>
          <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                autoFocus
                placeholder="Search products, artisans, categories, materials..."
                className="pl-12 h-12 text-base"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="text-center mt-4 text-sm text-muted-foreground">
              {q ? (
                <>
                  Results for <Badge variant="secondary">{q}</Badge>: {matches.length}
                </>
              ) : (
                <>Type to search the catalog</>
              )}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {q && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matches.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      artisan: p.artisan.name,
                      price: p.price,
                      originalPrice: p.originalPrice,
                      image: p.images[0] || "/placeholder.svg?height=300&width=400",
                      rating: p.rating,
                      reviews: p.reviews,
                      category: p.category,
                      isNew: p.isNew,
                      isFeatured: p.isFeatured,
                      isPopular: (p.reviews || 0) > 25,
                      isLimited: !p.inStock,
                      discount: p.originalPrice ? Math.max(0, Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)) : undefined,
                      culturalSignificance: undefined,
                      materials: p.materials,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        </AutoSkeleton>
      </main>
      <MobileNavigation />
    </div>
  )
}



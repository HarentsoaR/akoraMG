"use client"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { ProductCard } from "@/components/products/product-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { items, clear } = useWishlist()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Wishlist</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clear}>Clear all</Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">No items yet.</CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  artisan: p.artisan,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  image: p.image,
                  rating: 4.8,
                  reviews: 10,
                  category: p.category,
                  isNew: false,
                  isFeatured: false,
                  isPopular: false,
                  isLimited: false,
                  discount: p.originalPrice ? Math.max(0, Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)) : undefined,
                  culturalSignificance: undefined,
                  materials: [],
                }}
              />
            ))}
          </div>
        )}
      </main>
      <MobileNavigation />
    </div>
  )
}



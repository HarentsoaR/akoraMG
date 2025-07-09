"use client"

import { motion } from "framer-motion"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  artisan: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  isNew?: boolean
  isFeatured?: boolean
  isPopular?: boolean
  isLimited?: boolean
  discount?: number
  culturalSignificance?: string
  materials?: string[]
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mg-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("MGA", "MGA ")
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
      <Card className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
            {product.isFeatured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
            {product.isPopular && <Badge className="bg-orange-500 text-white">Popular</Badge>}
            {product.isLimited && <Badge className="bg-red-500 text-white">Limited</Badge>}
            {product.discount && <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>}
          </div>

          {/* Action buttons */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold leading-tight line-clamp-2">{product.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">
                    {product.artisan
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground truncate">by {product.artisan}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <Button size="sm" className="h-8" onClick={() => router.push(`/products/${product.id}`)}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>

            {product.culturalSignificance && (
              <p className="text-xs text-muted-foreground line-clamp-2">{product.culturalSignificance}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

"use client"

import { MapPin, Star, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

type Artisan = {
  id: number
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
}

interface ArtisanCardProps {
  artisan: Artisan
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const router = useRouter()

  const initials = artisan.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Card className="group h-full overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start gap-4 flex-1">
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarImage src={artisan.avatar || "/placeholder.svg"} alt={artisan.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-tight">{artisan.name}</h3>
              {artisan.featured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
              {artisan.acceptsCustomOrders && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" /> Custom Orders
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {artisan.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {artisan.rating}
                <span className="text-xs">({artisan.reviews})</span>
              </span>
              <span>{artisan.productsCount} products</span>
              <span>{artisan.yearsExperience} years experience</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {artisan.crafts.slice(0, 3).map((craft) => (
                <Badge key={craft} variant="outline" className="text-xs">
                  {craft}
                </Badge>
              ))}
              {artisan.crafts.length > 3 && (
                <Badge variant="outline" className="text-xs">+{artisan.crafts.length - 3}</Badge>
              )}
            </div>

            {artisan.bio && <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2">{artisan.bio}</p>}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => router.push(`/artisans?highlight=${artisan.id}`)}>View</Button>
        </div>
      </CardContent>
    </Card>
  )
}



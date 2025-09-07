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
    <Card className="group h-full overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="grid grid-cols-[56px,1fr] gap-3 flex-1">
          <Avatar className="h-14 w-14">
            <AvatarImage src={artisan.avatar || "/placeholder.svg"} alt={artisan.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            {/* Name on its own line for readability */}
            <div className="flex flex-col">
              <h3 className="font-semibold leading-tight text-base sm:text-lg clamp-2 pr-1">{artisan.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {artisan.featured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
                {artisan.acceptsCustomOrders && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" /> Custom
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {artisan.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {artisan.rating}
                <span className="text-xs">({artisan.reviews})</span>
              </span>
            </div>

            {/* Trim non-essential stats on grid cards for clarity */}

            <div className="mt-2 flex flex-wrap gap-1">
              {artisan.crafts.slice(0, 2).map((craft) => (
                <Badge key={craft} variant="outline" className="text-xs">
                  {craft}
                </Badge>
              ))}
              {artisan.crafts.length > 2 && (
                <Badge variant="outline" className="text-xs">+{artisan.crafts.length - 2}</Badge>
              )}
            </div>

            {/* Keep bio hidden in compact grid for a cleaner look */}
            {artisan.bio && <p className="mt-2 hidden sm:block text-sm text-muted-foreground clamp-2">{artisan.bio}</p>}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="outline" onClick={() => router.push(`/artisans/${artisan.id}`)}>View</Button>
        </div>
      </CardContent>
    </Card>
  )
}

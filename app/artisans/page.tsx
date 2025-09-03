"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Grid3X3, List, ArrowUpDown, MapPin, Star, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { ArtisanCard } from "@/components/artisans/artisan-card"

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

const allArtisans: Artisan[] = [
  {
    id: 1,
    name: "Marie Razafy",
    avatar: "/placeholder.svg?height=64&width=64",
    location: "Antananarivo",
    rating: 4.9,
    reviews: 124,
    crafts: ["Textiles", "Weaving", "Natural Dyes"],
    productsCount: 23,
    yearsExperience: 15,
    featured: true,
    acceptsCustomOrders: true,
    bio: "Master weaver specializing in traditional Malagasy silk lamba using natural dyes.",
  },
  {
    id: 2,
    name: "Jean Rakotomalala",
    avatar: "/placeholder.svg?height=64&width=64",
    location: "Fianarantsoa",
    rating: 4.8,
    reviews: 98,
    crafts: ["Wood Carving", "Sculpture"],
    productsCount: 18,
    yearsExperience: 20,
    featured: true,
    acceptsCustomOrders: false,
    bio: "Traditional rosewood sculptor blending ancestral symbolism with modern forms.",
  },
  {
    id: 3,
    name: "Voahangy Rakoto",
    location: "Antananarivo",
    rating: 4.7,
    reviews: 63,
    crafts: ["Embroidery", "Textiles"],
    productsCount: 12,
    yearsExperience: 9,
    acceptsCustomOrders: true,
    bio: "Embroidery artist focused on ceremonial shawls with intricate gold thread.",
  },
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: 4 + i,
    name: ["Hery Randriamanantsoa", "Paul Rakotonirina", "Sophie Andriamihaja", "Rasoa Raharimampionona"][i % 4],
    location: ["Antsirabe", "Antananarivo", "Toamasina", "Fianarantsoa"][i % 4],
    rating: 4 + ((i % 10) / 10),
    reviews: 10 + (i % 80),
    crafts: [
      ["Pottery", "Clay"],
      ["Metalwork", "Forging"],
      ["Jewelry", "Filigree"],
      ["Basketry", "Weaving"],
    ][i % 4],
    productsCount: 5 + (i % 40),
    yearsExperience: 3 + (i % 25),
    featured: i % 7 === 0,
    acceptsCustomOrders: i % 3 === 0,
  })),
]

const crafts = ["All", "Textiles", "Wood Carving", "Jewelry", "Basketry", "Pottery", "Metalwork"]
const locations = ["All", "Antananarivo", "Fianarantsoa", "Toamasina", "Antsirabe"]

export default function ArtisansPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCraft, setSelectedCraft] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [minRating, setMinRating] = useState<[number]>([4])
  const [customOrdersOnly, setCustomOrdersOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 12

  const filteredArtisans = useMemo(() => {
    let items = allArtisans.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedCraft !== "All") {
      items = items.filter((a) => a.crafts.includes(selectedCraft))
    }
    if (selectedLocation !== "All") {
      items = items.filter((a) => a.location === selectedLocation)
    }
    items = items.filter((a) => a.rating >= minRating[0])
    if (customOrdersOnly) {
      items = items.filter((a) => a.acceptsCustomOrders)
    }

    switch (sortBy) {
      case "rating":
        items.sort((a, b) => b.rating - a.rating)
        break
      case "experience":
        items.sort((a, b) => b.yearsExperience - a.yearsExperience)
        break
      case "products":
        items.sort((a, b) => b.productsCount - a.productsCount)
        break
      default:
        items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return items
  }, [searchQuery, selectedCraft, selectedLocation, minRating, customOrdersOnly, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCraft, selectedLocation, minRating, customOrdersOnly, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredArtisans.length / pageSize))
  const pageStart = (currentPage - 1) * pageSize
  const pageItems = filteredArtisans.slice(pageStart, pageStart + pageSize)

  const clearAll = () => {
    setSearchQuery("")
    setSelectedCraft("All")
    setSelectedLocation("All")
    setMinRating([4])
    setCustomOrdersOnly(false)
    setSortBy("featured")
  }

  const Filters = (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Craft</h4>
            <Select value={selectedCraft} onValueChange={setSelectedCraft}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {crafts.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium mb-3">Location</h4>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium mb-3">Minimum Rating</h4>
            <div className="px-2">
              <Slider value={minRating} onValueChange={(v) => setMinRating(v as [number])} min={0} max={5} step={0.5} className="mb-2" />
              <div className="text-sm text-muted-foreground">{minRating[0]}+ stars</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="custom-orders" checked={customOrdersOnly} onCheckedChange={() => setCustomOrdersOnly((v) => !v)} />
            <label htmlFor="custom-orders" className="text-sm flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Accepts custom orders
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        {/* Hero/Search */}
        <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 py-10">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-4xl font-bold mb-4">Artisans</h1>
              <p className="text-lg text-muted-foreground mb-8">Meet the creators preserving Madagascar’s heritage through craftsmanship</p>

              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search artisans, crafts, or locations..."
                  className="pl-12 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters + Listing */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar (desktop) */}
              <div className="hidden lg:block lg:w-80">{Filters}</div>

              {/* Main */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <Filter className="h-4 w-4 mr-2" /> Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[320px] sm:w-[380px]">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 space-y-4">{Filters}</div>
                      </SheetContent>
                    </Sheet>
                    <p className="text-sm text-muted-foreground">{filteredArtisans.length} artisans found</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-56">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="experience">Most Experienced</SelectItem>
                        <SelectItem value="products">Most Products</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex border rounded-lg">
                      <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Grid/List */}
                <motion.div layout className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                  {pageItems.map((artisan) => (
                    <motion.div key={artisan.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                      {viewMode === "grid" ? (
                        <ArtisanCard artisan={artisan} />
                      ) : (
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex">
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold leading-tight">{artisan.name}</h3>
                                  {artisan.featured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
                                  {artisan.acceptsCustomOrders && <Badge variant="secondary">Custom Orders</Badge>}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{artisan.location}</span>
                                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{artisan.rating} ({artisan.reviews})</span>
                                  <span>{artisan.productsCount} products</span>
                                  <span>{artisan.yearsExperience} yrs</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {artisan.crafts.map((craft) => (
                                    <Badge key={craft} variant="outline" className="text-xs">{craft}</Badge>
                                  ))}
                                </div>
                                {artisan.bio && <p className="text-sm text-muted-foreground line-clamp-2">{artisan.bio}</p>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty state */}
                {filteredArtisans.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🧵</div>
                    <h3 className="text-xl font-semibold mb-2">No artisans found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                    <Button variant="outline" onClick={clearAll}>Clear all filters</Button>
                  </div>
                )}

                {/* Pagination */}
                {filteredArtisans.length > 0 && (
                  <div className="flex items-center justify-between mt-8">
                    <p className="text-sm text-muted-foreground">Showing {pageStart + 1}-{Math.min(pageStart + pageSize, filteredArtisans.length)} of {filteredArtisans.length}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Prev</Button>
                      {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                        const page = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4))
                        if (page > totalPages) return null
                        return (
                          <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                            {page}
                          </Button>
                        )
                      })}
                      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}



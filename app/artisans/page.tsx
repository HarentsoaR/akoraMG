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
import { AutoSkeleton } from "@/components/ui/auto-skeleton"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { ArtisanCard } from "@/components/artisans/artisan-card"
import { useArtisans } from "@/components/providers/artisans-provider"
import { useRouter } from "next/navigation"

const crafts = ["All", "Textiles", "Wood Carving", "Jewelry", "Basketry", "Pottery", "Metalwork"]
const locations = ["All", "Antananarivo", "Fianarantsoa", "Toamasina", "Antsirabe"]

export default function ArtisansPage() {
  const router = useRouter()
  const { artisans, loading, error } = useArtisans()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCraft, setSelectedCraft] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [minRating, setMinRating] = useState<[number]>([0]) // Start with 0 instead of 4
  const [customOrdersOnly, setCustomOrdersOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Debug logging
  console.log('🎭 ArtisansPage render:', {
    artisansCount: artisans.length,
    loading,
    error,
    artisans: artisans.map(a => ({ id: a.id, name: a.name, location: a.location, crafts: a.crafts }))
  })

  const pageSize = 12

  const filteredArtisans = useMemo(() => {
    console.log('🔍 Filtering artisans:', {
      totalArtisans: artisans.length,
      searchQuery,
      selectedCraft,
      selectedLocation,
      minRating: minRating[0],
      customOrdersOnly
    })

    let items = [...artisans] // Start with all artisans

    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter((a) => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.crafts.some(craft => craft.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply craft filter
    if (selectedCraft !== "All") {
      items = items.filter((a) => a.crafts.includes(selectedCraft))
    }

    // Apply location filter
    if (selectedLocation !== "All") {
      items = items.filter((a) => a.location === selectedLocation)
    }

    // Apply rating filter (be more lenient)
    items = items.filter((a) => a.rating >= minRating[0])

    // Apply custom orders filter
    if (customOrdersOnly) {
      items = items.filter((a) => a.acceptsCustomOrders)
    }

    // Apply sorting
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

    console.log('✨ Filtered artisans result:', items.length, 'artisans')
    return items
  }, [artisans, searchQuery, selectedCraft, selectedLocation, minRating, customOrdersOnly, sortBy])

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
    setMinRating([0])
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
              <div className="text-sm text-muted-foreground">{minRating[0] === 0 ? 'Any rating' : `${minRating[0]}+ stars`}</div>
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Unable to load artisans</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
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
          {/* Hero/Search */}
          <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 py-10">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h1 className="text-4xl font-bold mb-4">Artisans</h1>
                <p className="text-lg text-muted-foreground mb-8">Meet the creators preserving Madagascar's heritage through craftsmanship</p>

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
                                {artisan.bio && <p className="text-sm text-muted-foreground clamp-2">{artisan.bio}</p>}
                              </div>
                              <div className="shrink-0 self-center">
                                <Button size="sm" variant="outline" onClick={() => router.push(`/artisans/${artisan.id}`)}>View</Button>
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
        </AutoSkeleton>
      </main>

      <MobileNavigation />
    </div>
  )
}

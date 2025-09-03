"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, Grid3X3, List, ArrowUpDown, MapPin, Star } from "lucide-react"

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
import { ProductCard } from "@/components/products/product-card"
import { formatPrice } from "@/lib/utils"

type Product = {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  artisan: string
  location: string
  rating: number
  reviews: number
  isNew?: boolean
  isFeatured?: boolean
  materials: string[]
  inStock: boolean
}

// Mock data (aligned with existing styles/content)
const allProducts: Product[] = [
  {
    id: 1,
    name: "Hand-woven Silk Lamba",
    category: "Textiles",
    price: 85000,
    originalPrice: 95000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: "Marie Razafy",
    location: "Antananarivo",
    rating: 4.8,
    reviews: 24,
    isNew: true,
    isFeatured: false,
    materials: ["Silk", "Natural dyes"],
    inStock: true,
  },
  {
    id: 2,
    name: "Carved Rosewood Sculpture",
    category: "Wood Carving",
    price: 150000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: "Jean Rakotomalala",
    location: "Fianarantsoa",
    rating: 4.9,
    reviews: 18,
    isNew: false,
    isFeatured: true,
    materials: ["Rosewood"],
    inStock: true,
  },
  {
    id: 3,
    name: "Silver Filigree Necklace",
    category: "Jewelry",
    price: 65000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: "Sophie Andriamihaja",
    location: "Antananarivo",
    rating: 4.7,
    reviews: 31,
    isNew: false,
    isFeatured: false,
    materials: ["Sterling Silver"],
    inStock: true,
  },
  {
    id: 4,
    name: "Raffia Storage Basket",
    category: "Basketry",
    price: 45000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: "Rasoa Raharimampionona",
    location: "Toamasina",
    rating: 4.6,
    reviews: 15,
    isNew: true,
    isFeatured: false,
    materials: ["Raffia Palm"],
    inStock: false,
  },
  {
    id: 5,
    name: "Traditional Clay Pot",
    category: "Pottery",
    price: 35000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: "Hery Randriamanantsoa",
    location: "Antsirabe",
    rating: 4.5,
    reviews: 12,
    isNew: false,
    isFeatured: false,
    materials: ["Clay", "Natural glazes"],
    inStock: true,
  },
  {
    id: 6,
    name: "Forged Iron Candle Holder",
    category: "Metalwork",
    price: 55000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: "Paul Rakotonirina",
    location: "Antananarivo",
    rating: 4.4,
    reviews: 8,
    isNew: false,
    isFeatured: false,
    materials: ["Iron"],
    inStock: true,
  },
  // Duplicate set to simulate more results
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: 7 + i,
    name: `Artisan Craft ${i + 1}`,
    category: ["Textiles", "Wood Carving", "Jewelry", "Basketry", "Pottery", "Metalwork"][i % 6],
    price: 30000 + (i % 12) * 5000,
    image: "/placeholder.svg?height=300&width=400",
    artisan: ["Rasoa", "Hery", "Jean", "Marie", "Voahangy", "Paul"][i % 6],
    location: ["Antananarivo", "Fianarantsoa", "Toamasina", "Antsirabe"][i % 4],
    rating: 4 + ((i % 10) / 10),
    reviews: 5 + (i % 50),
    isNew: i % 4 === 0,
    isFeatured: i % 5 === 0,
    materials: ["Natural dyes", "Silk", "Cotton", "Clay", "Iron", "Rosewood"].slice(0, 1 + (i % 3)),
    inStock: i % 7 !== 0,
  })),
]

const categories = [
  "All",
  "Textiles",
  "Wood Carving",
  "Jewelry",
  "Basketry",
  "Pottery",
  "Metalwork",
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 12

  const allMaterials = useMemo(() => {
    return Array.from(new Set(allProducts.flatMap((p) => p.materials)))
  }, [])

  const filteredProducts = useMemo(() => {
    let items = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisan.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (selectedCategory !== "All") {
      items = items.filter((p) => p.category === selectedCategory)
    }

    items = items.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (selectedMaterials.length > 0) {
      items = items.filter((p) => selectedMaterials.some((m) => p.materials.includes(m)))
    }

    if (showInStockOnly) {
      items = items.filter((p) => p.inStock)
    }

    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        items.sort((a, b) => b.price - a.price)
        break
      case "rating":
        items.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return items
  }, [searchQuery, selectedCategory, priceRange, selectedMaterials, showInStockOnly, sortBy])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, priceRange, selectedMaterials, showInStockOnly, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const pageStart = (currentPage - 1) * pageSize
  const pageItems = filteredProducts.slice(pageStart, pageStart + pageSize)

  const clearAll = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setPriceRange([0, 200000])
    setSelectedMaterials([])
    setShowInStockOnly(false)
    setSortBy("featured")
  }

  // Sync category to URL
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (selectedCategory && selectedCategory !== "All") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    // Avoid pushing identical URLs
    const newQuery = params.toString()
    const currentQuery = searchParams.toString()
    if (newQuery !== currentQuery) {
      const href = newQuery ? `/products?${newQuery}` : "/products"
      router.replace(href)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const Filters = (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Category</h4>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="px-2">
              <Slider value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} max={200000} step={5000} className="mb-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Materials</h4>
            <div className="space-y-2">
              {allMaterials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() =>
                      setSelectedMaterials((prev) =>
                        prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
                      )
                    }
                  />
                  <label htmlFor={material} className="text-sm">
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" checked={showInStockOnly} onCheckedChange={() => setShowInStockOnly((v) => !v)} />
            <label htmlFor="in-stock" className="text-sm">
              In stock only
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
              <h1 className="text-4xl font-bold mb-4">All Products</h1>
              <p className="text-lg text-muted-foreground mb-8">Discover authentic Malagasy crafts from artisans across Madagascar</p>

              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search products, artisans, or materials..."
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
                    <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-56">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
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
                <motion.div layout className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {pageItems.map((product) => (
                    <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                      {viewMode === "grid" ? (
                        <ProductCard product={{
                          id: product.id,
                          name: product.name,
                          artisan: product.artisan,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image,
                          rating: product.rating,
                          reviews: product.reviews,
                          category: product.category,
                          isNew: product.isNew,
                          isFeatured: product.isFeatured,
                          isPopular: false,
                          isLimited: !product.inStock,
                          discount: product.originalPrice ? Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)) : undefined,
                          culturalSignificance: undefined,
                          materials: product.materials,
                        }} />
                      ) : (
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex">
                          <div className="relative w-48 h-32 overflow-hidden">
                            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                  {product.isFeatured && <Badge className="bg-purple-500 text-white text-xs">Featured</Badge>}
                                  {product.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                                  {!product.inStock && <Badge variant="destructive" className="text-xs">Out of Stock</Badge>}
                                </div>
                                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <span>by {product.artisan}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{product.location}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{product.rating}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">{formatPrice(product.price)}</div>
                                {product.originalPrice && (
                                  <div className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                    <Button variant="outline" onClick={clearAll}>Clear all filters</Button>
                  </div>
                )}

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                  <div className="flex items-center justify-between mt-8">
                    <p className="text-sm text-muted-foreground">
                      Showing {pageStart + 1}-{Math.min(pageStart + pageSize, filteredProducts.length)} of {filteredProducts.length}
                    </p>
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

        {/* Highlights */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">Authentic Artisans</h3>
                  <p className="text-sm text-muted-foreground">Every product is handcrafted by Malagasy artisans using traditional techniques.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">Ethical Sourcing</h3>
                  <p className="text-sm text-muted-foreground">We prioritize fair trade and sustainable materials to support communities.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">Secure & Reliable</h3>
                  <p className="text-sm text-muted-foreground">Secure payments, careful packaging, and easy returns for peace of mind.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}



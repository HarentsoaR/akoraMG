"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Filter, Grid3X3, List, ArrowUpDown, MapPin, Star, X } from "lucide-react"

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
import { PRODUCTS } from "@/lib/data/products"

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

const allProducts: Product[] = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.images[0] || "/placeholder.svg?height=300&width=400",
  artisan: p.artisan.name,
  location: p.artisan.location,
  rating: p.rating,
  reviews: p.reviews,
  isNew: p.isNew,
  isFeatured: p.isFeatured,
  materials: p.materials,
  inStock: p.inStock,
}))

// Categories with slugs + meta
const categoryDefs = [
  { label: "Textiles", slug: "textiles" },
  { label: "Wood Carving", slug: "wood-carving" },
  { label: "Jewelry", slug: "jewelry" },
  { label: "Basketry", slug: "basketry" },
  { label: "Pottery", slug: "pottery" },
  { label: "Metalwork", slug: "metalwork" },
]

const slugToLabel = (slug: string | null) => {
  if (!slug) return null
  const found = categoryDefs.find((c) => c.slug === slug.toLowerCase())
  return found?.label ?? null
}

const labelToSlug = (label: string) => {
  const found = categoryDefs.find((c) => c.label === label)
  return found?.slug ?? label.toLowerCase().replace(/\s+/g, "-")
}

const categoryMeta: Record<string, { description: string; heritage: string; image: string }> = {
  Textiles: {
    description: "Traditional Malagasy fabrics, garments, and woven goods that showcase centuries of textile artistry.",
    heritage:
      "Malagasy textile traditions date back over 1,000 years, with techniques passed down through generations.",
    image: "/placeholder.svg?height=400&width=800",
  },
  "Wood Carving": {
    description: "Handcrafted wooden sculptures and decorative items carved from Madagascar's unique hardwoods.",
    heritage: "Wood carving reflects the island's spiritual beliefs and deep connection to ancestry.",
    image: "/placeholder.svg?height=400&width=800",
  },
  Jewelry: {
    description: "Traditional and contemporary jewelry crafted with precious metals and local gemstones.",
    heritage: "Malagasy jewelry blends ancient techniques with modern designs and symbolic meanings.",
    image: "/placeholder.svg?height=400&width=800",
  },
  Basketry: {
    description: "Woven baskets and storage made from sustainable local materials like raffia.",
    heritage: "Basket weaving is essential to daily life, with regions having distinct patterns and techniques.",
    image: "/placeholder.svg?height=400&width=800",
  },
  Pottery: {
    description: "Ceramic vessels and decorative pottery shaped by skilled hands using traditional methods.",
    heritage: "Pottery combines functional design with artistry using local clay across Madagascar.",
    image: "/placeholder.svg?height=400&width=800",
  },
  Metalwork: {
    description: "Forged metal items and decor showcasing traditional blacksmithing skills.",
    heritage: "Metalworking traditions blend practical craftsmanship with decorative artistry.",
    image: "/placeholder.svg?height=400&width=800",
  },
}

const categories = ["All", ...categoryDefs.map((c) => c.label)]

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const initialCategory = useMemo(() => slugToLabel(searchParams.get("category")) ?? "All", [])
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
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

  // Sync category to URL (slugified)
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (selectedCategory && selectedCategory !== "All") {
      params.set("category", labelToSlug(selectedCategory))
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

  // Category counts and materials for UX
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of allProducts) {
      map.set(p.category, (map.get(p.category) || 0) + 1)
    }
    return map
  }, [])

  const selectedCategoryMaterials = useMemo(() => {
    if (selectedCategory === "All") return [] as string[]
    const set = new Set<string>()
    allProducts.filter((p) => p.category === selectedCategory).forEach((p) => p.materials.forEach((m) => set.add(m)))
    return Array.from(set)
  }, [selectedCategory])

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "All" ||
    selectedMaterials.length > 0 ||
    showInStockOnly

  const clearMaterial = (m: string) => setSelectedMaterials((prev) => prev.filter((x) => x !== m))

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
              {/* Browse by Category */}
              <div className="mt-6 overflow-x-auto">
                <div className="flex gap-3 justify-center min-w-max px-2">
                  {categories.map((label) => (
                    <Button
                      key={label}
                      variant={selectedCategory === label ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSelectedCategory(label)}
                    >
                      {label}
                      <Badge variant="secondary" className="ml-2">
                        {label === "All" ? allProducts.length : (categoryCounts.get(label) || 0)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Overview when a specific category selected */}
        {selectedCategory !== "All" && (
          <section className="py-6">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border bg-card">
                <div className="grid md:grid-cols-3">
                  <div className="p-6 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Category</Badge>
                      <Badge>{selectedCategory}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCategory}</h2>
                    <p className="text-muted-foreground mb-3">{categoryMeta[selectedCategory]?.description}</p>
                    <p className="text-sm text-muted-foreground">{categoryMeta[selectedCategory]?.heritage}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
                        <span className="font-medium">{categoryCounts.get(selectedCategory) || 0}</span>
                        <span className="text-muted-foreground">items</span>
                      </div>
                      {selectedCategoryMaterials.slice(0, 4).map((m) => (
                        <Badge key={m} variant="outline">{m}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="relative hidden md:block">
                    <img src={categoryMeta[selectedCategory]?.image || "/placeholder.svg"} alt={selectedCategory} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Filters + Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-[260px,1fr] gap-6">
              {/* Desktop filters */}
              <div className="hidden md:block">{Filters}</div>

              <div>
                {/* Top bar */}
                <div className="flex items-center justify-between mb-4">
                  {/* Active filters chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {hasActiveFilters ? (
                      <>
                        {searchQuery.trim().length > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-1">Search: {searchQuery} <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} /></Badge>
                        )}
                        {selectedCategory !== "All" && (
                          <Badge variant="secondary" className="flex items-center gap-1">{selectedCategory} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("All")} /></Badge>
                        )}
                        {selectedMaterials.map((m) => (
                          <Badge key={m} variant="secondary" className="flex items-center gap-1">{m} <X className="h-3 w-3 cursor-pointer" onClick={() => clearMaterial(m)} /></Badge>
                        ))}
                        {showInStockOnly && (
                          <Badge variant="secondary" className="flex items-center gap-1">In stock <X className="h-3 w-3 cursor-pointer" onClick={() => setShowInStockOnly(false)} /></Badge>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">No filters applied</div>
                    )}
                  </div>

                  {/* Sorting + view + mobile filter */}
                  <div className="flex items-center gap-2">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="md:hidden">
                          <Filter className="h-4 w-4 mr-2" /> Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] sm:w-[340px]">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">{Filters}</div>
                      </SheetContent>
                    </Sheet>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
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
                          isPopular: product.reviews > 25,
                          isLimited: !product.inStock,
                          discount: product.originalPrice ? Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)) : undefined,
                          culturalSignificance: undefined,
                          materials: product.materials,
                        }} />
                      ) : (
                        <Card
                          className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex cursor-pointer"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
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
                  <h3 className="font-semibold mb-1">Fair Trade</h3>
                  <p className="text-sm text-muted-foreground">Our platform promotes fair pricing and supports local communities.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">Sustainable Materials</h3>
                  <p className="text-sm text-muted-foreground">We highlight products using eco-friendly and locally sourced materials.</p>
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


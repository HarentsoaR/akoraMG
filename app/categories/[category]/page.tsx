"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Filter, Grid3X3, List, ArrowUpDown, Star, Heart, Eye, MapPin, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { formatPrice } from "@/lib/utils"
import { PRODUCTS } from "@/lib/data/products"

// Category meta
const categoryData = {
  textiles: {
    name: "Textiles",
    description: "Traditional Malagasy fabrics, clothing, and woven goods that showcase centuries of textile artistry",
    image: "/placeholder.svg?height=400&width=800",
    totalProducts: 156,
    heritage:
      "Malagasy textile traditions date back over 1,000 years, with techniques passed down through generations of skilled artisans.",
  },
  "wood-carving": {
    name: "Wood Carving",
    description: "Handcrafted wooden sculptures and decorative items carved from Madagascar's unique hardwoods",
    image: "/placeholder.svg?height=400&width=800",
    totalProducts: 89,
    heritage:
      "Wood carving in Madagascar reflects the island's spiritual beliefs and connection to ancestral traditions.",
  },
  jewelry: {
    name: "Jewelry",
    description: "Traditional and contemporary jewelry pieces crafted with precious metals and local gemstones",
    image: "/placeholder.svg?height=400&width=800",
    totalProducts: 124,
    heritage: "Malagasy jewelry combines ancient techniques with modern designs, often featuring symbolic meanings.",
  },
  basketry: {
    name: "Basketry",
    description: "Woven baskets and storage solutions made from sustainable local materials",
    image: "/placeholder.svg?height=400&width=800",
    totalProducts: 67,
    heritage:
      "Basket weaving is essential to Malagasy daily life, with each region having distinct patterns and techniques.",
  },
  pottery: {
    name: "Pottery",
    description: "Ceramic vessels and decorative pottery shaped by skilled hands using traditional methods",
    image: "/placeholder.svg?height=400&width=800",
    totalProducts: 43,
    heritage: "Pottery making in Madagascar combines functional design with artistic expression, using local clay.",
  },
  metalwork: {
    name: "Metalwork",
    description: "Forged metal items and decorative pieces showcasing traditional blacksmithing skills",
    image: "/placeholder.svg?height=400&width=800",
    totalProducts: 32,
    heritage: "Metalworking traditions in Madagascar blend practical craftsmanship with decorative artistry.",
  },
}

const slugify = (label: string) => label.toLowerCase().replace(/\s+/g, "-")

const allProducts = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: slugify(p.category),
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
  description: undefined as string | undefined,
}))

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categorySlug = params.category as string

  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  const category = categoryData[categorySlug as keyof typeof categoryData]

  useEffect(() => {
    if (!category) return

    // Filter products by category
    let filtered = allProducts.filter((product) => product.category === categorySlug)

    // Apply filters
    filtered = filtered.filter((product) => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesMaterials =
        selectedMaterials.length === 0 || selectedMaterials.some((material) => product.materials.includes(material))
      const matchesStock = !showInStockOnly || product.inStock

      return matchesPrice && matchesMaterials && matchesStock
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default: // featured
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    setFilteredProducts(filtered)
  }, [categorySlug, priceRange, sortBy, selectedMaterials, showInStockOnly, category])

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button onClick={() => router.push("/categories")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </div>
      </div>
    )
  }

  // Get unique materials for this category
  const categoryProducts = allProducts.filter((p) => p.category === categorySlug)
  const allMaterials = Array.from(new Set(categoryProducts.flatMap((product) => product.materials)))

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials((prev) => (prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]))
  }

  

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Category Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-16 text-white">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
              <p className="text-xl mb-6 opacity-90">{category.description}</p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {category.totalProducts} Products
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.7 average rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Cultural Heritage</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{category.heritage}</p>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPriceRange([0, 200000])
                          setSelectedMaterials([])
                          setShowInStockOnly(false)
                        }}
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Price Range */}
                      <div>
                        <h4 className="font-medium mb-3">Price Range</h4>
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={200000}
                            step={5000}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                          </div>
                        </div>
                      </div>

                      {/* Materials Filter */}
                      <div>
                        <h4 className="font-medium mb-3">Materials</h4>
                        <div className="space-y-2">
                          {allMaterials.map((material) => (
                            <div key={material} className="flex items-center space-x-2">
                              <Checkbox
                                id={material}
                                checked={selectedMaterials.includes(material)}
                                onCheckedChange={() => handleMaterialToggle(material)}
                              />
                              <label htmlFor={material} className="text-sm">
                                {material}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stock Filter */}
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" checked={showInStockOnly} onCheckedChange={() => setShowInStockOnly((v) => !v)} />
                        <label htmlFor="in-stock" className="text-sm">
                          In stock only
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden bg-transparent"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {filteredProducts.length} of {category.totalProducts} products
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Mode */}
                    <div className="flex border rounded-lg">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Products Grid/List */}
                <motion.div
                  layout
                  className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <Card
                        className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-32" : "h-48"}`}>
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {product.isNew && <Badge className="bg-green-500">New</Badge>}
                            {product.isFeatured && <Badge className="bg-purple-500">Featured</Badge>}
                            {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                          </div>

                          {/* Action buttons */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                              <div className="flex items-center gap-1 ml-2">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{product.rating}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>by {product.artisan}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{product.location}</span>
                              </div>
                            </div>

                            {product.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {product.materials.map((material: string) => (
                                <Badge key={material} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div>
                                <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through ml-2">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                disabled={!product.inStock}
                                onClick={() => router.push(`/products/${product.id}`)}
                              >
                                {product.inStock ? "View Details" : "Out of Stock"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPriceRange([0, 200000])
                        setSelectedMaterials([])
                        setShowInStockOnly(false)
                      }}
                    >
                      Clear all filters
                    </Button>
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

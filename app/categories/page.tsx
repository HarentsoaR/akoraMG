"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Grid3X3, List, ArrowUpDown, MapPin, Star, Heart, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { useRouter } from "next/navigation"

// Mock data for categories and products
const categories = [
  {
    id: 1,
    name: "Textiles",
    slug: "textiles",
    count: 156,
    image: "/placeholder.svg?height=300&width=400",
    description: "Traditional fabrics, clothing, and woven goods",
    featured: true,
  },
  {
    id: 2,
    name: "Wood Carving",
    slug: "wood-carving",
    count: 89,
    image: "/placeholder.svg?height=300&width=400",
    description: "Handcrafted wooden sculptures and decorative items",
    featured: true,
  },
  {
    id: 3,
    name: "Jewelry",
    slug: "jewelry",
    count: 124,
    image: "/placeholder.svg?height=300&width=400",
    description: "Traditional and contemporary jewelry pieces",
    featured: false,
  },
  {
    id: 4,
    name: "Basketry",
    slug: "basketry",
    count: 67,
    image: "/placeholder.svg?height=300&width=400",
    description: "Woven baskets and storage solutions",
    featured: false,
  },
  {
    id: 5,
    name: "Pottery",
    slug: "pottery",
    count: 43,
    image: "/placeholder.svg?height=300&width=400",
    description: "Ceramic vessels and decorative pottery",
    featured: false,
  },
  {
    id: 6,
    name: "Metalwork",
    slug: "metalwork",
    count: 32,
    image: "/placeholder.svg?height=300&width=400",
    description: "Forged metal items and decorative pieces",
    featured: false,
  },
]

const allProducts = [
  {
    id: 1,
    name: "Hand-woven Silk Lamba",
    category: "textiles",
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
    category: "wood-carving",
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
    category: "jewelry",
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
    category: "basketry",
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
    category: "pottery",
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
    category: "metalwork",
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
]

export default function CategoriesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(allProducts)

  // Get unique materials for filter
  const allMaterials = Array.from(new Set(allProducts.flatMap(product => product.materials)))

  // Filter and sort products
  useEffect(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.artisan.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesMaterials = selectedMaterials.length === 0 || 
                              selectedMaterials.some(material => product.materials.includes(material))
      const matchesStock = !showInStockOnly || product.inStock

      return matchesSearch && matchesCategory && matchesPrice && matchesMaterials && matchesStock
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
  }, [searchQuery, selectedCategory, priceRange, sortBy, selectedMaterials, showInStockOnly])

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const formatPrice = (price: number) => {
    return `MGA ${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover authentic Malagasy crafts organized by traditional art forms
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
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

        {/* Featured Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.filter(cat => cat.featured).map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer overflow-hidden group hover:shadow-lg transition-all duration-300"
                      onClick={() => router.push(`/categories/${category.slug}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">{category.name}</h3>
                          <p className="text-sm opacity-90">{category.count} products</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("all")
                          setPriceRange([0, 200000])
                          setSelectedMaterials([])
                          setShowInStockOnly(false)
                        }}
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Category Filter */}
                      <div>
                        <h4 className="font-medium mb-3">Category</h4>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.slug}>
                                {category.name} ({category.count})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

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
                        <Checkbox
                          id="in-stock"
                          checked={showInStockOnly}
                          // onCheckedChange={setShowInStockOnly}
                        />
                        <label htmlFor="in-stock" className="text-sm">
                          In stock only
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Section */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {filteredProducts.length} products found
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
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
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
                      <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${
                        viewMode === "list" ? "flex" : ""
                      }`}>
                        <div className={`relative overflow-hidden ${
                          viewMode === "list" ? "w-48 h-32" : "h-48"
                        }`}>
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

                            <div className="flex flex-wrap gap-1">
                              {product.materials.map((material) => (
                                <Badge key={material} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div>
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(product.price)}
                                </span>
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
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
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

        {/* All Categories Grid */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">All Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer text-center p-4 hover:shadow-md transition-all duration-300"
                      onClick={() => router.push(`/categories/${category.slug}`)}
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </div>
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.count} items</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}

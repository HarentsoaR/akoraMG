"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  MapPin,
  Package,
  Truck,
  Shield,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Info,
  Award,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ProductCard } from "@/components/products/product-card"

// Mock product data
const productData = {
  1: {
    id: 1,
    name: "Hand-woven Silk Lamba",
    artisan: {
      name: "Marie Razafy",
      avatar: "/placeholder.svg?height=64&width=64",
      location: "Antananarivo",
      rating: 4.9,
      totalProducts: 23,
      yearsExperience: 15,
      verified: true,
    },
    price: 85000,
    originalPrice: 95000,
    discount: 11,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.8,
    reviews: 24,
    category: "Textiles",
    subcategory: "Traditional Garments",
    isNew: true,
    isFeatured: false,
    isPopular: false,
    isLimited: false,
    inStock: true,
    stockQuantity: 3,
    materials: ["Pure Silk", "Natural Dyes", "Traditional Threads"],
    dimensions: "180cm x 120cm",
    weight: "0.8kg",
    description:
      "This exquisite hand-woven silk lamba represents the pinnacle of Malagasy textile artistry. Crafted using traditional techniques passed down through generations, each thread tells a story of cultural heritage and skilled craftsmanship. The intricate patterns and vibrant colors are achieved using natural dyes sourced from local plants, making each piece truly unique.",
    culturalSignificance:
      "The lamba is more than just a garment; it's a symbol of Malagasy identity and tradition. Traditionally worn during important ceremonies and celebrations, this silk lamba represents prosperity and respect for ancestral customs. The specific patterns woven into this piece tell stories of the highlands and carry blessings for the wearer.",
    craftingProcess:
      "This lamba was created over 3 months using a traditional backstrap loom. The silk threads are hand-spun and dyed using traditional methods with natural pigments from local plants. Each pattern is carefully planned and executed, requiring exceptional skill and patience.",
    careInstructions: [
      "Hand wash only in cold water",
      "Use mild, natural detergent",
      "Air dry away from direct sunlight",
      "Store folded with acid-free tissue paper",
      "Professional cleaning recommended for deep cleaning",
    ],
    shippingInfo: {
      domestic: "2-3 business days",
      international: "7-14 business days",
      freeShippingThreshold: 100000,
    },
    returnPolicy: "30-day return policy for unused items",
    authenticity: "Certificate of authenticity included",
    tags: ["handwoven", "silk", "traditional", "ceremonial", "luxury", "heritage"],
  },
  2: {
    id: 2,
    name: "Carved Rosewood Sculpture",
    artisan: {
      name: "Jean Rakotomalala",
      avatar: "/placeholder.svg?height=64&width=64",
      location: "Fianarantsoa",
      rating: 4.9,
      totalProducts: 18,
      yearsExperience: 20,
      verified: true,
    },
    price: 150000,
    originalPrice: undefined,
    discount: undefined,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.9,
    reviews: 18,
    category: "Wood Carving",
    subcategory: "Sculptures",
    isNew: false,
    isFeatured: true,
    isPopular: false,
    isLimited: true,
    inStock: true,
    stockQuantity: 1,
    materials: ["Rosewood", "Natural Finish"],
    dimensions: "25cm x 15cm x 30cm",
    weight: "2.1kg",
    description:
      "Masterfully carved from premium Madagascar rosewood, this sculpture embodies the spiritual essence of Malagasy ancestral beliefs. The intricate details and smooth finish showcase decades of woodworking expertise.",
    culturalSignificance:
      "This sculpture represents the connection between the living and ancestral spirits in Malagasy tradition. The carved figures symbolize protection and guidance from ancestors.",
    craftingProcess:
      "Hand-carved over 6 weeks using traditional tools. The rosewood was naturally aged for 2 years before carving to ensure stability and prevent cracking.",
    careInstructions: [
      "Dust regularly with soft, dry cloth",
      "Avoid direct sunlight and moisture",
      "Apply natural wood oil annually",
      "Handle with care to preserve details",
    ],
    shippingInfo: {
      domestic: "3-5 business days",
      international: "10-21 business days",
      freeShippingThreshold: 100000,
    },
    returnPolicy: "14-day return policy for unused items",
    authenticity: "Certificate of authenticity and origin included",
    tags: ["rosewood", "sculpture", "handcarved", "spiritual", "ancestral", "art"],
  },
}

// Mock related products
const relatedProducts = [
  {
    id: 3,
    name: "Traditional Cotton Lamba",
    artisan: "Hanta Rasolofo",
    price: 45000,
    originalPrice: undefined,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    reviews: 18,
    category: "Textiles",
    isNew: false,
    isFeatured: false,
    isPopular: true,
    isLimited: false,
    discount: undefined,
    culturalSignificance: "Traditional everyday garment worn by Malagasy people",
    materials: ["Cotton", "Natural dyes"],
  },
  {
    id: 4,
    name: "Embroidered Ceremonial Shawl",
    artisan: "Voahangy Rakoto",
    price: 120000,
    originalPrice: 135000,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    reviews: 12,
    category: "Textiles",
    isNew: true,
    isFeatured: false,
    isPopular: false,
    isLimited: false,
    discount: 11,
    culturalSignificance: "Luxurious ceremonial shawl for special occasions",
    materials: ["Silk", "Gold thread"],
  },
  {
    id: 5,
    name: "Woven Table Runner",
    artisan: "Lalao Andriamihaja",
    price: 35000,
    originalPrice: undefined,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    reviews: 8,
    category: "Textiles",
    isNew: false,
    isFeatured: false,
    isPopular: false,
    isLimited: false,
    discount: undefined,
    culturalSignificance: "Decorative table runner with traditional patterns",
    materials: ["Cotton", "Natural fibers"],
  },
  {
    id: 6,
    name: "Silk Ceremonial Scarf",
    artisan: "Ravo Rasoamampionona",
    price: 65000,
    originalPrice: undefined,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    reviews: 15,
    category: "Textiles",
    isNew: false,
    isFeatured: true,
    isPopular: false,
    isLimited: false,
    discount: undefined,
    culturalSignificance: "Elegant silk scarf for formal ceremonies",
    materials: ["Wild silk", "Natural dyes"],
  },
]

// Mock reviews
const reviews = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Absolutely stunning piece! The quality is exceptional and the cultural significance makes it even more special. Marie's craftsmanship is incredible.",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    user: "David Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2024-01-10",
    comment:
      "Beautiful work of art. The silk is incredibly soft and the patterns are mesmerizing. Shipping was fast and packaging was excellent.",
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    user: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "2024-01-05",
    comment:
      "Gorgeous lamba with rich colors. Slightly smaller than expected but still very happy with the purchase. Great customer service.",
    verified: true,
    helpful: 5,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedTab, setSelectedTab] = useState("description")

const product = productData[Number(productId) as keyof typeof productData]

  useEffect(() => {
    if (!product) {
      router.push("/categories")
    }
  }, [product, router])

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push("/categories")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return `MGA ${price.toLocaleString()}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const addToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} of product ${product.id} to cart`)
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this beautiful ${product.name} by ${product.artisan.name}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
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
                <BreadcrumbLink href={`/categories/${product.category.toLowerCase().replace(" ", "-")}`}>
                  {product.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <img
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full p-0"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full p-0"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-green-500">New</Badge>}
                  {product.isFeatured && <Badge className="bg-purple-500">Featured</Badge>}
                  {product.discount && <Badge className="bg-red-500">-{product.discount}%</Badge>}
                </div>

                {/* Action Buttons */}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-10 w-10 rounded-full p-0"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="secondary" size="sm" className="h-10 w-10 rounded-full p-0" onClick={shareProduct}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                        index === currentImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.subcategory && <Badge variant="outline">{product.subcategory}</Badge>}
                </div>
                <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">1.2k views</span>
                  </div>
                </div>
              </div>

              {/* Artisan Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={product.artisan.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {product.artisan.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{product.artisan.name}</h3>
                        {product.artisan.verified && <Award className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{product.artisan.location}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{product.artisan.yearsExperience} years experience</span>
                        <span>{product.artisan.totalProducts} products</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Price and Purchase */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discount && (
                    <Badge variant="destructive" className="text-sm">
                      Save {product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-600">In stock ({product.stockQuantity} available)</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-sm text-red-600">Out of stock</span>
                    </>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center text-sm">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        disabled={quantity >= product.stockQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1" onClick={addToCart} disabled={!product.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg">
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Free shipping over MGA 100k</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Authenticity guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Secure packaging</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>30-day returns</span>
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="font-semibold mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material) => (
                    <Badge key={material} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <div className="font-medium">{product.dimensions}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Weight:</span>
                  <div className="font-medium">{product.weight}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="cultural">Cultural Story</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Care</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                    <div>
                      <h4 className="font-semibold mb-2">Crafting Process</h4>
                      <p className="text-muted-foreground leading-relaxed">{product.craftingProcess}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cultural" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Cultural Significance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{product.culturalSignificance}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{product.rating}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{product.reviews} reviews</div>
                        </div>
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2 text-sm">
                              <span className="w-8">{stars}★</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400"
                                  style={{
                                    width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%`,
                                  }}
                                />
                              </div>
                              <span className="w-8 text-muted-foreground">
                                {stars === 5 ? 17 : stars === 4 ? 5 : stars === 3 ? 1 : stars === 2 ? 1 : 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{review.user}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-muted-foreground mb-3">{review.comment}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <Button variant="ghost" size="sm" className="h-auto p-0">
                                  <span className="text-muted-foreground">Helpful ({review.helpful})</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-auto p-0">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Domestic shipping:</span>
                        <span className="font-medium">{product.shippingInfo.domestic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>International shipping:</span>
                        <span className="font-medium">{product.shippingInfo.international}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Free shipping threshold:</span>
                        <span className="font-medium">{formatPrice(product.shippingInfo.freeShippingThreshold)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Return policy:</span>
                        <span className="font-medium">{product.returnPolicy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Authenticity:</span>
                        <span className="font-medium">{product.authenticity}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Care Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {product.careInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Related Products</h2>
                <p className="text-muted-foreground">More beautiful pieces from the same category</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/categories/${product.category.toLowerCase().replace(" ", "-")}`)}
              >
                View All {product.category}
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  )
}

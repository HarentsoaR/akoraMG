"use client"

import { motion, Variants } from "framer-motion"
import { ArrowRight, Star, Heart, Sparkles, Users, Package, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { Header } from "@/components/layout/header"
import { ProductCard } from "@/components/products/product-card"
import { CategoryCard } from "@/components/categories/category-card"
import { useRouter } from "next/navigation"

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Hand-woven Raffia Basket",
    artisan: "Rasoa Raharimampionona",
    price: 75000,
    originalPrice: 85000,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    reviews: 24,
    category: "Basketry",
    isNew: true,
    discount: 12,
    culturalSignificance: "Traditional Malagasy weaving technique passed down through generations",
    materials: ["Raffia palm", "Natural dyes"],
  },
  {
    id: 2,
    name: "Carved Wooden Sculpture",
    artisan: "Jean Rakotomalala",
    price: 150000,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    reviews: 18,
    category: "Wood Carving",
    isFeatured: true,
    culturalSignificance: "Represents ancestral spirits in Malagasy tradition",
    materials: ["Rosewood", "Traditional tools"],
  },
  {
    id: 3,
    name: "Embroidered Silk Lamba",
    artisan: "Marie Razafy",
    price: 45000,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    reviews: 31,
    category: "Textiles",
    isPopular: true,
    culturalSignificance: "Traditional Malagasy ceremonial garment",
    materials: ["Wild silk", "Natural threads"],
  },
  {
    id: 4,
    name: "Silver Filigree Jewelry Set",
    artisan: "Sophie Andriamihaja",
    price: 95000,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    reviews: 15,
    category: "Jewelry",
    isLimited: true,
    culturalSignificance: "Ancient Malagasy silversmithing techniques",
    materials: ["Sterling silver", "Semi-precious stones"],
  },
]

const categories = [
  {
    id: 1,
    name: "Textiles",
    count: 156,
    image: "/placeholder.svg?height=200&width=300",
    description: "Traditional fabrics and garments",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Wood Carving",
    count: 89,
    image: "/placeholder.svg?height=200&width=300",
    description: "Handcrafted wooden sculptures",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    id: 3,
    name: "Jewelry",
    count: 124,
    image: "/placeholder.svg?height=200&width=300",
    description: "Traditional and modern designs",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    name: "Basketry",
    count: 67,
    image: "/placeholder.svg?height=200&width=300",
    description: "Woven baskets and containers",
    gradient: "from-green-500 to-green-600",
  },
]

export default function HomePage() {
  const router = useRouter()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-orange-500 text-white"
        >
          <div className="absolute inset-0 malagasy-pattern" />
          <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI-Enhanced Platform
                  </Badge>
                  <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                    Discover Authentic
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Malagasy Crafts
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-lg text-white/90 md:text-xl"
                >
                  Support local artisans and bring home unique, handcrafted treasures that tell the story of
                  Madagascar's rich cultural heritage.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => router.push("/products")}
                  >
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => router.push("/artisans")}
                  >
                    Meet Artisans
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative"
              >
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Malagasy crafts showcase"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">4.8</span>
                    <span className="text-sm text-gray-600">2.1k reviews</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Search Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Input placeholder="Search for authentic Malagasy crafts..." className="h-12 pl-4 pr-12 text-base" />
              <Button size="sm" className="absolute right-1 top-1 h-10">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 py-8"
        >
          <motion.div variants={itemVariants} className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked treasures from our talented artisans</p>
            </div>
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <motion.div key={product.id} variants={itemVariants} custom={index}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 py-8"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold">Browse Categories</h2>
            <p className="text-muted-foreground">Explore our diverse collection of traditional crafts</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div key={category.id} variants={itemVariants} custom={index}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Features Highlight */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">AI-Powered Features</h2>
                <p className="text-muted-foreground">Enhancing the artisan experience with intelligent tools</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Descriptions</h3>
                  <p className="text-sm text-muted-foreground">
                    AI generates rich product descriptions in multiple languages
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Inventory Forecasting</h3>
                  <p className="text-sm text-muted-foreground">
                    Predict demand and optimize stock levels automatically
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Curated product suggestions based on customer preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-orange-500/5">
            <CardContent className="p-8">
              <div className="grid gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-primary mr-2" />
                    <div className="text-3xl font-bold text-primary">500+</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Artisan Partners</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-primary mr-2" />
                    <div className="text-3xl font-bold text-primary">2,000+</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Products</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="h-8 w-8 text-primary mr-2" />
                    <div className="text-3xl font-bold text-primary">50+</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Countries Served</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <MobileNavigation />
    </div>
  )
}

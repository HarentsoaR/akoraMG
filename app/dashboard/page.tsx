"use client"

import { motion } from "framer-motion"
import { Plus, Package, TrendingUp, Eye, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
// import { useRouter } from "next/navigation"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const titleRef = useRef(null)

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
    }
  }, [])

  const stats = [
    {
      title: "Total Products",
      value: "12",
      change: "+2 this month",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Sales", 
      value: "MGA 450,000",
      change: "+15% from last month",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Profile Views",
      value: "1,234", 
      change: "+8% this week",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Favorites",
      value: "89",
      change: "+12 this week",
      icon: Heart,
      color: "text-red-600",
    }
  ]

  const recentProducts = [
    {
      id: 1,
      name: "Hand-woven Raffia Basket",
      price: "MGA 75,000",
      status: "Active",
      views: 45,
      favorites: 12,
    },
    {
      id: 2,
      name: "Carved Wooden Sculpture",
      price: "MGA 150,000",
      status: "Active",
      views: 67,
      favorites: 23,
    },
    {
      id: 3,
      name: "Embroidered Silk Lamba",
      price: "MGA 45,000",
      status: "Draft",
      views: 12,
      favorites: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 ref={titleRef} className="text-3xl font-bold">Welcome back, Rasoa!</h1>
              <p className="text-muted-foreground">Here's what's happening with your artisan shop</p>
            </div>
            <Button onClick={() => router.push("/dashboard/products/new")} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your artisan business efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/dashboard/products/new")}
                >
                  <Plus className="h-6 w-6" />
                  Add Product
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/dashboard/products")}
                >
                  <Package className="h-6 w-6" />
                  Manage Products
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/dashboard/orders")}
                >
                  <ShoppingCart className="h-6 w-6" />
                  View Orders
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/dashboard/analytics")}
                >
                  <TrendingUp className="h-6 w-6" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>Your latest product listings</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/products")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={product.status === "Active" ? "default" : "secondary"}>{product.status}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {product.views}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        {product.favorites}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <MobileNavigation />
    </div>
  )
}

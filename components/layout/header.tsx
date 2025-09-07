"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, ShoppingCart, Heart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useAuth } from "@/components/providers/auth-provider"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const { totalItems } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>

            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Fivoarana
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => router.push("/products")}>
              Products
            </Button>
            
            <Button variant="ghost" onClick={() => router.push("/artisans")}>
              Artisans
            </Button>
            <Button variant="ghost" onClick={() => router.push("/about")}>
              About
            </Button>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search crafts..." className="pl-10" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full p-0 text-[10px] leading-none">3</Badge>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="relative" onClick={() => router.push("/wishlist")}> 
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full p-0 text-[10px] leading-none">{wishlistCount}</Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" onClick={() => router.push("/cart")}> 
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full p-0 text-[10px] leading-none">{totalItems}</Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {(user?.name || user?.email || "GU")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Not signed in"}</p>
                    {user?.email && (
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/orders")}>Orders</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push("/auth/login")}>Sign in</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t md:hidden"
            >
              <div className="py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search crafts..." className="pl-10" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t md:hidden"
            >
              <nav className="py-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/products")
                    setIsMenuOpen(false)
                  }}
                >
                  Products
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/artisans")
                    setIsMenuOpen(false)
                  }}
                >
                  Artisans
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/about")
                    setIsMenuOpen(false)
                  }}
                >
                  About
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

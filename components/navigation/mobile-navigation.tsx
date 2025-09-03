"use client"

import { Home, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    badge: 1,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function MobileNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              className={cn(
                "relative flex h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1",
                isActive && "bg-primary/10 text-primary",
              )}
              onClick={() => router.push(item.href)}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs">{item.badge}</Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

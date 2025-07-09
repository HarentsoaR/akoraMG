"use client"

import type * as React from "react"
import { Home, ShoppingCart, User, Grid3X3, Heart, Search, Package } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// Navigation data with modern structure
const data = {
  user: {
    name: "Rasoa Andry",
    email: "rasoa@fivoarana.mg",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Fivoarana",
      logo: Package,
      plan: "Marketplace",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
      badge: null,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Grid3X3,
      badge: "12",
      items: [
        {
          title: "Textiles",
          url: "/categories/textiles",
        },
        {
          title: "Wood Carving",
          url: "/categories/wood-carving",
        },
        {
          title: "Jewelry",
          url: "/categories/jewelry",
        },
        {
          title: "Pottery",
          url: "/categories/pottery",
        },
        {
          title: "Basketry",
          url: "/categories/basketry",
        },
      ],
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
      badge: null,
    },
    {
      title: "Wishlist",
      url: "/wishlist",
      icon: Heart,
      badge: "3",
    },
    {
      title: "Cart",
      url: "/cart",
      icon: ShoppingCart,
      badge: "2",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
      items: [
        {
          title: "My Orders",
          url: "/profile/orders",
        },
        {
          title: "My Reviews",
          url: "/profile/reviews",
        },
        {
          title: "Account Settings",
          url: "/profile/settings",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

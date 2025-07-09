"use client"

import { motion } from "framer-motion"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: string | null
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70">Navigation</SidebarGroupLabel>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <SidebarMenu>
          {items.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Collapsible asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive} className="group relative">
                    <a href={item.url} className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge className="bg-primary text-primary-foreground">{item.badge}</SidebarMenuBadge>
                      )}
                      {item.items && (
                        <CollapsibleTrigger asChild>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                      )}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-sidebar-foreground/40" />
                                {subItem.title}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            </motion.div>
          ))}
        </SidebarMenu>
      </motion.div>
    </SidebarGroup>
  )
}

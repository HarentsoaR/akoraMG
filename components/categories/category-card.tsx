"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Category {
  id: number
  name: string
  count: number
  image: string
  description: string
  gradient: string
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter()

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl"
        onClick={() => router.push(`/categories/${category.name.toLowerCase().replace(" ", "-")}`)}
      >
        <div className="relative h-32 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`} />
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-xl font-bold">{category.name}</h3>
              <p className="text-sm opacity-90">{category.count} products</p>
              <p className="text-xs opacity-75 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

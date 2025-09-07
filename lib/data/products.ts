export type ProductData = {
  id: number
  name: string
  category: "Textiles" | "Wood Carving" | "Jewelry" | "Basketry" | "Pottery" | "Metalwork"
  price: number
  originalPrice?: number
  images: string[]
  artisan: { name: string; location: string }
  rating: number
  reviews: number
  isNew?: boolean
  isFeatured?: boolean
  materials: string[]
  inStock: boolean
}

export const PRODUCTS: ProductData[] = [
  {
    id: 1,
    name: "Hand-woven Silk Lamba",
    category: "Textiles",
    price: 85000,
    originalPrice: 95000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: "Marie Razafy", location: "Antananarivo" },
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
    category: "Wood Carving",
    price: 150000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: "Jean Rakotomalala", location: "Fianarantsoa" },
    rating: 4.9,
    reviews: 18,
    isFeatured: true,
    materials: ["Rosewood"],
    inStock: true,
  },
  {
    id: 3,
    name: "Silver Filigree Necklace",
    category: "Jewelry",
    price: 65000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: "Sophie Andriamihaja", location: "Antananarivo" },
    rating: 4.7,
    reviews: 31,
    materials: ["Sterling Silver"],
    inStock: true,
  },
  {
    id: 4,
    name: "Raffia Storage Basket",
    category: "Basketry",
    price: 45000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: "Rasoa Raharimampionona", location: "Toamasina" },
    rating: 4.6,
    reviews: 15,
    isNew: true,
    materials: ["Raffia Palm"],
    inStock: false,
  },
  {
    id: 5,
    name: "Traditional Clay Pot",
    category: "Pottery",
    price: 35000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: "Hery Randriamanantsoa", location: "Antsirabe" },
    rating: 4.5,
    reviews: 12,
    materials: ["Clay", "Natural glazes"],
    inStock: true,
  },
  {
    id: 6,
    name: "Forged Iron Candle Holder",
    category: "Metalwork",
    price: 55000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: "Paul Rakotonirina", location: "Antananarivo" },
    rating: 4.4,
    reviews: 8,
    materials: ["Iron"],
    inStock: true,
  },
  // Extra items for pagination/demo
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: 7 + i,
    name: `Artisan Craft ${i + 1}`,
    category: (["Textiles", "Wood Carving", "Jewelry", "Basketry", "Pottery", "Metalwork"] as const)[i % 6],
    price: 30000 + (i % 12) * 5000,
    images: ["/placeholder.svg?height=300&width=400"],
    artisan: { name: ["Rasoa", "Hery", "Jean", "Marie", "Voahangy", "Paul"][i % 6], location: ["Antananarivo", "Fianarantsoa", "Toamasina", "Antsirabe"][i % 4] },
    rating: 4 + ((i % 10) / 10),
    reviews: 5 + (i % 50),
    isNew: i % 4 === 0,
    isFeatured: i % 5 === 0,
    materials: ["Natural dyes", "Silk", "Cotton", "Clay", "Iron", "Rosewood"].slice(0, 1 + (i % 3)),
    inStock: i % 7 !== 0,
  })),
]



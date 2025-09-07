export type ArtisanData = {
  id: number
  name: string
  avatar?: string
  location: string
  rating: number
  reviews: number
  crafts: string[]
  productsCount: number
  yearsExperience: number
  featured?: boolean
  acceptsCustomOrders?: boolean
  bio?: string
}

export const ARTISANS: ArtisanData[] = [
  {
    id: 1,
    name: "Marie Razafy",
    avatar: "/placeholder.svg?height=80&width=80",
    location: "Antananarivo",
    rating: 4.9,
    reviews: 124,
    crafts: ["Textiles", "Weaving", "Natural Dyes"],
    productsCount: 23,
    yearsExperience: 15,
    featured: true,
    acceptsCustomOrders: true,
    bio: "Master weaver specializing in traditional Malagasy silk lamba using natural dyes.",
  },
  {
    id: 2,
    name: "Jean Rakotomalala",
    avatar: "/placeholder.svg?height=80&width=80",
    location: "Fianarantsoa",
    rating: 4.8,
    reviews: 98,
    crafts: ["Wood Carving", "Sculpture"],
    productsCount: 18,
    yearsExperience: 20,
    featured: true,
    acceptsCustomOrders: false,
    bio: "Traditional rosewood sculptor blending ancestral symbolism with modern forms.",
  },
  {
    id: 3,
    name: "Sophie Andriamihaja",
    avatar: "/placeholder.svg?height=80&width=80",
    location: "Antananarivo",
    rating: 4.7,
    reviews: 63,
    crafts: ["Jewelry", "Filigree"],
    productsCount: 12,
    yearsExperience: 9,
    acceptsCustomOrders: true,
    bio: "Filigree jewelry artist crafting contemporary pieces with traditional techniques.",
  },
  {
    id: 4,
    name: "Rasoa Raharimampionona",
    avatar: "/placeholder.svg?height=80&width=80",
    location: "Toamasina",
    rating: 4.6,
    reviews: 45,
    crafts: ["Basketry", "Weaving"],
    productsCount: 14,
    yearsExperience: 11,
    acceptsCustomOrders: true,
    bio: "Basketry specialist using sustainable raffia with regional patterns.",
  },
]

export type Artisan = ArtisanData

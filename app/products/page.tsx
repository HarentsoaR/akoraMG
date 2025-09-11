import ProductsPageClient from "./client-page"

export default function ProductsPage() {
  return <ProductsPageClient />
}

// Ensure Netlify/Next handles this as a dynamic route
export const dynamic = "force-dynamic"

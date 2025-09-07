import { Suspense } from "react"
import ProductsPageClient from "./client-page"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading products…</div>}>
      <ProductsPageClient />
    </Suspense>
  )
}

// Ensure Netlify/Next handles this as a dynamic route
export const dynamic = "force-dynamic"

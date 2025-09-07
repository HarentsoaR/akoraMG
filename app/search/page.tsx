import { Suspense } from "react"
import SearchClient from "./search-client"

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Searching…</div>}>
      <SearchClient />
    </Suspense>
  )
}

export const dynamic = "force-dynamic"



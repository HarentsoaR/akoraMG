"use client"

import { Header } from "@/components/layout/header"
import { useProducts } from "@/components/providers/products-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function DashboardProductsPage() {
  const { products, deleteProduct } = useProducts()
  const { user } = useAuth() as any
  const router = useRouter()

  const myProducts = products.filter((p) => !p.createdBy || p.createdBy === user?.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button onClick={() => router.push("/dashboard/products/new")}>Add New</Button>
        </div>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Owner</th>
                  <th className="text-left p-3"></th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} className="h-10 w-10 rounded object-cover" />
                        <div className="font-medium">{p.name}</div>
                        {p.isNew && <Badge className="ml-2">New</Badge>}
                      </div>
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{formatPrice(p.price)}</td>
                    <td className="p-3">{p.inStock ? "In stock" : "Out"}</td>
                    <td className="p-3 text-xs text-muted-foreground">{p.createdBy || "system"}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/products/${p.id}`)}>View</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteProduct(p.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



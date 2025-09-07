"use client"

import { Header } from "@/components/layout/header"
import { useOrders } from "@/components/providers/orders-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

const statusOptions = ["pending", "paid", "shipped", "delivered", "cancelled"] as const

export default function DashboardOrdersPage() {
  const { orders, updateOrderStatus } = useOrders()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Order</th>
                  <th className="text-left p-3">Items</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3">#{o.id}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {o.items.slice(0, 3).map((it) => (
                          <img key={it.productId} src={it.image} className="h-8 w-8 rounded object-cover" />
                        ))}
                        {o.items.length > 3 && <span className="text-xs text-muted-foreground">+{o.items.length - 3}</span>}
                      </div>
                    </td>
                    <td className="p-3">{o.customer.name}</td>
                    <td className="p-3">{formatPrice(o.total)}</td>
                    <td className="p-3"><Badge>{o.status}</Badge></td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {statusOptions.map((s) => (
                          <Button key={s} size="sm" variant={o.status === s ? "default" : "outline"} onClick={() => updateOrderStatus(o.id, s)}>
                            {s}
                          </Button>
                        ))}
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



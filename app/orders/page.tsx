"use client"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { useOrders } from "@/components/providers/orders-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export default function UserOrdersPage() {
  const { orders } = useOrders()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">No orders yet.</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Card key={o.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Order #{o.id}</CardTitle>
                  <Badge>{o.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {o.items.map((it) => (
                    <div key={it.productId} className="flex items-center gap-3">
                      <img src={it.image} className="h-12 w-12 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{it.name}</div>
                        <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
                      </div>
                      <div className="text-sm">{formatPrice(it.price * it.quantity)}</div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-semibold">{formatPrice(o.total)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <MobileNavigation />
    </div>
  )
}



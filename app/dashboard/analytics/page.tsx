"use client"

import { Header } from "@/components/layout/header"
import { useOrders } from "@/components/providers/orders-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  const { orders } = useOrders()

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const totalOrders = orders.length
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0
  const byStatus = orders.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }), {})

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">MGA {totalRevenue.toLocaleString()}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{totalOrders}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avg Order Value</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">MGA {avgOrder.toLocaleString()}</CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
          {Object.entries(byStatus).map(([status, count]) => (
            <Card key={status}>
              <CardHeader><CardTitle className="capitalize">{status}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{count}</CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}



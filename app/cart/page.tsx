"use client"

import { useCart } from "@/components/providers/cart-provider"
import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr,360px]">
            <Card>
              <CardContent className="p-0 divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium leading-tight">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">by {item.artisan}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                          {item.originalPrice && (
                            <div className="text-xs text-muted-foreground line-through">{formatPrice(item.originalPrice)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <Badge variant="secondary">{totalItems}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <Button className="w-full">Checkout</Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>Clear cart</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <MobileNavigation />
    </div>
  )
}



"use client"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">No reviews yet. This will display your product reviews.</CardContent>
        </Card>
      </main>
      <MobileNavigation />
    </div>
  )
}



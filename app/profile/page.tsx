"use client"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth() as any

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {isLoading ? (
          <div>Loading…</div>
        ) : user ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between"><span>Name</span><span className="font-medium">{user.name}</span></div>
                <div className="flex items-center justify-between"><span>Email</span><span className="font-medium">{user.email}</span></div>
                <div className="flex items-center justify-between"><span>Role</span><Badge variant="secondary">{user.role}</Badge></div>
                <Button variant="outline" onClick={logout}>Log out</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Orders, reviews and settings pages can be linked from here.
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">You are not logged in.</p>
              <Button onClick={() => window.location.assign("/login")}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <MobileNavigation />
    </div>
  )
}



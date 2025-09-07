"use client"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { UserProfileManager } from "@/components/user/user-profile-manager"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          {user && (
            <Button variant="outline" onClick={logout}>
              Log out
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        ) : user ? (
          <UserProfileManager />
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-muted-foreground">You are not logged in.</p>
              <Button onClick={() => window.location.assign("/auth/login")}>
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



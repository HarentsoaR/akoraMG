"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { UserService } from "@/lib/services/user-service"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Signing you in...")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setMessage("Processing authentication...")
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session error:", sessionError)
          setStatus("error")
          setMessage("Authentication failed. Please try again.")
          setTimeout(() => router.replace("/auth/login"), 3000)
          return
        }

        if (!session?.user) {
          setStatus("error")
          setMessage("No user found. Redirecting to login...")
          setTimeout(() => router.replace("/auth/login"), 2000)
          return
        }

        setMessage("Setting up your profile...")
        
        // Sync user data with our database
        const userProfile = await UserService.createOrUpdateUserProfile(session.user)
        
        if (userProfile) {
          setStatus("success")
          setMessage("Welcome! Setting up your account...")
          
          // Small delay to show success message
          setTimeout(() => {
            router.replace("/")
          }, 1500)
        } else {
          setStatus("error")
          setMessage("Failed to set up profile. Please try again.")
          setTimeout(() => router.replace("/auth/login"), 3000)
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
        setTimeout(() => router.replace("/auth/login"), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            {status === "loading" && <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />}
            {status === "success" && <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />}
            {status === "error" && <XCircle className="h-12 w-12 text-red-500 mx-auto" />}
          </div>
          
          <h2 className="text-xl font-semibold mb-2">
            {status === "loading" && "Signing you in..."}
            {status === "success" && "Welcome!"}
            {status === "error" && "Authentication Error"}
          </h2>
          
          <p className="text-muted-foreground mb-4">{message}</p>
          
          {status === "loading" && (
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



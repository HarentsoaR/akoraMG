"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { UserService } from "@/lib/services/user-service"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

// Helper function to get the appropriate redirect URL based on environment
const getRedirectUrl = () => {
  // Check if we're in production (deployed on Netlify)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // If we're on the production domain, redirect to production
    if (hostname === 'akoramg.netlify.app' || hostname === 'fivoarana.netlify.app') {
      return 'https://akoramg.netlify.app/'
    }
    // For localhost or any other domain, redirect to home
    return '/'
  }
  // Fallback for SSR
  return '/'
}

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Signing you in...")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setMessage("Processing authentication...")
        
        // Handle the auth callback by getting the session from the URL
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Session error:", error)
          setStatus("error")
          setMessage("Authentication failed. Please try again.")
          setTimeout(() => {
            const redirectUrl = getRedirectUrl()
            if (redirectUrl.startsWith('http')) {
              window.location.href = redirectUrl + 'auth/login'
            } else {
              router.replace("/auth/login")
            }
          }, 3000)
          return
        }

        const { session } = data

        // If no session, try to get it from the URL hash
        if (!session?.user) {
          // Check if we have auth data in the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken) {
            // Set the session manually
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            })
            
            if (sessionError || !sessionData.session?.user) {
              setStatus("error")
              setMessage("Invalid session. Redirecting to login...")
              setTimeout(() => {
                const redirectUrl = getRedirectUrl()
                if (redirectUrl.startsWith('http')) {
                  window.location.href = redirectUrl + 'auth/login'
                } else {
                  router.replace("/auth/login")
                }
              }, 2000)
              return
            }
            
            // Use the new session
            const { session: newSession } = sessionData
            if (!newSession?.user) {
              setStatus("error")
              setMessage("No user found. Redirecting to login...")
              setTimeout(() => {
                const redirectUrl = getRedirectUrl()
                if (redirectUrl.startsWith('http')) {
                  window.location.href = redirectUrl + 'auth/login'
                } else {
                  router.replace("/auth/login")
                }
              }, 2000)
              return
            }
            
            // Continue with the new session
            await processUserSession(newSession)
            return
          } else {
            setStatus("error")
            setMessage("No user found. Redirecting to login...")
            setTimeout(() => {
              const redirectUrl = getRedirectUrl()
              if (redirectUrl.startsWith('http')) {
                window.location.href = redirectUrl + 'auth/login'
              } else {
                router.replace("/auth/login")
              }
            }, 2000)
            return
          }
        }
        
        // Process the session
        await processUserSession(session)
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
        setTimeout(() => {
          const redirectUrl = getRedirectUrl()
          if (redirectUrl.startsWith('http')) {
            window.location.href = redirectUrl + 'auth/login'
          } else {
            router.replace("/auth/login")
          }
        }, 3000)
      }
    }

    const processUserSession = async (session: any) => {
      try {
        setMessage("Setting up your profile...")
        
        // Sync user data with our database
        const userProfile = await UserService.createOrUpdateUserProfile(session.user)
        
        if (userProfile) {
          setStatus("success")
          setMessage("Welcome! Setting up your account...")
          
          // Small delay to show success message
          setTimeout(() => {
            const redirectUrl = getRedirectUrl()
            if (redirectUrl.startsWith('http')) {
              // For external URLs, use window.location
              window.location.href = redirectUrl
            } else {
              // For internal routes, use Next.js router
              router.replace(redirectUrl)
            }
          }, 1500)
        } else {
          setStatus("error")
          setMessage("Failed to set up profile. Please try again.")
          setTimeout(() => {
            const redirectUrl = getRedirectUrl()
            if (redirectUrl.startsWith('http')) {
              window.location.href = redirectUrl + 'auth/login'
            } else {
              router.replace("/auth/login")
            }
          }, 3000)
        }
      } catch (error) {
        console.error("Profile setup error:", error)
        setStatus("error")
        setMessage("Failed to set up profile. Please try again.")
        setTimeout(() => {
          const redirectUrl = getRedirectUrl()
          if (redirectUrl.startsWith('http')) {
            window.location.href = redirectUrl + 'auth/login'
          } else {
            router.replace("/auth/login")
          }
        }, 3000)
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



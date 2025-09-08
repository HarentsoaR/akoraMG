"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { UserService } from "@/lib/services/user-service"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

// Helper function to get the post-login redirect URL
const getRedirectUrl = () => {
  // If a public site URL is configured, use it (ensures emails always go to prod)
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return `${fromEnv}/`
  // Fallback to current origin when env not set
  if (typeof window !== 'undefined') return '/'
  return '/'
}

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url !== 'your_supabase_project_url_here' && key !== 'your_supabase_anon_key_here')
}

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Signing you in...")

  useEffect(() => {
    // Check if Supabase is configured first
    if (!isSupabaseConfigured()) {
      setStatus("error")
      setMessage("Supabase not configured. Please set up your environment variables.")
      return
    }

    // Set up timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (status === "loading") {
        setStatus("error")
        setMessage("Authentication timed out. Please try again.")
        setTimeout(() => {
          const redirectUrl = getRedirectUrl()
          if (redirectUrl.startsWith('http')) {
            window.location.href = redirectUrl + 'auth/login'
          } else {
            router.replace("/auth/login")
          }
        }, 3000)
      }
    }, 10000) // 10 second timeout

    const handleAuthCallback = async () => {
      try {
        setMessage("Processing authentication...")
        
        // Handle the auth callback by getting the session from the URL
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Session error:", error)
          setStatus("error")
          setMessage(`Authentication failed: ${error.message}`)
          clearTimeout(timeoutId)
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
        setMessage(`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`)
        clearTimeout(timeoutId)
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
          clearTimeout(timeoutId)
          
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
          clearTimeout(timeoutId)
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
        setMessage(`Failed to set up profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
        clearTimeout(timeoutId)
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

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            {status === "loading" && <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />}
            {status === "success" && <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />}
            {status === "error" && (
              message.includes("Supabase not configured") ? 
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" /> :
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-2">
            {status === "loading" && "Signing you in..."}
            {status === "success" && "Welcome!"}
            {status === "error" && (
              message.includes("Supabase not configured") ? 
                "Configuration Required" : 
                "Authentication Error"
            )}
          </h2>
          
          <p className="text-muted-foreground mb-4">{message}</p>
          
          {status === "error" && message.includes("Supabase not configured") && (
            <div className="text-sm text-muted-foreground mb-4 p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">To fix this:</p>
              <ol className="text-left space-y-1">
                <li>1. Create a <code className="bg-background px-1 rounded">.env.local</code> file</li>
                <li>2. Add your Supabase credentials</li>
                <li>3. Restart your development server</li>
              </ol>
            </div>
          )}
          
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


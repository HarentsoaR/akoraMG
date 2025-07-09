"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "artisan" | "customer"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token and validate
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        if (token) {
          // In a real app, validate token with backend
          setUser({
            id: "1",
            name: "Rasoa Andry",
            email: "rasoa@fivoarana.mg",
            role: "customer",
          })
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, make API call to authenticate
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      const mockUser: User = {
        id: "1",
        name: "Rasoa Andry",
        email,
        role: email.includes("artisan") ? "artisan" : "customer",
      }

      setUser(mockUser)
      localStorage.setItem("auth-token", "mock-token")
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true)
    try {
      // In a real app, make API call to register
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "customer",
      }

      setUser(newUser)
      localStorage.setItem("auth-token", "mock-token")
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
  }

  return <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import { useEffect, useState, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface AutoSkeletonProps {
  children: React.ReactNode
  isLoading: boolean
  className?: string
}

// Smart skeleton generator that analyzes content structure
export function AutoSkeleton({ children, isLoading, className = "" }: AutoSkeletonProps) {
  const [skeletonContent, setSkeletonContent] = useState<React.ReactNode>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading || !contentRef.current) {
      setSkeletonContent(null)
      return
    }

    const generateSmartSkeleton = () => {
      const content = contentRef.current
      if (!content) return

      // Analyze the content structure
      const sections = content.querySelectorAll('section, main > div, .container')
      const hasGrid = content.querySelector('[class*="grid"]')
      const hasCards = content.querySelector('[class*="card"], .product-card, .artisan-card')
      const hasHero = content.querySelector('h1, .hero, [class*="hero"]')
      const hasSearch = content.querySelector('input[type="search"], .search')
      const hasFilters = content.querySelector('[class*="filter"], .sidebar')
      const hasPagination = content.querySelector('[class*="pagination"], .pagination')

      const skeletonElements: React.ReactNode[] = []

      // Hero section skeleton
      if (hasHero) {
        skeletonElements.push(
          <section key="hero" className="bg-gradient-to-r from-primary/5 to-orange-500/5 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-6">
                <Skeleton className="h-12 w-80 mx-auto rounded-lg" />
                <Skeleton className="h-6 w-96 mx-auto rounded" />
                {hasSearch && (
                  <div className="max-w-2xl mx-auto relative mt-8">
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                )}
                <div className="flex gap-4 justify-center mt-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      }

      // Category overview skeleton (if exists)
      const hasCategoryOverview = content.querySelector('[class*="category"], .overview')
      if (hasCategoryOverview) {
        skeletonElements.push(
          <section key="category-overview" className="py-12">
            <div className="container mx-auto px-4">
              <div className="overflow-hidden rounded-2xl border bg-card/50">
                <div className="grid md:grid-cols-3">
                  <div className="p-8 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-56 mb-3 rounded-lg" />
                    <Skeleton className="h-5 w-full mb-4 rounded" />
                    <Skeleton className="h-4 w-4/5 mb-6 rounded" />
                    <div className="flex flex-wrap gap-3">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-22 rounded-full" />
                    </div>
                  </div>
                  <div className="relative hidden md:block">
                    <Skeleton className="absolute inset-0 h-full w-full rounded-r-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }

      // Main content section
      skeletonElements.push(
        <section key="main-content" className="py-12">
          <div className="container mx-auto px-4">
            <div className={`${hasFilters ? 'grid md:grid-cols-[280px,1fr] gap-8' : ''}`}>
              {/* Filters skeleton */}
              {hasFilters && (
                <div className="hidden md:block">
                  <Card className="sticky top-24 border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-8">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                      </div>
                      <div className="space-y-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i}>
                            <Skeleton className="h-5 w-24 mb-4" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                {/* Top bar skeleton */}
                <div className="flex items-center justify-between mb-8">
                  <Skeleton className="h-7 w-40" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-24 md:hidden" />
                    <Skeleton className="h-10 w-48" />
                    <div className="flex border rounded-lg">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                </div>

                {/* Content grid skeleton */}
                {hasGrid && hasCards ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Card key={i} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative overflow-hidden">
                          <Skeleton className="h-56 w-full rounded-t-lg" />
                          <div className="absolute left-4 top-4 flex flex-col gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>
                          <div className="absolute right-4 top-4 flex flex-col gap-2">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <Skeleton className="h-9 w-9 rounded-lg" />
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-6 w-20 rounded-full" />
                              <div className="flex items-center gap-1">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-8" />
                              </div>
                            </div>
                            <div>
                              <Skeleton className="h-6 w-4/5 mb-3" />
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-7 w-7 rounded-full" />
                                <Skeleton className="h-5 w-28" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-2">
                                <Skeleton className="h-7 w-24" />
                                <Skeleton className="h-5 w-20" />
                              </div>
                              <Skeleton className="h-10 w-10 rounded-lg" />
                            </div>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : hasCards ? (
                  <div className="space-y-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex cursor-pointer border-0 shadow-sm">
                        <div className="relative w-56 h-40 overflow-hidden">
                          <Skeleton className="w-full h-full rounded-l-lg" />
                        </div>
                        <CardContent className="p-6 flex-1">
                          <div className="flex items-start justify-between h-full">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                              </div>
                              <Skeleton className="h-6 w-4/5 mb-3" />
                              <div className="flex items-center gap-2 text-sm mb-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-1" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-1" />
                                <Skeleton className="h-4 w-16" />
                              </div>
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <Skeleton className="h-7 w-24 mb-2" />
                              <Skeleton className="h-5 w-20" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                )}

                {/* Pagination skeleton */}
                {hasPagination && (
                  <div className="flex items-center justify-between mt-12">
                    <Skeleton className="h-5 w-40" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-20 rounded-lg" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-10 w-20 rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )

      // Highlights section skeleton
      const hasHighlights = content.querySelector('[class*="highlight"], .stats, .features')
      if (hasHighlights) {
        skeletonElements.push(
          <section key="highlights" className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="grid gap-8 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-8">
                      <Skeleton className="h-7 w-40 mb-3" />
                      <Skeleton className="h-5 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )
      }

      setSkeletonContent(skeletonElements)
    }

    // Small delay to ensure content is rendered
    const timer = setTimeout(generateSmartSkeleton, 100)
    
    return () => clearTimeout(timer)
  }, [isLoading])

  if (isLoading) {
    return (
      <div className={className}>
        {skeletonContent || (
          <div className="space-y-12">
            {/* Hero section fallback */}
            <section className="bg-gradient-to-r from-primary/5 to-orange-500/5 py-16">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-6">
                  <Skeleton className="h-12 w-80 mx-auto rounded-lg" />
                  <Skeleton className="h-6 w-96 mx-auto rounded" />
                  <div className="max-w-2xl mx-auto relative mt-8">
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                  <div className="flex gap-4 justify-center mt-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Main content fallback */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative overflow-hidden">
                        <Skeleton className="h-56 w-full rounded-t-lg" />
                        <div className="absolute left-4 top-4 flex flex-col gap-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="absolute right-4 top-4 flex flex-col gap-2">
                          <Skeleton className="h-9 w-9 rounded-lg" />
                          <Skeleton className="h-9 w-9 rounded-lg" />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4 rounded-full" />
                              <Skeleton className="h-4 w-10" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                          </div>
                          <div>
                            <Skeleton className="h-6 w-4/5 mb-3" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-7 w-7 rounded-full" />
                              <Skeleton className="h-5 w-28" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                              <Skeleton className="h-7 w-24" />
                              <Skeleton className="h-5 w-20" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-lg" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={contentRef} className={className}>
      {children}
    </div>
  )
}

// Simple hook for easy integration
export function useAutoSkeleton(isLoading: boolean) {
  return {
    AutoSkeletonWrapper: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <AutoSkeleton isLoading={isLoading} className={className}>
        {children}
      </AutoSkeleton>
    )
  }
}

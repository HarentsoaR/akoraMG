"use client"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, User, Mail, Calendar, MapPin, Star, Package, Edit3, Save, X } from "lucide-react"
import { motion } from "framer-motion"

export function UserProfileManager() {
  const { user, artisanProfile, updateUserProfile, createArtisanProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingArtisan, setIsCreatingArtisan] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatar_url: user?.avatar || "",
  })
  
  const [artisanFormData, setArtisanFormData] = useState({
    bio: "",
    location: "",
    years_experience: 0,
    crafts: [] as string[],
    accepts_custom_orders: false,
  })

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    )
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const success = await updateUserProfile(formData)
      if (success) {
        toast.success("Profile updated successfully!")
        setIsEditing(false)
      } else {
        toast.error("Failed to update profile. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateArtisanProfile = async () => {
    if (!artisanFormData.location.trim()) {
      toast.error("Location is required for artisan profile.")
      return
    }

    setIsLoading(true)
    try {
      const success = await createArtisanProfile(artisanFormData)
      if (success) {
        toast.success("Artisan profile created successfully!")
        setIsCreatingArtisan(false)
      } else {
        toast.error("Failed to create artisan profile. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addCraft = (craft: string) => {
    if (craft.trim() && !artisanFormData.crafts.includes(craft.trim())) {
      setArtisanFormData(prev => ({
        ...prev,
        crafts: [...prev.crafts, craft.trim()]
      }))
    }
  }

  const removeCraft = (craft: string) => {
    setArtisanFormData(prev => ({
      ...prev,
      crafts: prev.crafts.filter(c => c !== craft)
    }))
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={user.role === "artisan" ? "default" : "secondary"}>
              {user.role === "artisan" ? "Artisan" : "Customer"}
            </Badge>
            {user.updated_at && (
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date(user.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Artisan Profile Section */}
      {user.role === "artisan" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Artisan Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {artisanProfile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {artisanProfile.location}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Experience</Label>
                    <p>{artisanProfile.years_experience} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Rating</Label>
                    <p className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {artisanProfile.rating.toFixed(1)} ({artisanProfile.reviews_count} reviews)
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Products</Label>
                    <p>{artisanProfile.products_count} products</p>
                  </div>
                </div>
                
                {artisanProfile.bio && (
                  <div>
                    <Label className="text-sm font-medium">Bio</Label>
                    <p className="text-sm text-muted-foreground mt-1">{artisanProfile.bio}</p>
                  </div>
                )}
                
                {artisanProfile.crafts.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Crafts</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {artisanProfile.crafts.map((craft, index) => (
                        <Badge key={index} variant="outline">{craft}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant={artisanProfile.accepts_custom_orders ? "default" : "secondary"}>
                    {artisanProfile.accepts_custom_orders ? "Accepts Custom Orders" : "No Custom Orders"}
                  </Badge>
                  {artisanProfile.featured && (
                    <Badge variant="default">Featured Artisan</Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No artisan profile found.</p>
                <Button onClick={() => setIsCreatingArtisan(true)}>
                  Create Artisan Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Become an Artisan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create an artisan profile to start selling your handmade crafts on Fivoarana.
            </p>
            <Button onClick={() => setIsCreatingArtisan(true)}>
              Create Artisan Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Artisan Profile Modal */}
      {isCreatingArtisan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Artisan Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={artisanFormData.location}
                  onChange={(e) => setArtisanFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Antananarivo, Madagascar"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={artisanFormData.bio}
                  onChange={(e) => setArtisanFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your craft and experience..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={artisanFormData.years_experience}
                  onChange={(e) => setArtisanFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label>Custom Orders</Label>
                <Select
                  value={artisanFormData.accepts_custom_orders ? "yes" : "no"}
                  onValueChange={(value) => setArtisanFormData(prev => ({ ...prev, accepts_custom_orders: value === "yes" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, I accept custom orders</SelectItem>
                    <SelectItem value="no">No, I only sell existing products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingArtisan(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateArtisanProfile}
                  disabled={isLoading || !artisanFormData.location.trim()}
                  className="flex-1"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

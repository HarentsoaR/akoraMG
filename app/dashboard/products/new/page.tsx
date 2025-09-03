"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Camera, Sparkles, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    materials: "",
    dimensions: "",
    weight: "",
    culturalSignificance: "",
    quantity: "",
  })

  const steps = [
    { id: 1, title: "Photos", description: "Upload product images" },
    { id: 2, title: "Basic Info", description: "Name, category, and price" },
    { id: 3, title: "Description", description: "Product details and story" },
    { id: 4, title: "Inventory", description: "Stock and tracking" },
    { id: 5, title: "Review", description: "Final review and publish" },
  ]

  const categories = [
    "Textiles",
    "Wood Carving",
    "Jewelry",
    "Basketry",
    "Pottery",
    "Metalwork",
    "Leather Goods",
    "Stone Carving",
  ]

  const generateAIDescription = async () => {
    // Simulate AI generation
    const aiDescription = `This exquisite ${formData.name.toLowerCase()} represents the finest traditions of Malagasy craftsmanship. Handcrafted using time-honored techniques passed down through generations, this piece showcases the rich cultural heritage of Madagascar. Each detail reflects the artisan's dedication to preserving authentic methods while creating something truly unique for the modern world.`

    setFormData((prev) => ({ ...prev, description: aiDescription }))
  }

  const suggestAIPrice = async () => {
    // Simulate AI price suggestion
    const suggestedPrice = Math.floor(Math.random() * 100000) + 50000
    setFormData((prev) => ({ ...prev, price: suggestedPrice.toString() }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload Product Photos</CardTitle>
              <CardDescription>Add high-quality images of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Take Photo</span>
                </div>
                <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Tip: Use natural lighting and show your product from multiple angles for best results.
              </p>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Basic Product Information</CardTitle>
              <CardDescription>Essential details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Hand-woven Raffia Basket"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="price">Price (MGA)</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                    <Label className="text-sm">AI Pricing</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    type="number"
                    placeholder="75000"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  />
                  {aiEnabled && (
                    <Button variant="outline" onClick={suggestAIPrice}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Suggest
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Product Description & Details</CardTitle>
              <CardDescription>Tell the story of your creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Product Description</Label>
                  <Button variant="outline" size="sm" onClick={generateAIDescription}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Description
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe your product, its creation process, and cultural significance..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materials">Materials Used</Label>
                  <Input
                    id="materials"
                    placeholder="e.g., Raffia palm, Natural dyes"
                    value={formData.materials}
                    onChange={(e) => setFormData((prev) => ({ ...prev, materials: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 30cm x 25cm x 15cm"
                    value={formData.dimensions}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cultural">Cultural Significance (Optional)</Label>
                <Textarea
                  id="cultural"
                  placeholder="Share the cultural meaning or traditional use of this item..."
                  rows={3}
                  value={formData.culturalSignificance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, culturalSignificance: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Set up stock tracking for your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity in Stock</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-tracking" />
                <Label htmlFor="auto-tracking">Enable Automated Inventory Tracking</Label>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">AI Inventory Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic low stock alerts</li>
                  <li>• Sales pattern analysis</li>
                  <li>• Restock recommendations</li>
                  <li>• Seasonal demand forecasting</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Publish</CardTitle>
              <CardDescription>Final review of your product listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="font-medium">Product Name:</span>
                  <span>{formData.name || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <Badge variant="secondary">{formData.category || "Not set"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span className="font-bold text-primary">
                    {formData.price ? formatPrice(Number.parseInt(formData.price)) : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Stock Quantity:</span>
                  <span>{formData.quantity || "Not set"}</span>
                </div>
              </div>

              {formData.description && (
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Publish Product
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">Create a new listing for your handcrafted item</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          <Button onClick={nextStep} disabled={currentStep === steps.length}>
            {currentStep === steps.length ? "Publish" : "Next"}
          </Button>
        </div>
      </main>
    </div>
  )
}

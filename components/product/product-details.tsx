"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  sku: string
  image_url: string
  gallery_urls: string[]
  stock_quantity: number
  tags: string[]
  categories?: {
    name: string
    slug: string
  }
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(product.image_url)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, isLoading } = useCart()

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const images = [product.image_url, ...(product.gallery_urls || [])]

  const handleAddToCart = async () => {
    await addToCart(product, quantity)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === image ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.categories && <Badge variant="secondary">{product.categories.name}</Badge>}

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.8) • 127 reviews</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.compare_at_price && (
              <>
                <span className="text-xl text-muted-foreground line-through">${product.compare_at_price}</span>
                <Badge variant="destructive">Save {discountPercentage}%</Badge>
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock_quantity} in stock</span>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isLoading}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <Truck className="h-6 w-6 mx-auto text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <RotateCcw className="h-6 w-6 mx-auto text-primary" />
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Easy returns</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-2">
                <Shield className="h-6 w-6 mx-auto text-primary" />
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-muted-foreground">1-year coverage</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

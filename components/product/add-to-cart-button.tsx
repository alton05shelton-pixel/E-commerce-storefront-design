"use client"

import type React from "react"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  slug: string
  stock_quantity: number
}

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "default",
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product, quantity)
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleAddToCart}
      disabled={isLoading || product.stock_quantity === 0}
    >
      <ShoppingCart className={size === "icon" ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {size !== "icon" && (isLoading ? "Adding..." : "Add to Cart")}
    </Button>
  )
}

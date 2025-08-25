"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"

export function CartPage() {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Shopping Cart ({itemCount} items)</h1>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">In stock: {item.stock_quantity}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span>Secure checkout</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

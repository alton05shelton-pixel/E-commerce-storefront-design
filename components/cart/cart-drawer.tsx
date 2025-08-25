"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"

interface CartDrawerProps {
  children: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart ({itemCount})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add some products to get started</p>
                </div>
                <Button asChild onClick={() => setIsOpen(false)}>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-2 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock_quantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent" onClick={() => setIsOpen(false)}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

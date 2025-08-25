"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard, Truck, Shield } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
}

interface CheckoutFormProps {
  user: User | null
  profile: Profile | null
}

interface ShippingInfo {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface PaymentInfo {
  card_number: string
  expiry_month: string
  expiry_year: string
  cvv: string
  cardholder_name: string
}

export function CheckoutForm({ user, profile }: CheckoutFormProps) {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  })

  const [billingInfo, setBillingInfo] = useState<ShippingInfo>({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  })

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    cardholder_name: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim(),
  })

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
    if (sameAsBilling) {
      setBillingInfo((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleBillingChange = (field: keyof ShippingInfo, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }))
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08 // 8% tax rate
  }

  const calculateShipping = (subtotal: number) => {
    return subtotal >= 50 ? 0 : 9.99 // Free shipping over $50
  }

  const tax = calculateTax(total)
  const shipping = calculateShipping(total)
  const finalTotal = total + tax + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create order
      const orderData = {
        user_id: user?.id || null,
        subtotal: total,
        tax_amount: tax,
        shipping_amount: shipping,
        total_amount: finalTotal,
        billing_address: billingInfo,
        shipping_address: shippingInfo,
        status: "pending",
      }

      const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await clearCart()

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.order_number} has been placed.`,
      })

      // Redirect to order confirmation
      router.push(`/orders/${order.order_number}/confirmation`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some items to your cart to proceed with checkout.</p>
          <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Shipping Information</span>
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_first_name">First Name</Label>
                      <Input
                        id="shipping_first_name"
                        value={shippingInfo.first_name}
                        onChange={(e) => handleShippingChange("first_name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_last_name">Last Name</Label>
                      <Input
                        id="shipping_last_name"
                        value={shippingInfo.last_name}
                        onChange={(e) => handleShippingChange("last_name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_email">Email</Label>
                      <Input
                        id="shipping_email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_phone">Phone</Label>
                      <Input
                        id="shipping_phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping_address_1">Address Line 1</Label>
                    <Input
                      id="shipping_address_1"
                      value={shippingInfo.address_line_1}
                      onChange={(e) => handleShippingChange("address_line_1", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping_address_2">Address Line 2 (Optional)</Label>
                    <Input
                      id="shipping_address_2"
                      value={shippingInfo.address_line_2}
                      onChange={(e) => handleShippingChange("address_line_2", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_city">City</Label>
                      <Input
                        id="shipping_city"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_state">State</Label>
                      <Input
                        id="shipping_state"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange("state", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_postal_code">Postal Code</Label>
                      <Input
                        id="shipping_postal_code"
                        value={shippingInfo.postal_code}
                        onChange={(e) => handleShippingChange("postal_code", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping_country">Country</Label>
                    <Select
                      value={shippingInfo.country}
                      onValueChange={(value) => handleShippingChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Payment and billing details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="same_as_shipping"
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => {
                        setSameAsBilling(checked as boolean)
                        if (checked) {
                          setBillingInfo(shippingInfo)
                        }
                      }}
                    />
                    <Label htmlFor="same_as_shipping">Same as shipping address</Label>
                  </div>

                  {!sameAsBilling && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing_first_name">First Name</Label>
                          <Input
                            id="billing_first_name"
                            value={billingInfo.first_name}
                            onChange={(e) => handleBillingChange("first_name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing_last_name">Last Name</Label>
                          <Input
                            id="billing_last_name"
                            value={billingInfo.last_name}
                            onChange={(e) => handleBillingChange("last_name", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billing_address_1">Address Line 1</Label>
                        <Input
                          id="billing_address_1"
                          value={billingInfo.address_line_1}
                          onChange={(e) => handleBillingChange("address_line_1", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing_city">City</Label>
                          <Input
                            id="billing_city"
                            value={billingInfo.city}
                            onChange={(e) => handleBillingChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing_state">State</Label>
                          <Input
                            id="billing_state"
                            value={billingInfo.state}
                            onChange={(e) => handleBillingChange("state", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing_postal_code">Postal Code</Label>
                          <Input
                            id="billing_postal_code"
                            value={billingInfo.postal_code}
                            onChange={(e) => handleBillingChange("postal_code", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Information</span>
                  </CardTitle>
                  <CardDescription>Enter your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardholder_name">Cardholder Name</Label>
                    <Input
                      id="cardholder_name"
                      value={paymentInfo.cardholder_name}
                      onChange={(e) => handlePaymentChange("cardholder_name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card_number">Card Number</Label>
                    <Input
                      id="card_number"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.card_number}
                      onChange={(e) => handlePaymentChange("card_number", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry_month">Month</Label>
                      <Select
                        value={paymentInfo.expiry_month}
                        onValueChange={(value) => handlePaymentChange("expiry_month", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                              {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry_year">Year</Label>
                      <Select
                        value={paymentInfo.expiry_year}
                        onValueChange={(value) => handlePaymentChange("expiry_year", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                              {new Date().getFullYear() + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    <p>Your payment information is secure and encrypted</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

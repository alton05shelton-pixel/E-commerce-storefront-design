"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Package, Truck, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  products: {
    name: string
    image_url: string
    slug: string
  } | null
}

interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  created_at: string
  shipping_address: any
  billing_address: any
  order_items: OrderItem[]
}

interface OrderConfirmationProps {
  order: Order
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const shippingAddress = order.shipping_address
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order #{order.order_number} has been received and is being processed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <Badge
                    className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">In Transit</p>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">{estimatedDelivery.toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.products?.image_url || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">
                    {shippingAddress.first_name} {shippingAddress.last_name}
                  </p>
                  <p>{shippingAddress.address_line_1}</p>
                  {shippingAddress.address_line_2 && <p>{shippingAddress.address_line_2}</p>}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Order #{order.order_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping_amount === 0 ? "Free" : `$${order.shipping_amount.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax_amount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

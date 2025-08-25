"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface OrderDetailsProps {
  order: Order
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const shippingAddress = order.shipping_address
  const billingAddress = order.billing_address

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/account/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
            <p className="text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
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
                        <Link
                          href={`/products/${item.products?.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product_name}
                        </Link>
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

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {billingAddress.first_name} {billingAddress.last_name}
                    </p>
                    <p>{billingAddress.address_line_1}</p>
                    {billingAddress.address_line_2 && <p>{billingAddress.address_line_2}</p>}
                    <p>
                      {billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}
                    </p>
                    <p>{billingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
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

                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {order.status !== "pending" && (
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">Processing</p>
                        <p className="text-sm text-muted-foreground">Order is being prepared</p>
                      </div>
                    </div>
                  )}
                  {(order.status === "shipped" || order.status === "delivered") && (
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">Shipped</p>
                        <p className="text-sm text-muted-foreground">Order is on its way</p>
                      </div>
                    </div>
                  )}
                  {order.status === "delivered" && (
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">Order has been delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

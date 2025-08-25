"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Calendar, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
  total_amount: number
  created_at: string
  order_items: OrderItem[]
}

interface OrdersListProps {
  orders: Order[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
              <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
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
      ))}
    </div>
  )
}

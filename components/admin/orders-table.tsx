"use client"

import { useState } from "react"
import { Calendar, Package, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  profiles?: {
    first_name: string | null
    last_name: string | null
    email: string
  }
  order_items: {
    quantity: number
    products: {
      name: string
    } | null
  }[]
}

interface OrdersTableProps {
  orders: Order[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const { toast } = useToast()
  const supabase = createClient()

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      toast({
        title: "Order updated",
        description: `Order status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCustomerName = (order: Order) => {
    if (order.profiles?.first_name || order.profiles?.last_name) {
      return `${order.profiles.first_name || ""} ${order.profiles.last_name || ""}`.trim()
    }
    return order.profiles?.email?.split("@")[0] || "Guest"
  }

  const getTotalItems = (order: Order) => {
    return order.order_items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.id.slice(0, 8)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{getCustomerName(order)}</p>
                        <p className="text-sm text-muted-foreground">{order.profiles?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{getTotalItems(order)} items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

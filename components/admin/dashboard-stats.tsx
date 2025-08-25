"use client"

import Link from "next/link"
import { Package, ShoppingCart, Users, TrendingUp, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardStatsProps {
  stats: {
    totalProducts: number
    totalOrders: number
    totalCustomers: number
    recentOrders: any[]
  }
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Active products in store",
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "Orders received",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      description: "Registered users",
      icon: Users,
      href: "/admin/customers",
    },
    {
      title: "Revenue",
      value: "$12,345",
      description: "This month",
      icon: TrendingUp,
      href: "/admin/analytics",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Button asChild variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                <Link href={stat.href}>
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.first_name || order.profiles?.email?.split("@")[0] || "Guest"}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                    <Badge
                      className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

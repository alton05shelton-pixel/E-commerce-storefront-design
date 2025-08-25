import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  // Get all orders with customer info
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles (
        first_name,
        last_name,
        email
      ),
      order_items (
        quantity,
        products (
          name
        )
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
          </div>

          <OrdersTable orders={orders || []} />
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

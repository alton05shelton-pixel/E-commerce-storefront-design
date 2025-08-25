import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"

export default async function AdminDashboard() {
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

  // Get dashboard stats
  const [{ count: totalProducts }, { count: totalOrders }, { count: totalCustomers }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select(
          `
        *,
        profiles (
          first_name,
          last_name,
          email
        )
      `,
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  const stats = {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    recentOrders: recentOrders || [],
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard</p>
          </div>

          <DashboardStats stats={stats} />
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

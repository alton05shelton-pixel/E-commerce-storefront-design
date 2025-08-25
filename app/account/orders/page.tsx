import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrdersList } from "@/components/account/orders-list"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user orders
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          name,
          image_url,
          slug
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-muted-foreground">View and track your order history.</p>
              </div>

              <OrdersList orders={orders || []} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

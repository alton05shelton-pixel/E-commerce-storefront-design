import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderDetails } from "@/components/orders/order-details"

interface OrderPageProps {
  params: {
    orderNumber: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get order details
  const { data: order } = await supabase
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
    .eq("order_number", params.orderNumber)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <OrderDetails order={order} />
      </main>

      <Footer />
    </div>
  )
}

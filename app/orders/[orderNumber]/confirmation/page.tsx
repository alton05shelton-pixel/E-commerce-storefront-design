import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderConfirmation } from "@/components/orders/order-confirmation"

interface OrderConfirmationPageProps {
  params: {
    orderNumber: string
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const supabase = await createClient()

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
    .single()

  if (!order) {
    notFound()
  }

  // Check if user has access to this order
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (order.user_id && (!user || user.id !== order.user_id)) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <OrderConfirmation order={order} />
      </main>

      <Footer />
    </div>
  )
}

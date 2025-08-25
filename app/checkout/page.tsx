import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if authenticated
  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <CheckoutForm user={user} profile={profile} />
      </main>

      <Footer />
    </div>
  )
}

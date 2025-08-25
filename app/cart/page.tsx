import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartPage } from "@/components/cart/cart-page"

export default function Cart() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <CartPage />
      </main>

      <Footer />
    </div>
  )
}

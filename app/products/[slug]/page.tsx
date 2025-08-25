import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductDetails } from "@/components/product/product-details"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  // Fetch product by slug
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <ProductDetails product={product} />
      </main>

      <Footer />
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/product/product-grid"

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch all active products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">All Products</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our complete collection of premium products, carefully selected for quality and innovation.
              </p>
            </div>

            {products && products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

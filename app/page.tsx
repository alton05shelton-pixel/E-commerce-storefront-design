import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { ProductGrid } from "@/components/product/product-grid"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("is_active", true)
    .limit(8)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <CategoryShowcase />

        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <ProductGrid products={featuredProducts} title="Featured Products" />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

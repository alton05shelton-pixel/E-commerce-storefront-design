import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  slug: string
  image_url: string
  featured: boolean
  tags: string[]
}

interface ProductGridProps {
  products: Product[]
  title?: string
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="space-y-6">
      {title && (
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-muted-foreground">Discover our curated selection of premium products</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

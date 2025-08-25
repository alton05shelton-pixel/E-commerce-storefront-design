import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "./add-to-cart-button"

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
  stock_quantity: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>}
        {discountPercentage > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            -{discountPercentage}%
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AddToCartButton product={product} size="icon" />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">${product.price}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

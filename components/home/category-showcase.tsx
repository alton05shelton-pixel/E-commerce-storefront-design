import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Latest tech and gadgets",
    image: "/modern-electronics.png",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    name: "Clothing",
    slug: "clothing",
    description: "Fashion for every occasion",
    image: "/modern-fashion-clothing.png",
    color: "from-purple-500/10 to-purple-600/5",
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    description: "Transform your living space",
    image: "/modern-home-decor.png",
    color: "from-green-500/10 to-green-600/5",
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Gear for active lifestyle",
    image: "/assorted-sports-gear.png",
    color: "from-orange-500/10 to-orange-600/5",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated categories, each featuring premium products selected for quality and
            innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.slug} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <Link href={`/categories/${category.slug}`}>
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

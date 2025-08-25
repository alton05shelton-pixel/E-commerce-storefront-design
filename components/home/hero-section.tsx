import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                New Collection Available
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Premium Products for
                <span className="text-primary"> Modern Living</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Discover exceptional quality and innovative design in every product. Curated for those who appreciate
                the finer things in life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Premium Support</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-32 w-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-primary" />
                </div>
                <p className="text-muted-foreground">Premium Product Showcase</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

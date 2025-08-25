import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MS</span>
              </div>
              <span className="font-bold text-xl">ModernStore</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium e-commerce experience with exceptional quality products and modern design.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                Deals
              </Link>
              <Link href="/new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors">
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                Returns
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ModernStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

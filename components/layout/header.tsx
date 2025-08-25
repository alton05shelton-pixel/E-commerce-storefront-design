"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { UserMenu } from "@/components/auth/user-menu"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MS</span>
            </div>
            <span className="font-bold text-xl">ModernStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              All Products
            </Link>
            <Link href="/categories/electronics" className="text-sm font-medium hover:text-primary transition-colors">
              Electronics
            </Link>
            <Link href="/categories/clothing" className="text-sm font-medium hover:text-primary transition-colors">
              Clothing
            </Link>
            <Link href="/categories/home-garden" className="text-sm font-medium hover:text-primary transition-colors">
              Home & Garden
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </CartDrawer>
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <nav className="flex flex-col space-y-2">
                <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors py-2">
                  All Products
                </Link>
                <Link
                  href="/categories/electronics"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Electronics
                </Link>
                <Link
                  href="/categories/clothing"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Clothing
                </Link>
                <Link
                  href="/categories/home-garden"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  Home & Garden
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

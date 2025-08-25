import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { AdminAuthProvider } from "@/lib/admin-auth"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "ModernStore - Premium E-commerce Experience",
  description: "Discover premium products with exceptional quality and modern design",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <AdminAuthProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

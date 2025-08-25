"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  is_active: boolean
  featured: boolean
  image_url: string
  slug: string
  categories?: {
    name: string
    slug: string
  }
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error

      setProducts(products.filter((p) => p.id !== productId))
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", productId)

      if (error) throw error

      setProducts(products.map((p) => (p.id === productId ? { ...p, is_active: !currentStatus } : p)))
      toast({
        title: "Product updated",
        description: `Product has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.categories ? (
                      <Badge variant="secondary">{product.categories.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">No category</span>
                    )}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {product.featured && <Badge variant="outline">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActive(product.id, product.is_active)}>
                          {product.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

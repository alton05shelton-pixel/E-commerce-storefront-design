import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  // Get all products with categories
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name,
        slug
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          <ProductsTable products={products || []} />
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

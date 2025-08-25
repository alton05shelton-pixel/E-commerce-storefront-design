import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProfileForm } from "@/components/account/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences.</p>
              </div>

              <ProfileForm user={user} profile={profile} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

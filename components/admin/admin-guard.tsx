"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useAdminAuth } from "@/lib/admin-auth"
import { Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (!isAdmin) {
        router.push("/")
        return
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, router])

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}

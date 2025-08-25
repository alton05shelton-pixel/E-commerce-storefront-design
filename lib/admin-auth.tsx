"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"

interface AdminAuthContextType {
  isAdmin: boolean
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

        setIsAdmin(profile?.is_admin || false)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, supabase])

  return <AdminAuthContext.Provider value={{ isAdmin, loading }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

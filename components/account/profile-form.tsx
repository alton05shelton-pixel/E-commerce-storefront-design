"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
}

interface ProfileFormProps {
  user: User
  profile: Profile | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || user.email || "",
    phone: profile?.phone || "",
  })
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and contact information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
